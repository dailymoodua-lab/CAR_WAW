'use strict';

const { CARD_PATTERNS } = require('./selectors');
const {
  absoluteUrl,
  cleanText,
  extractVin,
  parseMileageToKm,
  parsePriceToNumber,
  sleep
} = require('./utils');

function extractResultCount(html) {
  const match = cleanText(html).match(/Знайдено\s*(\d[\d\s]*)\s*результат/i);
  return match ? Number(match[1].replace(/\s/g, '')) : null;
}

function extractTotalPages(html) {
  const matches = [...String(html || '').matchAll(/pageNumber=(\d+)/g)];
  if (!matches.length) return 1;
  return Math.max(1, ...matches.map(match => Number(match[1]) || 1));
}

function extractTitle(chunk) {
  const match = chunk.match(/>([A-Z0-9][A-Z0-9\s.'\/-]{4,}?\s(?:20\d{2}|19\d{2}))<\/a>/);
  return cleanText(match ? match[1] : '');
}

function buildListingCard(item, chunk) {
  const priceMatch = chunk.match(CARD_PATTERNS.price);
  const mileageMatch = chunk.match(CARD_PATTERNS.mileage);
  const engineMatch = chunk.match(CARD_PATTERNS.engine);
  const yearMatch = chunk.match(CARD_PATTERNS.year);
  const fuelMatch = chunk.match(/\b(Бензин|Дизель|Електро|Гібрид)\b/i);
  const transmissionMatch = chunk.match(/\b(Автомат|Механіка|Робот|Варіатор|Auto(?:mat(?:ic)?)?)\b/i);
  const driveMatch = chunk.match(/\b(Передній|Задній|Повний|4x4|AWD|FWD|RWD)\b/i);
  const imageMatch = chunk.match(/https:\/\/storage-lavto\.lionwood\.software\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/i);
  const titleRaw = extractTitle(chunk);
  const vin = extractVin(chunk);

  return {
    cardId: item.cardId,
    externalId: item.cardId,
    sourceUrl: item.url,
    vin,
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
    parsedFrom: 'listing',
    scrapedAt: new Date().toISOString()
  };
}

function parseListingCards(html, siteBaseUrl) {
  const seen = new Set();
  const anchors = [];

  for (const match of String(html || '').matchAll(CARD_PATTERNS.detailHref)) {
    const relativeUrl = match[1];
    const cardId = match[2];
    const url = absoluteUrl(siteBaseUrl, relativeUrl);
    if (!cardId || seen.has(cardId)) continue;
    seen.add(cardId);
    anchors.push({ cardId, url, position: match.index || 0 });
  }

  const cards = anchors.map((item, index) => {
    const nextPosition = anchors[index + 1] ? anchors[index + 1].position : item.position + 3500;
    const chunk = String(html || '').slice(item.position, nextPosition);
    return buildListingCard(item, chunk);
  }).filter(card => card.titleRaw || card.vin || card.price);

  return {
    totalResults: extractResultCount(html),
    totalPages: extractTotalPages(html),
    cards
  };
}

async function fetchListingPage(pageNumber, config, client) {
  const pageUrl = pageNumber <= 1
    ? config.listingBaseUrl
    : `${config.listingBaseUrl}?pageNumber=${pageNumber}`;
  const html = await client.fetchHtml(pageUrl);
  const parsed = parseListingCards(html, config.siteBaseUrl);

  return {
    pageNumber,
    pageUrl,
    html,
    ...parsed
  };
}

async function fetchAllListingCards(config, client) {
  const allCards = [];
  const pages = [];
  let detectedTotalPages = 1;
  let detectedTotalResults = null;

  for (let pageNumber = config.crawl.startPage; pageNumber <= config.crawl.maxPages; pageNumber += 1) {
    const pageData = await fetchListingPage(pageNumber, config, client);
    pages.push({
      pageNumber,
      pageUrl: pageData.pageUrl,
      cardsFound: pageData.cards.length
    });

    if (pageData.totalPages) {
      detectedTotalPages = Math.max(detectedTotalPages, pageData.totalPages);
    }
    if (pageData.totalResults) {
      detectedTotalResults = pageData.totalResults;
    }

    allCards.push(...pageData.cards);

    if (config.crawl.maxCards > 0 && allCards.length >= config.crawl.maxCards) {
      break;
    }

    if (pageNumber >= detectedTotalPages) {
      break;
    }

    await sleep(config.runtime.minDelayMs);
  }

  const deduped = Array.from(new Map(allCards.map(card => [card.externalId || card.vin || card.sourceUrl, card])).values());
  const cards = config.crawl.maxCards > 0 ? deduped.slice(0, config.crawl.maxCards) : deduped;

  return {
    pages,
    totalPagesDetected: detectedTotalPages,
    totalResultsDetected: detectedTotalResults,
    cards
  };
}

module.exports = {
  fetchListingPage,
  fetchAllListingCards,
  parseListingCards
};
