const API_PREFIX = '/api/inventory';
const DETAIL_TEMPLATE_URL = 'https://cult-cars.pages.dev/car/index.html';
const STORAGE_KEYS = {
  cars: 'inventory/cars.json',
  normalized: 'inventory/normalized.json',
  status: 'inventory/status.json',
  chunkPrefix: 'inventory/chunks'
};

const DETAIL_LABELS = {
  fuel: ['Паливо'],
  engine: ['Двигун'],
  drive: ['Привід'],
  color: ['Колір'],
  damage: ['Пошкодження'],
  docs: ['Розмитнення', 'Документи'],
  bodyType: ['Тип кузова', 'Кузов'],
  transmission: ['Коробка передач', 'Коробка', 'Тип КПП'],
  origin: ['Походження'],
  location: ['Знаходиться в місті', 'Місто']
};

const CARD_PATTERNS = {
  detailHref: /(?:href="|href=')?(\/store\/instoreusers\/(\d+))(?:"|')?/g,
  price: /(\d[\d\s]{1,12})\s*\$/i,
  mileage: /(\d+(?:[\s.,]\d+)?)\s*(тис\.)?\s*км/i,
  engine: /(\d(?:[.,]\d)?)\s*л/i,
  year: /\b(20\d{2}|19\d{2})\b/
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    if ((request.method === 'GET' || request.method === 'HEAD') && (pathname === '/car' || pathname === '/car/index.html')) {
      return fetchCarTemplateResponse(request);
    }

    const carSlugMatch = pathname.match(/^\/car\/([^/]+)$/i);
    if ((request.method === 'GET' || request.method === 'HEAD') && carSlugMatch) {
      return renderCarDetailSeoResponse(request, env, decodeURIComponent(carSlugMatch[1] || ''));
    }

    if (request.method === 'OPTIONS' && pathname.startsWith(API_PREFIX)) {
      return new Response(null, { headers: corsHeaders() });
    }

    if (pathname === `${API_PREFIX}/cars.json`) {
      const payload = await env.CULT_CARS_INVENTORY.get(STORAGE_KEYS.cars);
      return new Response(payload || '[]', {
        headers: jsonHeaders({
          'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400'
        })
      });
    }

    if (pathname === `${API_PREFIX}/status`) {
      const payload = await env.CULT_CARS_INVENTORY.get(STORAGE_KEYS.status);
      return new Response(payload || JSON.stringify({ ready: false }, null, 2), {
        headers: jsonHeaders({ 'Cache-Control': 'no-store' })
      });
    }

    if (pathname === `${API_PREFIX}/sitemap.xml`) {
      const payload = await env.CULT_CARS_INVENTORY.get(STORAGE_KEYS.cars);
      let records = [];

      try {
        records = payload ? JSON.parse(payload) : [];
      } catch (error) {
        records = [];
      }

      return new Response(buildInventorySitemapXml(records), {
        headers: xmlHeaders({
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
        })
      });
    }

    if (pathname === `${API_PREFIX}/sync`) {
      if (!isAuthorized(request, url, env)) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }, null, 2), {
          status: 403,
          headers: jsonHeaders({ 'Cache-Control': 'no-store' })
        });
      }

      const mode = String(url.searchParams.get('mode') || '').trim().toLowerCase();
      const runId = String(url.searchParams.get('runId') || getKyivRunId()).trim();

      try {
        let summary;
        if (mode === 'chunk') {
          const chunkIndex = Math.max(0, Number(url.searchParams.get('chunk') || 0));
          summary = await processListingChunk(env, chunkIndex, runId);
        } else if (mode === 'finalize') {
          summary = await finalizeChunkedRun(env, runId, 'manual-finalize');
        } else {
          summary = {
            ok: true,
            runId,
            message: 'Nightly sync runs automatically. For manual control use `mode=chunk&chunk=N` and then `mode=finalize`.'
          };
        }

        return new Response(JSON.stringify({ ok: true, summary }, null, 2), {
          headers: jsonHeaders({ 'Cache-Control': 'no-store' })
        });
      } catch (error) {
        return new Response(JSON.stringify({
          ok: false,
          error: error && error.message ? error.message : String(error)
        }, null, 2), {
          status: 500,
          headers: jsonHeaders({ 'Cache-Control': 'no-store' })
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },

  async scheduled(event, env, ctx) {
    if (!isKyivMidnight(event.scheduledTime)) {
      return;
    }

    const kyiv = getKyivTimeParts(event.scheduledTime);
    const chunkMinutes = getChunkScheduleMinutes(env);
    const chunkIndex = chunkMinutes.indexOf(kyiv.minute);
    const finalizeMinute = chunkMinutes.length * 2;

    if (chunkIndex !== -1) {
      ctx.waitUntil(processListingChunk(env, chunkIndex, kyiv.runId));
      return;
    }

    if (kyiv.minute === finalizeMinute) {
      ctx.waitUntil(finalizeChunkedRun(env, kyiv.runId, 'scheduled'));
    }
  }
};

function getKyivTimeParts(value) {
  const date = value ? new Date(value) : new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    runId: `${parts.year}-${parts.month}-${parts.day}`
  };
}

function getKyivRunId(value) {
  return getKyivTimeParts(value).runId;
}

function getChunkScheduleMinutes(env) {
  const chunkCount = Math.max(1, getEnvNumber(env, 'INVENTORY_SYNC_CHUNK_COUNT', 8));
  return Array.from({ length: chunkCount }, (_, index) => index * 2);
}

