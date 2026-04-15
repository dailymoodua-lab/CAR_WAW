/* ═══════════════════════════════════════════════════════
   Car Auctions — Data Layer
   Normalizes and loads car data from all sources.

   Canonical car object:
   {
     id, title, price, images, location, status, source,
     year, make, model, vin, lotId,
     mileageKm, mileageRaw,
     fuel, transmission, engine, drive,
     seller, imageCount, color, saleStatus
   }
   ═══════════════════════════════════════════════════════ */

/* ─── Image path helper ─────────────────────────────── */
function ensureImagePath(p) {
  if (!p) return '';
  if (/^https?:\/\//.test(p)) return p;
  return p.replace(/^\.?\//, '');
}

function normalizeTransitLocation(rawLocation) {
  var loc = String(rawLocation || '').trim();
  if (!loc) return 'Варшава, Польща';
  if (/льв|lviv/i.test(loc)) return 'Варшава, Польща';
  return loc;
}

/* ─── Source normalizers ─────────────────────────────── */

/**
 * Normalize a raw car object from cars_catalog.json (Copart API)
 */
function normalizeApiCar(raw) {
  var images = Array.isArray(raw.images)
    ? raw.images.map(ensureImagePath).filter(Boolean)
    : [];
  return {
    id:           raw.lotId || raw.id,
    title:        String(raw.title || '').trim(),
    price:        raw.price ? Number(raw.price) : null,
    images:       images,
    imageCount:   raw.imageCount || images.length,
    location:     raw.location || 'США',
    status:       raw.saleStatus || 'Аукціон',
    source:       'api',
    /* extras */
    year:         raw.year ? parseInt(raw.year, 10) : null,
    make:         String(raw.make || '').toUpperCase().trim(),
    model:        String(raw.model || '').toUpperCase().trim(),
    vin:          String(raw.vin || '').replace(/\*+$/, ''),
    lotId:        raw.lotId,
    mileageKm:    typeof raw.mileage_km === 'number' ? raw.mileage_km : parseMileageToKm(raw.mileage),
    mileageRaw:   raw.mileage_mi ? raw.mileage_mi + ' mi' : '',
    fuel:         String(raw.fuel || '').toUpperCase().trim(),
    transmission: String(raw.transmission || '').toUpperCase().trim(),
    engine:       String(raw.engine || '').trim(),
    drive:        String(raw.drive || '').toUpperCase().trim(),
    color:        raw.color || '',
    seller:       raw.seller || 'BIDDER',
    saleStatus:   raw.saleStatus || 'Аукціон',
  };
}

/**
 * Normalize a raw car object from cars_transit.json (parser)
 */
function normalizeParserCar(raw) {
  var images = Array.isArray(raw.images)
    ? raw.images.map(ensureImagePath).filter(Boolean)
    : [];
  return {
    id:           raw.listing_id || raw.id,
    title:        String(raw.title || '').trim(),
    price:        raw.price ? Number(raw.price) : null,
    images:       images,
    imageCount:   images.length,
    location:     normalizeTransitLocation(raw.location),
    status:       'В дорозі',
    source:       'parser',
    /* extras */
    year:         raw.year ? parseInt(raw.year, 10) : null,
    make:         String(raw.make || '').toUpperCase().trim(),
    model:        String(raw.model || '').toUpperCase().trim(),
    vin:          String(raw.vin || ''),
    lotId:        null,
    mileageKm:    typeof raw.mileage_km === 'number'
                    ? raw.mileage_km
                    : parseMileageToKm(raw.mileage),
    mileageRaw:   '',
    fuel:         String(raw.fuel || '').toUpperCase().trim(),
    transmission: String(raw.transmission || '').toUpperCase().trim(),
    engine:       String(raw.engine || '').trim(),
    drive:        String(raw.drive || '').toUpperCase().trim(),
    color:        raw.color || '',
    seller:       raw.seller || 'BIDDER',
    saleStatus:   'В дорозі',
  };
}

/**
 * Normalize a LOCAL car object (hardcoded or from local JSON)
 */
function normalizeLocalCar(raw) {
  var images = Array.isArray(raw.images)
    ? raw.images.map(ensureImagePath).filter(Boolean)
    : [];
  return {
    id:           raw.vin || raw.id,
    title:        String(raw.title || '').trim(),
    price:        raw.price ? Number(raw.price) : null,
    images:       images,
    imageCount:   images.length,
    location:     raw.location || 'Польща',
    status:       raw.status || 'В дорозі',
    source:       'local',
    /* extras */
    year:         raw.year ? parseInt(raw.year, 10) : null,
    make:         String(raw.make || '').toUpperCase().trim(),
    model:        String(raw.model || '').toUpperCase().trim(),
    vin:          String(raw.vin || ''),
    lotId:        null,
    mileageKm:    raw.mileageKm || parseMileageToKm(raw.odometer),
    mileageRaw:   '',
    fuel:         String(raw.fuel || '').toUpperCase().trim(),
    transmission: String(raw.transmission || '').toUpperCase().trim(),
    engine:       String(raw.engine || '').trim(),
    drive:        String(raw.drive || '').toUpperCase().trim(),
    color:        raw.color || '',
    seller:       raw.seller || 'BIDDER',
    saleStatus:   raw.status || 'В дорозі',
  };
}

/* ─── Normalizer registry ───────────────────────────── */
var DATA_NORMALIZERS = {
  api:    normalizeApiCar,
  parser: normalizeParserCar,
  local:  normalizeLocalCar,
};

/* ─── Universal data loader ─────────────────────────── */

var _dataCache = {};

/**
 * Fetch JSON from url, normalize each item with the right normalizer.
 * Results are cached in memory — repeated calls return the same Promise.
 * @param  {string} url    - path to JSON file
 * @param  {string} type   - 'api' | 'parser' | 'local'
 * @returns {Promise<Array>} array of normalized car objects
 */
function loadData(url, type) {
  if (_dataCache[url]) return _dataCache[url];
  var normalize = DATA_NORMALIZERS[type] || function(x) { return x; };
  _dataCache[url] = fetch(url)
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ': ' + url);
      return r.json();
    })
    .then(function(raw) {
      var arr = Array.isArray(raw) ? raw : (raw.cars || raw.data || []);
      return arr.map(normalize);
    });
  return _dataCache[url];
}
