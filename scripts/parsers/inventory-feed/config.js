'use strict';

const path = require('node:path');

const rootDir = path.resolve(__dirname, '../../../');

function envNumber(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function envBoolean(name, fallback) {
  const raw = String(process.env[name] || '').trim().toLowerCase();
  if (!raw) return fallback;
  if (['1', 'true', 'yes', 'on'].includes(raw)) return true;
  if (['0', 'false', 'no', 'off'].includes(raw)) return false;
  return fallback;
}

const upstreamHost = ['lube', 'avto.com.ua'].join('');

const config = {
  rootDir,
  projectName: 'BIDDER',
  sourceVendor: 'car_auctions',
  sourceName: 'car_auctions_in_transit',
  listingBaseUrl: process.env.INVENTORY_LISTING_URL || `https://${upstreamHost}/store/instoreusers`,
  siteBaseUrl: process.env.INVENTORY_SITE_URL || `https://${upstreamHost}`,
  schedule: process.env.INVENTORY_SCHEDULE || '0 12 * * *',
  timezone: process.env.INVENTORY_TIMEZONE || 'Europe/Warsaw',
  runtime: {
    preferPlaywright: envBoolean('INVENTORY_USE_PLAYWRIGHT', true),
    userAgent: process.env.INVENTORY_USER_AGENT || 'Car-Auctions-InventorySync/1.0 (+https://leechan.xyz)',
    timeoutMs: envNumber('INVENTORY_TIMEOUT_MS', 30000),
    retries: envNumber('INVENTORY_RETRIES', 3),
    minDelayMs: envNumber('INVENTORY_DELAY_MS', 350),
    concurrency: Math.max(1, envNumber('INVENTORY_CONCURRENCY', 2))
  },
  crawl: {
    startPage: 1,
    maxPages: Math.max(1, envNumber('INVENTORY_MAX_PAGES', 196)),
    maxCards: Math.max(0, envNumber('INVENTORY_MAX_CARDS', 0))
  },
  image: {
    mode: process.env.INVENTORY_IMAGE_MODE || 'remote',
    cacheDir: path.join(rootDir, 'images', 'parser', 'cars')
  },
  sync: {
    minimumResultRatio: Number(process.env.INVENTORY_MIN_RESULT_RATIO || 0.6),
    deactivateAfterMisses: Math.max(1, envNumber('INVENTORY_DEACTIVATE_AFTER_MISSES', 3))
  },
  output: {
    rawFile: path.join(rootDir, 'data', 'raw', 'in-transit-raw.json'),
    normalizedFile: path.join(rootDir, 'data', 'staging', 'in-transit-normalized.json'),
    frontendPreviewFile: path.join(rootDir, 'data', 'staging', 'cars_parser.car_auctions.preview.json'),
    seoManifestFile: path.join(rootDir, 'data', 'staging', 'cars_parser.car_auctions.seo.json'),
    seoSitemapFragmentFile: path.join(rootDir, 'data', 'staging', 'car-auctions-sitemap-fragment.xml'),
    frontendFile: path.join(rootDir, 'data', 'parser', 'cars_transit.json'),
    logFile: path.join(rootDir, 'logs', 'inventory-sync.log'),
    writeToFrontendFile: envBoolean('INVENTORY_WRITE_FRONTEND', true),
    replaceFrontendFile: envBoolean('INVENTORY_REPLACE_FRONTEND', true)
  }
};

module.exports = config;