function isKyivMidnight(scheduledTime) {
  const kyiv = getKyivTimeParts(scheduledTime);
  return kyiv.hour === 0;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

function jsonHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Robots-Tag': 'noindex, nofollow',
    ...corsHeaders(),
    ...extra
  };
}

function xmlHeaders(extra = {}) {
  return {
    'Content-Type': 'application/xml; charset=utf-8',
    ...corsHeaders(),
    ...extra
  };
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildCanonicalDetailUrl(record) {
  if (record && record.slug) {
    return `https://cult-cars.com/car/${String(record.slug).replace(/^\/+|\/+$/g, '')}/`;
  }
  if (record && record.vin) {
    return `https://cult-cars.com/car/#vin=${encodeURIComponent(record.vin)}&ref=available`;
  }
  return '';
}

function toSitemapDate(value) {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

function isIndexableSitemapRecord(record) {
  const status = String(record && record.status || '').trim().toLowerCase();
  const availability = String(record && record.availability || '').trim().toLowerCase();
  const isActive = !(record && (record.is_active === false || record.isActive === false));

  if (!isActive || !record || !record.slug) return false;
  if (availability === 'unavailable') return false;
  return !['archived', 'removed', 'invalid', 'sold'].includes(status);
}

function buildInventorySitemapXml(records) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  (Array.isArray(records) ? records : []).filter(isIndexableSitemapRecord).forEach((record) => {
    const canonical = buildCanonicalDetailUrl(record);
    if (!canonical) return;
    const lastmod = toSitemapDate(record.last_seen_at || record.lastSeenAt || record.first_seen_at || record.firstSeenAt);
    const priority = String(record.status || '').toLowerCase() === 'reserved' ? '0.6' : (String(record.status || '').toLowerCase() === 'in_transit' ? '0.7' : '0.8');

    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(canonical)}</loc>`);
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push('    <changefreq>daily</changefreq>');
    lines.push(`    <priority>${priority}</priority>`);
    lines.push('  </url>');
  });

  lines.push('</urlset>');
  return lines.join('\n') + '\n';
}

function normalizeSlug(value) {
  return String(value || '').trim().toLowerCase().replace(/^\/+|\/+$/g, '');
}

function buildCarPageTitle(record) {
  const baseTitle = String(record && record.title || '').trim() || [record && record.year, record && record.make, record && record.model].filter(Boolean).join(' ');
  return `${baseTitle || 'Автомобіль'} — авто в дорозі | CULT CARS`;
}

function buildCarPageDescription(record) {
  const parts = [
    record && record.vin ? `VIN ${record.vin}` : '',
    record && record.location ? String(record.location) : '',
    record && record.origin ? String(record.origin) : '',
    Number(record && record.price || 0) > 0 ? `ціна від $${Number(record.price || 0).toLocaleString('en-US')}` : '',
    Number(record && (record.mileage_km || record.mileageKm) || 0) > 0 ? `пробіг ${Number(record.mileage_km || record.mileageKm || 0).toLocaleString('uk-UA')} км` : '',
    record && record.fuel ? String(record.fuel) : '',
    record && record.transmission ? String(record.transmission) : ''
  ].filter(Boolean);

  return `${String(record && record.title || 'Автомобіль')} — ${parts.join(' · ')}. Авто в дорозі від CULT CARS: доставка, розмитнення та супровід під ключ.`;
}

function jsonLdSafeString(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

class AttributeSetter {
  constructor(attribute, value) {
    this.attribute = attribute;
    this.value = value;
  }

  element(element) {
    element.setAttribute(this.attribute, this.value);
  }
}

class TextSetter {
  constructor(value) {
    this.value = value;
  }

  element(element) {
    element.setInnerContent(this.value);
  }
}

class HeadAppender {
  constructor(html) {
    this.html = html;
  }

  element(element) {
    element.append(this.html, { html: true });
  }
}

async function fetchCarTemplateResponse(request) {
  return fetch(DETAIL_TEMPLATE_URL, {
    method: request.method,
    headers: {
      'user-agent': request.headers.get('user-agent') || 'CULT-CARS-SEO-Worker/1.0'
    }
  });
}

async function renderCarDetailSeoResponse(request, env, slug) {
  const templateResponse = await fetchCarTemplateResponse(request);
  const payload = await env.CULT_CARS_INVENTORY.get(STORAGE_KEYS.cars);

  let records = [];
  try {
    records = payload ? JSON.parse(payload) : [];
  } catch (error) {
    records = [];
  }

  const record = (Array.isArray(records) ? records : []).find((item) => normalizeSlug(item && item.slug) === normalizeSlug(slug));
  if (!record) {
    return templateResponse;
  }

  const canonicalUrl = buildCanonicalDetailUrl(record) || `https://cult-cars.com/car/${normalizeSlug(slug)}/`;
  const title = buildCarPageTitle(record);
  const description = buildCarPageDescription(record);
  const image = Array.isArray(record.images) && record.images[0] ? record.images[0] : 'https://cult-cars.com/images/hero-bg.jpg';
  const schemaGraphHtml = [
    '<script type="application/ld+json" id="workerCarSchema">' + jsonLdSafeString({
      '@context': 'https://schema.org',
      '@type': 'Vehicle',
      name: String(record.title || ''),
      url: canonicalUrl,
      image: image,
      brand: record.make ? { '@type': 'Brand', name: String(record.make) } : undefined,
      model: record.model ? String(record.model) : undefined,
      modelDate: record.year || undefined,
      vehicleIdentificationNumber: record.vin || undefined,
      fuelType: record.fuel || undefined,
      vehicleTransmission: record.transmission || undefined,
      color: record.color || undefined,
      mileageFromOdometer: Number(record.mileage_km || record.mileageKm || 0) > 0 ? {
        '@type': 'QuantitativeValue',
        value: Number(record.mileage_km || record.mileageKm || 0),
        unitCode: 'KMT'
      } : undefined,
      offers: {
        '@type': 'Offer',
        price: Number(record.price || 0) || undefined,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: canonicalUrl
      }
    }) + '</script>',
    '<script type="application/ld+json" id="workerBreadcrumbSchema">' + jsonLdSafeString({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://cult-cars.com/' },
        { '@type': 'ListItem', position: 2, name: 'Авто в дорозі', item: 'https://cult-cars.com/cars-in-transit/' },
        { '@type': 'ListItem', position: 3, name: String(record.title || 'Автомобіль'), item: canonicalUrl }
      ]
    }) + '</script>'
  ].join('');

  const rewritten = new HTMLRewriter()
    .on('title', new TextSetter(title))
    .on('meta[name="description"]', new AttributeSetter('content', description))
    .on('meta[name="robots"]', new AttributeSetter('content', 'index, follow'))
    .on('link[rel="canonical"]', new AttributeSetter('href', canonicalUrl))
    .on('meta[property="og:url"]', new AttributeSetter('content', canonicalUrl))
    .on('meta[property="og:title"]', new AttributeSetter('content', title))
    .on('meta[property="og:description"]', new AttributeSetter('content', description))
    .on('meta[property="og:image"]', new AttributeSetter('content', image))
    .on('meta[property="og:image:alt"]', new AttributeSetter('content', `${String(record.title || 'Автомобіль')} — CULT CARS`))
    .on('meta[name="twitter:title"]', new AttributeSetter('content', title))
    .on('meta[name="twitter:description"]', new AttributeSetter('content', description))
    .on('meta[name="twitter:image"]', new AttributeSetter('content', image))
    .on('head', new HeadAppender(schemaGraphHtml))
    .transform(templateResponse);

  const headers = new Headers(rewritten.headers);
  headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400');
  return new Response(rewritten.body, {
    status: rewritten.status,
    statusText: rewritten.statusText,
    headers
  });
}

function isAuthorized(request, url, env) {
  const expected = String(env.INVENTORY_SYNC_TOKEN || '').trim();
  if (!expected) return false;
  const authHeader = String(request.headers.get('Authorization') || '');
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const queryToken = String(url.searchParams.get('token') || '').trim();
  return bearer === expected || queryToken === expected;
}

async function dispatchChunkedSync(env, triggerSource = 'manual', baseUrlOrRequestUrl = 'https://cult-cars.com/api/inventory/sync') {
  const startedAt = new Date().toISOString();
  const runId = getKyivRunId();
  const chunkCount = Math.max(1, getEnvNumber(env, 'INVENTORY_SYNC_CHUNK_COUNT', 8));
  const endpoint = new URL(baseUrlOrRequestUrl, 'https://cult-cars.com');
  if (!endpoint.pathname.endsWith('/sync')) {
    endpoint.pathname = `${API_PREFIX}/sync`;
  }
  endpoint.search = '';

  try {
    const dispatchResults = await Promise.all(Array.from({ length: chunkCount }, async (_, chunkIndex) => {
      const chunkUrl = new URL(endpoint.toString());
      chunkUrl.searchParams.set('mode', 'chunk');
      chunkUrl.searchParams.set('chunk', String(chunkIndex));
      chunkUrl.searchParams.set('runId', runId);

      const response = await fetch(chunkUrl.toString(), {
        headers: { Authorization: `Bearer ${String(env.INVENTORY_SYNC_TOKEN || '').trim()}` }
      });

      if (!response.ok) {
        throw new Error(`Chunk ${chunkIndex} failed with HTTP ${response.status}`);
      }

      const payload = await response.json();
      return payload.summary || payload;
    }));

    const summary = await finalizeChunkedRun(env, runId, triggerSource);
    return {
      ...summary,
      startedAt,
      chunkDispatch: dispatchResults.length
    };
  } catch (error) {
    const failure = {
      ok: false,
      triggerSource,
      startedAt,
      failedAt: new Date().toISOString(),
      error: error && error.message ? error.message : String(error)
    };
    await env.CULT_CARS_INVENTORY.put(STORAGE_KEYS.status, JSON.stringify(failure, null, 2));
    throw error;
  }
}

async function processListingChunk(env, chunkIndex, runId) {
  const chunkCount = Math.max(1, getEnvNumber(env, 'INVENTORY_SYNC_CHUNK_COUNT', 8));
  const maxPages = Math.max(1, getEnvNumber(env, 'INVENTORY_MAX_PAGES', 196));
  const pagesPerChunk = Math.max(1, Math.ceil(maxPages / chunkCount));
  const startPage = (chunkIndex * pagesPerChunk) + 1;
  const endPage = Math.min(maxPages, startPage + pagesPerChunk - 1);

  if (startPage > maxPages) {
    return {
      ok: true,
      runId,
      chunkIndex,
      skipped: true,
      reason: 'Chunk outside configured max pages'
    };
  }

  const listingResult = await fetchListingCardsRange(env, startPage, endPage);
  const storageKey = `${STORAGE_KEYS.chunkPrefix}/${runId}/chunk-${chunkIndex}.json`;
  await env.CULT_CARS_INVENTORY.put(storageKey, JSON.stringify({
    runId,
    chunkIndex,
    startPage,
    endPage,
    fetchedAt: new Date().toISOString(),
    pages: listingResult.pages,
    cards: listingResult.cards
  }));

  return {
    ok: true,
    runId,
    chunkIndex,
    startPage,
    endPage,
    listingPagesFetched: listingResult.pages.length,
    listingCardsFound: listingResult.cards.length
  };
}

async function finalizeChunkedRun(env, runId, triggerSource = 'manual') {
  const startedAt = new Date().toISOString();
  const chunkCount = Math.max(1, getEnvNumber(env, 'INVENTORY_SYNC_CHUNK_COUNT', 8));
  const chunkPayloads = await Promise.all(Array.from({ length: chunkCount }, (_, chunkIndex) => getStoredJson(env, `${STORAGE_KEYS.chunkPrefix}/${runId}/chunk-${chunkIndex}.json`, null)));
  const readyChunks = chunkPayloads.filter(Boolean);

  if (!readyChunks.length) {
    throw new Error(`No chunk data found for run ${runId}`);
  }

  const listingPages = readyChunks.flatMap((chunk) => Array.isArray(chunk.pages) ? chunk.pages : []);
  const combinedCards = Array.from(new Map(readyChunks
    .flatMap((chunk) => Array.isArray(chunk.cards) ? chunk.cards : [])
    .map((card) => [getRecordKey(card), card])
  ).values());

  const previousNormalized = await getStoredJson(env, STORAGE_KEYS.normalized, []);
  const previousMap = new Map((Array.isArray(previousNormalized) ? previousNormalized : []).map((item) => [getRecordKey(item), item]));
  const detailBudget = Math.max(0, getEnvNumber(env, 'INVENTORY_DETAIL_FETCH_BUDGET', 20));
  const detailCandidates = [];
  const normalizedRecords = [];

  for (const card of combinedCards) {
    const key = getRecordKey(card);
    const previous = previousMap.get(key);
    const listingSignature = computeListingSignature(card);
    const needsRefresh = !previous || previous.listingSignature !== listingSignature;

    if (needsRefresh && detailCandidates.length < detailBudget) {
      detailCandidates.push({ card, previous, listingSignature });
      continue;
    }

    normalizedRecords.push(normalizeRawRecord(buildRawRecordFromListingCard(card, previous, listingSignature)));
  }

  const detailedNormalized = await mapLimit(detailCandidates, getEnvNumber(env, 'INVENTORY_CONCURRENCY', 4), async ({ card, previous, listingSignature }) => {
    const detailRaw = await fetchCardDetails(card, env);
    return normalizeRawRecord({
      ...buildRawRecordFromListingCard(card, previous, listingSignature),
      ...detailRaw,
      listingSignature
    });
  });

  const syncResult = syncNormalizedItems([...normalizedRecords, ...detailedNormalized].filter(Boolean), previousNormalized, env);
  const activeRecords = syncResult.sourceRecords.filter((item) => item.isActive !== false);
  const frontendItems = sortFrontendItems(activeRecords.map(toFrontendItem));

  const summary = {
    ok: true,
    runId,
    triggerSource,
    startedAt,
    finishedAt: new Date().toISOString(),
    readyChunks: readyChunks.length,
    expectedChunks: chunkCount,
    listingPagesFetched: listingPages.length,
    listingCardsFound: combinedCards.length,
    normalizedRecords: normalizedRecords.length + detailedNormalized.length,
    detailCandidates: detailCandidates.length,
    detailBudget,
    activeRecords: activeRecords.length,
    suspiciousSync: syncResult.suspicious
  };

  await env.CULT_CARS_INVENTORY.put(STORAGE_KEYS.cars, JSON.stringify(frontendItems));
  await env.CULT_CARS_INVENTORY.put(STORAGE_KEYS.normalized, JSON.stringify(syncResult.sourceRecords));
  await env.CULT_CARS_INVENTORY.put(STORAGE_KEYS.status, JSON.stringify(summary, null, 2));

  return summary;
}

async function getStoredJson(env, key, fallback) {
  const raw = await env.CULT_CARS_INVENTORY.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function fetchListingCardsRange(env, startPage, endPage) {
  const listingBaseUrl = String(env.INVENTORY_LISTING_URL || 'https://lubeavto.com.ua/store/instoreusers');
  const siteBaseUrl = String(env.INVENTORY_SITE_URL || 'https://lubeavto.com.ua');
  const maxCards = Math.max(0, getEnvNumber(env, 'INVENTORY_MAX_CARDS', 0));
  const minDelayMs = Math.max(0, getEnvNumber(env, 'INVENTORY_DELAY_MS', 150));

  const allCards = [];
  const pages = [];

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
    const pageUrl = pageNumber <= 1 ? listingBaseUrl : `${listingBaseUrl}?pageNumber=${pageNumber}`;
    const html = await fetchHtml(pageUrl, env);
    const parsed = parseListingCards(html, siteBaseUrl);

    pages.push({ pageNumber, pageUrl, cardsFound: parsed.cards.length });
    allCards.push(...parsed.cards);

    if (maxCards > 0 && allCards.length >= maxCards) break;
    if (minDelayMs > 0 && pageNumber < endPage) await sleep(minDelayMs);
  }

  const deduped = Array.from(new Map(allCards.map((card) => [card.externalId || card.vin || card.sourceUrl, card])).values());
  return {
    pages,
    cards: maxCards > 0 ? deduped.slice(0, maxCards) : deduped
  };
}

function computeListingSignature(card) {
  return hashString(JSON.stringify({
    externalId: card && card.externalId ? card.externalId : '',
    vin: card && card.vin ? card.vin : '',
    titleRaw: card && card.titleRaw ? card.titleRaw : '',
    yearRaw: card && card.yearRaw ? card.yearRaw : '',
    priceRaw: card && card.priceRaw ? card.priceRaw : '',
    mileageRaw: card && card.mileageRaw ? card.mileageRaw : '',
    engineRaw: card && card.engineRaw ? card.engineRaw : '',
    fuelRaw: card && card.fuelRaw ? card.fuelRaw : '',
    transmissionRaw: card && card.transmissionRaw ? card.transmissionRaw : '',
    driveRaw: card && card.driveRaw ? card.driveRaw : '',
    thumbnailUrl: card && card.thumbnailUrl ? card.thumbnailUrl : ''
  }));
}

function buildRawRecordFromListingCard(card, previous, listingSignature) {
  return {
    externalId: card && card.externalId ? card.externalId : (previous && previous.externalId ? previous.externalId : ''),
    sourceUrl: card && card.sourceUrl ? card.sourceUrl : (previous && previous.sourceUrl ? previous.sourceUrl : ''),
    vin: card && card.vin ? card.vin : (previous && previous.vin ? previous.vin : ''),
    titleRaw: card && card.titleRaw ? card.titleRaw : (previous && previous.title ? previous.title : ''),
    yearRaw: card && card.yearRaw ? card.yearRaw : (previous && previous.year ? String(previous.year) : ''),
    priceRaw: card && card.priceRaw ? card.priceRaw : (previous && previous.price ? `${previous.price} $` : ''),
    price: card && card.price != null ? card.price : (previous && previous.price != null ? previous.price : null),
    mileageRaw: card && card.mileageRaw ? card.mileageRaw : (previous && previous.mileageRaw ? previous.mileageRaw : ''),
    mileageKm: card && card.mileageKm != null ? card.mileageKm : (previous && previous.mileageKm != null ? previous.mileageKm : null),
    engineRaw: card && card.engineRaw ? card.engineRaw : (previous && previous.engine ? previous.engine : ''),
    fuelRaw: card && card.fuelRaw ? card.fuelRaw : (previous && previous.fuel ? previous.fuel : ''),
    transmissionRaw: card && card.transmissionRaw ? card.transmissionRaw : (previous && previous.transmission ? previous.transmission : ''),
    driveRaw: card && card.driveRaw ? card.driveRaw : (previous && previous.drive ? previous.drive : ''),
    colorRaw: previous && previous.color ? previous.color : '',
    damageRaw: previous && previous.damage ? previous.damage : '',
    docsRaw: previous && previous.docs ? previous.docs : '',
    bodyTypeRaw: previous && previous.bodyStyle ? previous.bodyStyle : '',
    sellerPhone: previous && previous.sellerPhone ? previous.sellerPhone : '',
    sellerRaw: 'CULT CARS',
    locationRaw: previous && previous.location ? previous.location : '',
    originRaw: previous && previous.origin ? previous.origin : '',
    imagesRaw: previous && Array.isArray(previous.images) && previous.images.length ? previous.images : (card && card.thumbnailUrl ? [card.thumbnailUrl] : []),
    detailPageFetchedAt: new Date().toISOString(),
    listingSignature
  };
}

function parseListingCards(html, siteBaseUrl) {
  const seen = new Set();
  const anchors = [];
  const source = String(html || '');

  for (const match of source.matchAll(CARD_PATTERNS.detailHref)) {
    const relativeUrl = match[1];
    const cardId = match[2];
    const url = absoluteUrl(siteBaseUrl, relativeUrl);
    if (!cardId || seen.has(cardId)) continue;
    seen.add(cardId);
    anchors.push({ cardId, url, position: match.index || 0 });
  }

  const cards = anchors.map((item, index) => {
    const nextPosition = anchors[index + 1] ? anchors[index + 1].position : item.position + 3500;
    const chunk = source.slice(item.position, nextPosition);
    const priceMatch = chunk.match(CARD_PATTERNS.price);
    const mileageMatch = chunk.match(CARD_PATTERNS.mileage);
    const engineMatch = chunk.match(CARD_PATTERNS.engine);
    const yearMatch = chunk.match(CARD_PATTERNS.year);
    const fuelMatch = chunk.match(/\b(Бензин|Дизель|Електро|Гібрид)\b/i);
    const transmissionMatch = chunk.match(/\b(Автомат|Механіка|Робот|Варіатор|Auto(?:mat(?:ic)?)?)\b/i);
    const driveMatch = chunk.match(/\b(Передній|Задній|Повний|4x4|AWD|FWD|RWD)\b/i);
    const imageMatch = chunk.match(/https:\/\/storage-lavto\.lionwood\.software\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/i);
    const titleMatch = chunk.match(/>([A-Z0-9][A-Z0-9\s.'\/-]{4,}?\s(?:20\d{2}|19\d{2}))<\/a>/);
    const titleRaw = cleanText(titleMatch ? titleMatch[1] : '');

    return {
      cardId: item.cardId,
      externalId: item.cardId,
      sourceUrl: item.url,
      vin: extractVin(chunk),
      titleRaw,
      yearRaw: yearMatch ? yearMatch[1] : '',
      priceRaw: priceMatch ? priceMatch[0] : '',
      price: priceMatch ? parsePriceToNumber(priceMatch[0]) : null,
      mileageRaw: mileageMatch ? mileageMatch[0] : '',
      mileageKm: mileageMatch ? parseMileageToKm(mileageMatch[0]) : null,
      engineRaw: engineMatch ? engineMatch[0] : '',
      fuelRaw: fuelMatch ? fuelMatch[1] : '',
      transmissionRaw: transmissionMatch ? transmissionMatch[1] : '',
      driveRaw: driveMatch ? driveMatch[1] : '',
      thumbnailUrl: imageMatch ? imageMatch[0] : '',
      scrapedAt: new Date().toISOString()
    };
  }).filter((card) => card.titleRaw || card.vin || card.price);

  const totalPagesMatches = [...source.matchAll(/pageNumber=(\d+)/g)];
  const totalPages = totalPagesMatches.length
    ? Math.max(1, ...totalPagesMatches.map((match) => Number(match[1]) || 1))
    : 1;

  return { totalPages, cards };
}

async function fetchCardDetails(listingCard, env) {
  const html = await fetchHtml(listingCard.sourceUrl, env);
  const flatText = cleanText(html);
  const priceMatch = flatText.match(/\$\s*(\d[\d\s]+)/) || flatText.match(/(\d[\d\s]{1,12}\s*\$)/);
  const mileageMatch = flatText.match(/(\d+(?:[\s.,]\d+)?)\s*(тис\.)?\s*км/i);
  const engineMatch = flatText.match(/(\d(?:[.,]\d)?)\s*л/i);
  const yearMatch = flatText.match(/\b(20\d{2}|19\d{2})\b/);
  const phoneMatch = String(html || '').match(/tel:([^"']+)/i);
  const images = uniqueStrings(Array.from(String(html || '').matchAll(/https:\/\/storage-lavto\.lionwood\.software\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi)).map((match) => match[0]));

  return {
    ...listingCard,
    detailPageFetchedAt: new Date().toISOString(),
    titleRaw: extractTitleFromMeta(extractTagContent(html, 'title'), listingCard.titleRaw),
    vin: extractVin(flatText) || listingCard.vin,
    priceRaw: listingCard.priceRaw || (priceMatch ? priceMatch[0] : ''),
    price: listingCard.price || (priceMatch ? parsePriceToNumber(priceMatch[0]) : null),
    mileageRaw: listingCard.mileageRaw || (mileageMatch ? mileageMatch[0] : ''),
    mileageKm: listingCard.mileageKm || (mileageMatch ? parseMileageToKm(mileageMatch[0]) : null),
    yearRaw: listingCard.yearRaw || (yearMatch ? yearMatch[1] : ''),
    fuelRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.fuel) || listingCard.fuelRaw,
    engineRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.engine) || listingCard.engineRaw || (engineMatch ? engineMatch[0] : ''),
    driveRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.drive) || listingCard.driveRaw,
    colorRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.color),
    damageRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.damage),
    docsRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.docs),
    bodyTypeRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.bodyType),
    transmissionRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.transmission) || listingCard.transmissionRaw,
    sellerPhone: cleanText(phoneMatch ? phoneMatch[1] : ''),
    sellerRaw: 'CULT CARS',
    locationRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.location),
    originRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.origin),
    imagesRaw: images,
    sourceUrl: listingCard.sourceUrl
  };
}

