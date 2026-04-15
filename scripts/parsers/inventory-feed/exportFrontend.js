'use strict';

const { readJson, writeJson, writeText } = require('./utils');

function xmlEscape(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatMileage(km, rawValue) {
  if (rawValue) return rawValue;
  if (!Number.isFinite(km) || km <= 0) return '';
  return `${km.toLocaleString('uk-UA')} км`;
}

function buildCanonicalDetailUrl(record) {
  if (record && record.slug) {
    return `https://leechan.xyz/car.html#vin=${encodeURIComponent(record.vin || '')}`;
  }
  if (record && record.vin) {
    return `https://leechan.xyz/car.html#vin=${encodeURIComponent(record.vin)}`;
  }
  return 'https://leechan.xyz/catalog-available.html';
}

function toFrontendItem(record) {
  const localDetailUrl = buildCanonicalDetailUrl(record);

  return {
    id: record.id,
    external_id: record.externalId,
    source_vendor: 'car_auctions',
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
    mileage: formatMileage(record.mileageKm, record.mileageRaw),
    mileage_km: record.mileageKm || null,
    fuel: record.fuel || '',
    transmission: record.transmission || '',
    drive: record.drive || '',
    engine: record.engine || '',
    engine_volume_l: record.engineVolumeL || null,
    color: record.color || '',
    body_style: record.bodyStyle || '',
    damage: record.damage || '',
    docs: record.docs || '',
    has_key: record.hasKey || '',
    origin: record.origin || '',
    location: record.location || 'В дорозі',
    seller: 'BIDDER',
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

function toRawArtifactItem(rawRecord) {
  return {
    externalId: rawRecord.externalId || rawRecord.cardId || '',
    vin: rawRecord.vin || '',
    titleRaw: rawRecord.titleRaw || '',
    yearRaw: rawRecord.yearRaw || '',
    priceRaw: rawRecord.priceRaw || '',
    mileageRaw: rawRecord.mileageRaw || '',
    fuelRaw: rawRecord.fuelRaw || '',
    engineRaw: rawRecord.engineRaw || '',
    driveRaw: rawRecord.driveRaw || '',
    colorRaw: rawRecord.colorRaw || '',
    damageRaw: rawRecord.damageRaw || '',
    docsRaw: rawRecord.docsRaw || '',
    bodyTypeRaw: rawRecord.bodyTypeRaw || '',
    transmissionRaw: rawRecord.transmissionRaw || '',
    sellerRaw: 'BIDDER',
    locationRaw: rawRecord.locationRaw || '',
    originRaw: rawRecord.originRaw || '',
    detailPageFetchedAt: rawRecord.detailPageFetchedAt || rawRecord.scrapedAt || '',
    imagesRaw: Array.isArray(rawRecord.imagesRaw) ? rawRecord.imagesRaw : []
  };
}

function toSeoKeywords(record) {
  const tokens = [
    record.make,
    record.model,
    record.year,
    'авто з США',
    'авто в дорозі',
    'пригон авто',
    record.fuel,
    record.transmission,
    record.drive,
    record.location
  ]
    .map(value => String(value || '').trim())
    .filter(Boolean);

  return Array.from(new Set(tokens));
}

function toSeoManifestItem(record) {
  const vin = String(record.vin || '').trim();
  const title = String(record.title || '').trim();
  const canonicalPath = record.slug ? `/car/${record.slug}/` : '';
  const currentTransitionalPath = vin ? `/car/#vin=${vin}` : '/car/';
  const keywords = toSeoKeywords(record);
  const priceText = Number(record.price || 0) > 0 ? `${record.price} $` : 'ціна уточнюється';
  const descBase = title
    ? `${title}: VIN ${vin || '—'}, пробіг ${record.mileageRaw || '—'}, ціна ${priceText}.`
    : `Автомобіль VIN ${vin || '—'}, пробіг ${record.mileageRaw || '—'}, ціна ${priceText}.`;

  return {
    id: record.id,
    source_vendor: 'cult_cars',
    vin,
    slug: record.slug || '',
    canonical_path: canonicalPath,
    current_path: currentTransitionalPath,
    indexable_now: Boolean(canonicalPath),
    indexable_when_slug_route_enabled: Boolean(canonicalPath),
    seo_title: title ? `${title} — купити авто в дорозі | BIDDER` : 'Авто в дорозі | BIDDER',
    seo_description: `${descBase} Доставка, розмитнення та супровід від BIDDER.`,
    seo_keywords: keywords,
    og_title: title ? `${title} | BIDDER` : 'Авто | BIDDER',
    og_description: `${descBase} Перевірка історії, доставка, розрахунок під ключ.`,
    primary_image: Array.isArray(record.images) && record.images[0] ? record.images[0] : '',
    json_ld_vehicle: {
      '@context': 'https://schema.org',
      '@type': 'Vehicle',
      name: title || undefined,
      vehicleIdentificationNumber: vin || undefined,
      brand: record.make || undefined,
      model: record.model || undefined,
      modelDate: record.year || undefined,
      mileageFromOdometer: Number.isFinite(record.mileageKm) ? {
        '@type': 'QuantitativeValue',
        value: record.mileageKm,
        unitCode: 'KMT'
      } : undefined,
      fuelType: record.fuel || undefined,
      color: record.color || undefined,
      vehicleTransmission: record.transmission || undefined,
      offers: {
        '@type': 'Offer',
        price: Number(record.price || 0) || undefined,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: canonicalPath || currentTransitionalPath
      }
    }
  };
}

function buildSeoSitemapFragment(seoManifestItems) {
  const activeItems = seoManifestItems.filter(item => item.indexable_when_slug_route_enabled && item.canonical_path);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const item of activeItems) {
    lines.push('  <url>');
    lines.push(`    <loc>${xmlEscape(`https://cult-cars.com${item.canonical_path}`)}</loc>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n') + '\n';
}

async function exportFrontendArtifacts(rawRecords, syncResult, config) {
  await writeJson(config.output.rawFile, rawRecords.map(toRawArtifactItem));
  await writeJson(config.output.normalizedFile, syncResult.sourceRecords);

  const activeSourceRecords = syncResult.sourceRecords.filter(item => item.isActive !== false);
  const frontendSourceItems = sortFrontendItems(activeSourceRecords.map(toFrontendItem));
  const seoManifestItems = activeSourceRecords.map(toSeoManifestItem);
  await writeJson(config.output.frontendPreviewFile, frontendSourceItems);
  await writeJson(config.output.seoManifestFile, seoManifestItems);
  await writeText(config.output.seoSitemapFragmentFile, buildSeoSitemapFragment(seoManifestItems));

  let mergedCount = null;
  if (config.output.writeToFrontendFile) {
    const currentFrontend = await readJson(config.output.frontendFile, []);
    const preservedItems = config.output.replaceFrontendFile
      ? []
      : currentFrontend.filter(item => {
          const sourceVendor = String(item.source_vendor || '').toLowerCase();
          return sourceVendor && sourceVendor !== config.sourceVendor.toLowerCase();
        });
    const mergedItems = sortFrontendItems([...preservedItems, ...frontendSourceItems]);
    await writeJson(config.output.frontendFile, mergedItems);
    mergedCount = mergedItems.length;
  }

  return {
    frontendSourceCount: frontendSourceItems.length,
    seoManifestCount: seoManifestItems.length,
    mergedCount,
    wroteFrontendFile: Boolean(config.output.writeToFrontendFile),
    replacedFrontendFile: Boolean(config.output.replaceFrontendFile)
  };
}

module.exports = {
  exportFrontendArtifacts,
  toFrontendItem
};
