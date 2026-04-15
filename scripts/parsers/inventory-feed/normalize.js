'use strict';

const path = require('node:path');
const { AVAILABILITY, INTERNAL_STATUS } = require('./types');
const {
  cleanText,
  downloadFile,
  hashString,
  normalizeBodyStyle,
  normalizeDrive,
  normalizeFuel,
  normalizeTransmission,
  parseMileageToKm,
  parsePriceToNumber,
  slugify,
  titleCase,
  uniqueStrings,
  yesNoDisplay
} = require('./utils');

function extractEngineVolume(value) {
  const match = String(value || '').match(/(\d(?:[.,]\d)?)/);
  return match ? Number(match[1].replace(',', '.')) : null;
}

function buildListingSignature(rawRecord) {
  return hashString(JSON.stringify({
    externalId: rawRecord.externalId || rawRecord.cardId || '',
    vin: rawRecord.vin || '',
    titleRaw: rawRecord.titleRaw || '',
    yearRaw: rawRecord.yearRaw || '',
    priceRaw: rawRecord.priceRaw || '',
    mileageRaw: rawRecord.mileageRaw || '',
    engineRaw: rawRecord.engineRaw || '',
    fuelRaw: rawRecord.fuelRaw || '',
    transmissionRaw: rawRecord.transmissionRaw || '',
    driveRaw: rawRecord.driveRaw || '',
    thumbnailUrl: rawRecord.thumbnailUrl || ''
  }));
}

function parseMakeModelYear(rawTitle, rawYear) {
  const title = cleanText(rawTitle);
  const yearMatch = title.match(/\b(19\d{2}|20\d{2})\b/);
  const year = Number(yearMatch ? yearMatch[1] : rawYear || 0) || '';
  const withoutYear = cleanText(title.replace(/\b(19\d{2}|20\d{2})\b/g, ''));
  const parts = withoutYear.split(/\s+/).filter(Boolean);
  const make = parts[0] ? titleCase(parts[0]) : '';
  const model = parts.slice(1).map(titleCase).join(' ');
  const fullTitle = [make, model, year].filter(Boolean).join(' ').trim();

  return {
    year,
    make,
    model,
    title: fullTitle || title
  };
}

async function resolveImages(rawRecord, config, itemKey) {
  const remoteImages = uniqueStrings(rawRecord.imagesRaw || []).slice(0, 20);
  if (config.image.mode !== 'cache_local' || !remoteImages.length) {
    return remoteImages;
  }

  const targetDir = path.join(config.image.cacheDir, itemKey);
  const localImages = [];

  for (let index = 0; index < remoteImages.length; index += 1) {
    const remoteUrl = remoteImages[index];
    const extensionMatch = remoteUrl.match(/\.(jpg|jpeg|png|webp)(?:\?.*)?$/i);
    const extension = extensionMatch ? extensionMatch[1].toLowerCase() : 'jpg';
    const localFile = path.join(targetDir, `image-${String(index + 1).padStart(2, '0')}.${extension}`);
    await downloadFile(remoteUrl, localFile, {
      timeoutMs: config.runtime.timeoutMs,
      headers: { 'user-agent': config.runtime.userAgent }
    });
    localImages.push('/' + path.relative(config.rootDir, localFile).replace(/\\/g, '/'));
  }

  return localImages;
}

async function normalizeRawRecord(rawRecord, config) {
  const parsedAt = rawRecord.detailPageFetchedAt || rawRecord.scrapedAt || new Date().toISOString();
  const titleParts = parseMakeModelYear(rawRecord.titleRaw, rawRecord.yearRaw);
  const identityKey = rawRecord.externalId || rawRecord.vin || hashString(rawRecord.sourceUrl || rawRecord.titleRaw);
  const images = await resolveImages(rawRecord, config, rawRecord.vin || String(identityKey));
  const mileageKm = rawRecord.mileageKm || parseMileageToKm(rawRecord.mileageRaw);
  const price = rawRecord.price || parsePriceToNumber(rawRecord.priceRaw);
  const damage = yesNoDisplay(rawRecord.damageRaw);
  const docs = yesNoDisplay(rawRecord.docsRaw);
  const seoTitle = titleParts.title ? `${titleParts.title} — купити авто в дорозі | BIDDER` : 'Авто в дорозі | BIDDER';
  const seoDescription = `${titleParts.title || 'Автомобіль'}: VIN ${rawRecord.vin || '—'}, пробіг ${cleanText(rawRecord.mileageRaw) || '—'}, ціна ${price ? `${price} $` : 'уточнюється'}. Доставка, розмитнення та супровід від BIDDER.`;
  const listingSignature = buildListingSignature(rawRecord);

  return {
    id: `cultcars-${identityKey}`,
    externalId: String(identityKey),
    source: 'manual',
    sourceVendor: config.sourceVendor,
    sourceName: config.sourceName,
    inventoryType: 'in_transit',
    status: INTERNAL_STATUS.IN_TRANSIT,
    availability: AVAILABILITY.AVAILABLE,
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
    engineVolumeL: extractEngineVolume(rawRecord.engineRaw),
    color: titleCase(rawRecord.colorRaw),
    bodyStyle: normalizeBodyStyle(rawRecord.bodyTypeRaw),
    damage,
    docs,
    hasKey: '',
    origin: cleanText(rawRecord.originRaw),
    location: cleanText(rawRecord.locationRaw) || 'В дорозі',
    seller: 'BIDDER',
    sellerPhone: cleanText(rawRecord.sellerPhone),
    saleStatus: 'В дорозі',
    sourceUrl: rawRecord.vin
      ? `https://leechan.xyz/car.html#vin=${encodeURIComponent(rawRecord.vin)}`
      : 'https://leechan.xyz/catalog-available.html',
    images,
    imageCount: images.length,
    listingSignature,
    scrapedAt: parsedAt,
    metaTitle: seoTitle,
    metaDescription: seoDescription,
    rawHash: hashString(JSON.stringify({
      title: rawRecord.titleRaw,
      price: rawRecord.priceRaw,
      mileage: rawRecord.mileageRaw,
      fuel: rawRecord.fuelRaw,
      engine: rawRecord.engineRaw,
      drive: rawRecord.driveRaw,
      images: rawRecord.imagesRaw
    }))
  };
}

async function normalizeRawRecords(rawRecords, config) {
  const normalized = [];
  for (const record of rawRecords) {
    normalized.push(await normalizeRawRecord(record, config));
  }
  return normalized;
}

module.exports = {
  normalizeRawRecord,
  normalizeRawRecords
};