function normalizeRawRecord(rawRecord) {
  const parsedAt = rawRecord.detailPageFetchedAt || rawRecord.scrapedAt || new Date().toISOString();
  const listingSignature = rawRecord.listingSignature || computeListingSignature(rawRecord);
  const titleParts = parseMakeModelYear(rawRecord.titleRaw, rawRecord.yearRaw);
  const identityKey = String(rawRecord.externalId || rawRecord.vin || hashString(rawRecord.sourceUrl || rawRecord.titleRaw));
  const images = uniqueStrings(rawRecord.imagesRaw || []).slice(0, 20);
  const mileageKm = rawRecord.mileageKm || parseMileageToKm(rawRecord.mileageRaw);
  const price = rawRecord.price || parsePriceToNumber(rawRecord.priceRaw);

  return {
    id: `cultcars-${identityKey}`,
    externalId: identityKey,
    sourceVendor: 'cult_cars',
    inventoryType: 'in_transit',
    status: 'in_transit',
    availability: 'available',
    isActive: true,
    firstSeenAt: parsedAt,
    lastSeenAt: parsedAt,
    missingSince: null,
    missingRunCount: 0,
    vin: rawRecord.vin || '',
    slug: slugify([titleParts.year, titleParts.make, titleParts.model, rawRecord.vin || rawRecord.externalId].filter(Boolean).join(' ')),
    title: titleParts.title,
    year: titleParts.year,
    make: titleParts.make,
    model: titleParts.model,
    price,
    mileageRaw: cleanText(rawRecord.mileageRaw),
    mileageKm,
    fuel: normalizeFuel(rawRecord.fuelRaw),
    transmission: normalizeTransmission(rawRecord.transmissionRaw),
    drive: normalizeDrive(rawRecord.driveRaw),
    engine: cleanText(rawRecord.engineRaw),
    color: titleCase(rawRecord.colorRaw),
    bodyStyle: normalizeBodyStyle(rawRecord.bodyTypeRaw),
    damage: yesNoDisplay(rawRecord.damageRaw),
    docs: yesNoDisplay(rawRecord.docsRaw),
    hasKey: '',
    origin: cleanText(rawRecord.originRaw),
    location: cleanText(rawRecord.locationRaw) || 'В дорозі',
    seller: 'CULT CARS',
    sellerPhone: cleanText(rawRecord.sellerPhone),
    saleStatus: 'В дорозі',
    images,
    imageCount: images.length,
    listingSignature
  };
}

