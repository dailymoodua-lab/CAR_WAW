/* ═══════════════════════════════════════════════════════
   Car Auctions — Shared Utilities
   Global helpers used across all modules.
   ═══════════════════════════════════════════════════════ */

/** Escape HTML special characters for safe injection into innerHTML */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Format numeric price to "$12,345" or "Уточнюється" */
function formatPrice(val) {
  if (!val && val !== 0) return 'Уточнюється';
  return '$' + Number(val).toLocaleString('en-US');
}

/** Format mileage km to "12,345 km" or "—" */
function formatKm(val) {
  if (!val && val !== 0) return '—';
  return Number(val).toLocaleString('en-US') + ' km';
}

/** Extract numeric km from raw mileage string ("137 000 km" → 137000) */
function parseMileageToKm(raw) {
  if (!raw) return 0;
  if (typeof raw === 'number') return raw;
  var digits = String(raw).replace(/\D+/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

/** Get integer from DOM input by id, with fallback */
function numFromInput(id, fallback) {
  var el = document.getElementById(id);
  if (!el) return fallback;
  var n = parseInt(el.value, 10);
  return isNaN(n) ? fallback : n;
}
