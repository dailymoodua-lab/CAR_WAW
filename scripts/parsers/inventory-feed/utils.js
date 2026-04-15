'use strict';

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const http = require('node:http');
const https = require('node:https');

function ensureDir(dirPath) {
  return fsp.mkdir(dirPath, { recursive: true });
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fsp.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function writeText(filePath, text) {
  await ensureDir(path.dirname(filePath));
  await fsp.writeFile(filePath, String(text || ''), 'utf8');
}

async function appendLog(filePath, line) {
  await ensureDir(path.dirname(filePath));
  await fsp.appendFile(filePath, line + '\n', 'utf8');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

function titleCase(value) {
  return cleanText(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if ((/^[A-Z0-9-]+$/).test(word) && /[A-Z]/.test(word) && word.length <= 6) {
        return word;
      }
      if ((/^[А-ЯІЇЄҐ0-9-]+$/u).test(word) && /[А-ЯІЇЄҐ]/u.test(word) && word.length <= 6) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
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

function absoluteUrl(base, maybeRelative) {
  if (!maybeRelative) return '';
  try {
    return new URL(maybeRelative, base).href;
  } catch (error) {
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
  return crypto.createHash('sha1').update(String(value || '')).digest('hex').slice(0, 12);
}

function normalizeFuel(value) {
  const text = cleanText(value);
  if (!text) return '';
  const lower = text.toLowerCase();
  if (lower.includes('бенз')) return 'Бензин';
  if (lower.includes('диз')) return 'Дизель';
  if (lower.includes('гібр') || lower.includes('hybrid')) return 'Гібрид';
  if (lower.includes('елект')) return 'Електро';
  return titleCase(text);
}

function normalizeTransmission(value) {
  const text = cleanText(value);
  if (!text) return '';
  const lower = text.toLowerCase();
  if (lower.includes('auto') || lower.includes('авто')) return 'Автомат';
  if (lower.includes('мех')) return 'Механіка';
  if (lower.includes('варі')) return 'Варіатор';
  if (lower.includes('робот')) return 'Робот';
  return titleCase(text);
}

function normalizeDrive(value) {
  const text = cleanText(value);
  if (!text) return '';
  const lower = text.toLowerCase();
  if (lower.includes('перед')) return 'Передній';
  if (lower.includes('зад')) return 'Задній';
  if (lower.includes('повн') || lower.includes('awd') || lower.includes('4wd')) return 'Повний';
  return titleCase(text);
}

function normalizeBodyStyle(value) {
  const text = cleanText(value);
  if (!text) return '';
  const lower = text.toLowerCase();
  if (lower.includes('suv') || lower.includes('крос')) return 'suvCrossover';
  if (lower.includes('sedan') || lower.includes('седан')) return 'sedan';
  if (lower.includes('hatch')) return 'hatchback';
  if (lower.includes('pickup') || lower.includes('пікап')) return 'pickup';
  return slugify(text);
}

function yesNoDisplay(value) {
  if (typeof value === 'boolean') return value ? 'Так' : 'Ні';
  const text = cleanText(value).toLowerCase();
  if (!text) return '';
  if (['так', 'yes', 'true', 'є'].includes(text)) return 'Так';
  if (['ні', 'no', 'false', 'нема', 'немає'].includes(text)) return 'Ні';
  return titleCase(text);
}

function httpRequest(url, options) {
  const lib = String(url).startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const request = lib.request(url, {
      method: 'GET',
      headers: options && options.headers ? options.headers : {}
    }, (response) => {
      if (response.statusCode >= 400) {
        reject(new Error('HTTP ' + response.statusCode + ' for ' + url));
        response.resume();
        return;
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    });
    request.on('error', reject);
    request.setTimeout((options && options.timeoutMs) || 30000, () => {
      request.destroy(new Error('Timeout for ' + url));
    });
    request.end();
  });
}

async function requestBuffer(url, options) {
  if (typeof fetch === 'function') {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), (options && options.timeoutMs) || 30000);
    try {
      const response = await fetch(url, {
        headers: options && options.headers ? options.headers : {},
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ' for ' + url);
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } finally {
      clearTimeout(timeout);
    }
  }
  return httpRequest(url, options);
}

async function fetchText(url, options) {
  const buffer = await requestBuffer(url, options);
  return buffer.toString('utf8');
}

async function fetchWithRetry(url, options) {
  const retries = options && Number.isFinite(options.retries) ? options.retries : 3;
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fetchText(url, options);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep((options && options.delayMs) || 300);
      }
    }
  }
  throw lastError;
}

async function createHtmlClient(config) {
  if (config.runtime.preferPlaywright) {
    try {
      const playwright = await import('playwright');
      const browser = await playwright.chromium.launch({ headless: true });
      const page = await browser.newPage({ userAgent: config.runtime.userAgent });
      return {
        mode: 'playwright',
        async fetchHtml(url) {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.runtime.timeoutMs });
          return page.content();
        },
        async close() {
          await browser.close();
        }
      };
    } catch (error) {
      // fall back to fetch-based client if Playwright is unavailable
    }
  }

  return {
    mode: 'fetch',
    async fetchHtml(url) {
      return fetchWithRetry(url, {
        retries: config.runtime.retries,
        delayMs: config.runtime.minDelayMs,
        timeoutMs: config.runtime.timeoutMs,
        headers: { 'user-agent': config.runtime.userAgent }
      });
    },
    async close() {}
  };
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

  const workers = Array.from({ length: Math.max(1, limit) }, worker);
  await Promise.all(workers);
  return results;
}

async function downloadFile(url, targetPath, options) {
  const buffer = await requestBuffer(url, options);
  await ensureDir(path.dirname(targetPath));
  await fsp.writeFile(targetPath, buffer);
  return targetPath;
}

module.exports = {
  ensureDir,
  readJson,
  writeJson,
  writeText,
  appendLog,
  sleep,
  cleanText,
  decodeEntities,
  stripTags,
  titleCase,
  slugify,
  absoluteUrl,
  parsePriceToNumber,
  parseMileageToKm,
  extractVin,
  uniqueStrings,
  hashString,
  normalizeFuel,
  normalizeTransmission,
  normalizeDrive,
  normalizeBodyStyle,
  yesNoDisplay,
  fetchWithRetry,
  createHtmlClient,
  mapLimit,
  downloadFile
};