function syncNormalizedItems(incomingRecords, previousRecords, env) {
  const now = new Date().toISOString();
  const minimumResultRatio = Number(env.INVENTORY_MIN_RESULT_RATIO || 0.6);
  const deactivateAfterMisses = Math.max(1, getEnvNumber(env, 'INVENTORY_DEACTIVATE_AFTER_MISSES', 3));
  const previousSourceRecords = (Array.isArray(previousRecords) ? previousRecords : []).filter((item) => String(item.sourceVendor || '').toLowerCase() === 'cult_cars');
  const previousMap = new Map(previousSourceRecords.map((item) => [getRecordKey(item), item]));
  const seenKeys = new Set();
  const mergedSourceRecords = [];

  for (const incoming of incomingRecords) {
    const key = getRecordKey(incoming);
    const previous = previousMap.get(key);
    seenKeys.add(key);
    mergedSourceRecords.push({
      ...previous,
      ...incoming,
      firstSeenAt: previous && previous.firstSeenAt ? previous.firstSeenAt : (incoming.firstSeenAt || now),
      lastSeenAt: incoming.lastSeenAt || now,
      missingSince: null,
      missingRunCount: 0,
      status: 'in_transit',
      availability: 'available',
      isActive: true
    });
  }

  const previousActiveCount = previousSourceRecords.filter((item) => item.isActive !== false).length;
  const suspicious = previousActiveCount > 0 && incomingRecords.length < Math.ceil(previousActiveCount * minimumResultRatio);

  for (const previous of previousSourceRecords) {
    const key = getRecordKey(previous);
    if (seenKeys.has(key)) continue;

    if (suspicious) {
      mergedSourceRecords.push(previous);
      continue;
    }

    const nextMissCount = Number(previous.missingRunCount || 0) + 1;
    const isActive = nextMissCount < deactivateAfterMisses;

    mergedSourceRecords.push({
      ...previous,
      missingSince: previous.missingSince || now,
      missingRunCount: nextMissCount,
      isActive,
      status: isActive ? (previous.status || 'in_transit') : 'archived',
      availability: isActive ? (previous.availability || 'available') : 'unavailable'
    });
  }

  return {
    suspicious,
    sourceRecords: mergedSourceRecords.sort((left, right) => {
      const leftScore = left.isActive === false ? 1 : 0;
      const rightScore = right.isActive === false ? 1 : 0;
      if (leftScore !== rightScore) return leftScore - rightScore;
      const priceDiff = Number(right.price || 0) - Number(left.price || 0);
      if (priceDiff !== 0) return priceDiff;
      return String(left.title || '').localeCompare(String(right.title || ''), 'uk');
    })
  };
}

