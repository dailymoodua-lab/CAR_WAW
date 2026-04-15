'use strict';

const { DETAIL_LABELS } = require('./selectors');
const {
  absoluteUrl,
  cleanText,
  extractVin,
  parseMileageToKm,
  parsePriceToNumber,
  uniqueStrings
} = require('./utils');

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractMetaContent(html, name) {
  const pattern = new RegExp(`<meta[^>]+(?:name|property)=["']${escapeRegExp(name)}["'][^>]+content=["']([^"']+)["']`, 'i');
  const match = String(html || '').match(pattern);
  return cleanText(match ? match[1] : '');
}

function extractTagContent(html, tagName) {
  const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = String(html || '').match(pattern);
  return cleanText(match ? match[1] : '');
}

function extractNearbyLabelValue(flatText, labels) {
  const nextLabels = Object.values(DETAIL_LABELS).flat().filter(Boolean);

  for (const label of labels) {
    const index = flatText.indexOf(label);
    if (index === -1) continue;
    const snippet = flatText.slice(index + label.length, index + label.length + 80);
    const splitPattern = new RegExp(`\\b(?:${nextLabels.map(escapeRegExp).join('|')})\\b`);
    const value = cleanText(snippet.split(splitPattern)[0] || '');
    if (value) {
      return value.replace(/^[:\s-]+/, '').trim();
    }
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
      if (value) {
        return value;
      }
    }
  }

  return extractNearbyLabelValue(flatText, labels);
}

function extractTitleFromMeta(metaTitle, fallback) {
  const buyMatch = metaTitle.match(/Купити\s+(.+?)\s+по ціні/i);
  if (buyMatch) return cleanText(buyMatch[1]);
  return cleanText(fallback);
}

async function fetchCardDetails(listingCard, config, client) {
  const html = await client.fetchHtml(listingCard.sourceUrl);
  const flatText = cleanText(html);
  const metaTitle = extractTagContent(html, 'title');
  const metaDescription = extractMetaContent(html, 'description');
  const canonicalUrl = extractMetaContent(html, 'og:url') || listingCard.sourceUrl;
  const titleRaw = extractTitleFromMeta(metaTitle, listingCard.titleRaw);
  const vin = extractVin(flatText) || listingCard.vin;

  const priceMatch = flatText.match(/\$\s*(\d[\d\s]+)/) || flatText.match(/(\d[\d\s]{1,12}\s*\$)/);
  const mileageMatch = flatText.match(/(\d+(?:[\s.,]\d+)?)\s*(тис\.)?\s*км/i);
  const engineMatch = flatText.match(/(\d(?:[.,]\d)?)\s*л/i);
  const yearMatch = flatText.match(/\b(20\d{2}|19\d{2})\b/);
  const phoneMatch = String(html || '').match(/tel:([^"']+)/i);
  const images = uniqueStrings(Array.from(String(html || '').matchAll(/https:\/\/storage-lavto\.lionwood\.software\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi)).map(match => absoluteUrl(config.siteBaseUrl, match[0])));

  return {
    ...listingCard,
    sourceUrl: canonicalUrl,
    detailPageFetchedAt: new Date().toISOString(),
    metaTitle,
    metaDescription,
    titleRaw: titleRaw || listingCard.titleRaw,
    vin,
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
    sellerRaw: 'BIDDER',
    locationRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.location),
    originRaw: extractLabeledHtmlValue(html, flatText, DETAIL_LABELS.origin),
    imagesRaw: images,
    rawTextPreview: flatText.slice(0, 1200)
  };
}

module.exports = {
  fetchCardDetails
};