function toFrontendItem(record) {
  const localDetailUrl = buildCanonicalDetailUrl(record) || 'https://cult-cars.com/cars-in-transit/';

  return {
    id: record.id,
    external_id: record.externalId,
    source_vendor: 'cult_cars',
    inventory_type: record.inventoryType,
    status: record.status,
    availability: record.availability,
    is_active: record.isActive !== false,
    first_seen_at: record.firstSeenAt || '',
    last_seen_at: record.lastSeenAt || '',
    missing_since: record.missingSince || '',
    vin: record.vin || '',
    slug: record.slug || '',
    title: record.title || '',
    year: record.year || '',
    make: record.make || '',
    model: record.model || '',
    price: record.price || 0,
    mileage: record.mileageRaw || '',
    mileage_km: record.mileageKm || null,
    fuel: record.fuel || '',
    transmission: record.transmission || '',
    drive: record.drive || '',
    engine: record.engine || '',
    color: record.color || '',
    body_style: record.bodyStyle || '',
    damage: record.damage || '',
    docs: record.docs || '',
    has_key: record.hasKey || '',
    origin: record.origin || '',
    location: record.location || 'В дорозі',
    seller: record.seller || 'CULT CARS',
    saleStatus: record.saleStatus || 'В дорозі',
    copart_url: localDetailUrl,
    images: Array.isArray(record.images) ? record.images : [],
    imageCount: Number(record.imageCount || 0)
  };
}

function sortFrontendItems(items) {
  return [...items].sort((left, right) => {
    const activeDiff = Number(Boolean(right.is_active)) - Number(Boolean(left.is_active));
    if (activeDiff !== 0) return activeDiff;
    const priceDiff = Number(right.price || 0) - Number(left.price || 0);
    if (priceDiff !== 0) return priceDiff;
    return String(left.title || '').localeCompare(String(right.title || ''), 'uk');
  });
}

async function fetchHtml(url, env) {
  const retries = Math.max(1, getEnvNumber(env, 'INVENTORY_RETRIES', 3));
  const delayMs = Math.max(0, getEnvNumber(env, 'INVENTORY_DELAY_MS', 150));
  const timeoutMs = Math.max(5000, getEnvNumber(env, 'INVENTORY_TIMEOUT_MS', 30000));
  const headers = { 'user-agent': String(env.INVENTORY_USER_AGENT || 'CULT-CARS-InventorySync/1.0 (+https://cult-cars.com)') };

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { headers, signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < retries && delayMs > 0) await sleep(delayMs);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error(`Failed to fetch ${url}`);
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (true) {
      const currentIndex = index;
      index += 1;
      if (currentIndex >= items.length) return;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.max(1, limit) }, () => worker());
  await Promise.all(workers);
  return results;
}

function getEnvNumber(env, name, fallback) {
  const value = Number(env[name]);
  return Number.isFinite(value) ? value : fallback;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(value) {
  return decodeEntities(String(value || '').replace(/<[^>]*>/g, ' '));
}

function cleanText(value) {
  return stripTags(value).replace(/\s+/g, ' ').trim();
}

function absoluteUrl(base, maybeRelative) {
  try {
    return new URL(maybeRelative, base).href;
  } catch {
    return String(maybeRelative || '');
  }
}

function parsePriceToNumber(value) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : null;
}

function parseMileageToKm(value) {
  const text = cleanText(value).toLowerCase();
  if (!text) return null;
  const match = text.match(/(\d+(?:[\s.,]\d+)?)/);
  if (!match) return null;
  const normalized = Number(match[1].replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(normalized)) return null;
  return text.includes('тис') ? Math.round(normalized * 1000) : Math.round(normalized);
}

function extractVin(value) {
  const match = String(value || '').match(/\b[A-HJ-NPR-Z0-9]{17}\b/);
  return match ? match[0] : '';
}

function uniqueStrings(list) {
  return Array.from(new Set((list || []).filter(Boolean)));
}

function hashString(value) {
  let hash = 0;
  const source = String(value || '');
  for (let i = 0; i < source.length; i += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

function titleCase(value) {
  return cleanText(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function normalizeFuel(value) {
  const text = cleanText(value).toLowerCase();
  if (!text) return '';
  if (text.includes('бенз')) return 'Бензин';
  if (text.includes('диз')) return 'Дизель';
  if (text.includes('гібр') || text.includes('hybrid')) return 'Гібрид';
  if (text.includes('елект')) return 'Електро';
  return titleCase(value);
}

function normalizeTransmission(value) {
  const text = cleanText(value).toLowerCase();
  if (!text) return '';
  if (text.includes('auto') || text.includes('авто')) return 'Автомат';
  if (text.includes('мех')) return 'Механіка';
  if (text.includes('варі')) return 'Варіатор';
  if (text.includes('робот')) return 'Робот';
  return titleCase(value);
}

function normalizeDrive(value) {
  const text = cleanText(value).toLowerCase();
  if (!text) return '';
  if (text.includes('перед')) return 'Передній';
  if (text.includes('зад')) return 'Задній';
  if (text.includes('повн') || text.includes('awd') || text.includes('4wd')) return 'Повний';
  return titleCase(value);
}

function normalizeBodyStyle(value) {
  const text = cleanText(value).toLowerCase();
  if (!text) return '';
  if (text.includes('suv') || text.includes('крос')) return 'suvCrossover';
  if (text.includes('sedan') || text.includes('седан')) return 'sedan';
  if (text.includes('hatch')) return 'hatchback';
  if (text.includes('pickup') || text.includes('пікап')) return 'pickup';
  return slugify(value);
}

function yesNoDisplay(value) {
  const text = cleanText(value).toLowerCase();
  if (!text) return '';
  if (['так', 'yes', 'true', 'є'].includes(text)) return 'Так';
  if (['ні', 'no', 'false', 'нема', 'немає'].includes(text)) return 'Ні';
  return titleCase(value);
}

function parseMakeModelYear(rawTitle, rawYear) {
  const title = cleanText(rawTitle);
  const yearMatch = title.match(/\b(19\d{2}|20\d{2})\b/);
  const year = Number(yearMatch ? yearMatch[1] : rawYear || 0) || '';
  const withoutYear = cleanText(title.replace(/\b(19\d{2}|20\d{2})\b/g, ''));
  const parts = withoutYear.split(/\s+/).filter(Boolean);
  const make = parts[0] ? titleCase(parts[0]) : '';
  const model = parts.slice(1).map(titleCase).join(' ');
  return { year, make, model, title: [make, model, year].filter(Boolean).join(' ').trim() || title };
}

function extractTagContent(html, tagName) {
  const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = String(html || '').match(pattern);
  return cleanText(match ? match[1] : '');
}

function extractTitleFromMeta(metaTitle, fallback) {
  const buyMatch = String(metaTitle || '').match(/Купити\s+(.+?)\s+по ціні/i);
  return cleanText(buyMatch ? buyMatch[1] : fallback);
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractNearbyLabelValue(flatText, labels) {
  const nextLabels = Object.values(DETAIL_LABELS).flat().filter(Boolean);
  for (const label of labels) {
    const index = flatText.indexOf(label);
    if (index === -1) continue;
    const snippet = flatText.slice(index + label.length, index + label.length + 80);
    const splitPattern = new RegExp(`\\b(?:${nextLabels.map(escapeRegExp).join('|')})\\b`);
    const value = cleanText((snippet.split(splitPattern)[0] || '')).replace(/^[:\s-]+/, '').trim();
    if (value) return value;
  }
  return '';
}

function extractLabeledHtmlValue(html, flatText, labels) {
  for (const label of labels) {
    const escaped = escapeRegExp(label);
    const patterns = [
      new RegExp(`${escaped}(?:<!-- -->)?\\s*:<\\/p>\\s*<div[^>]*>(?:<div[^>]*><\\/div>)?\\s*([^<]{1,80})<`, 'i'),
      new RegExp(`${escaped}<\\/span>[\\s\\S]{0,500}?ml-2[^>]*>([^<]{1,80})<\\/span>`, 'i'),
      new RegExp(`${escaped}(?:<!-- -->)?\\s*:[\\s\\S]{0,200}?font-bold[^>]*>([^<]{1,80})<`, 'i')
    ];

    for (const pattern of patterns) {
      const match = String(html || '').match(pattern);
      const value = cleanText(match ? match[1] : '');
      if (value) return value;
    }
  }
  return extractNearbyLabelValue(flatText, labels);
}

function getRecordKey(item) {
  return String(item.externalId || item.vin || item.sourceUrl || item.id || '');
}
