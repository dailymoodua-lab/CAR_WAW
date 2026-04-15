/* ═══════════════════════════════════════════════════════
   Car Auctions — Universal Filter Module

   Usage:
     initFilter({ data: normalizedArray, source: 'api'|'parser' })

   Depends on: js/core/utils.js
   Does NOT fetch data — receives pre-normalized array.
   ═══════════════════════════════════════════════════════ */

/* ─── State ─────────────────────────────────────────── */
var _filterState = {
  brand: new Set(), model: new Set(), year: new Set(),
  fuel: new Set(), engine: new Set(), trans: new Set(), drive: new Set(),
  odoMin: 0, odoMax: 300000,
  yearFrom: null, yearTo: null,
};
var _allCars      = [];
var _filteredCars = [];
var _shownCount   = 0;
var PAGE_SIZE     = 20;
var _sortMode     = 'price_desc';
var _layoutMode   = 'list';
var _rangeMeta    = {
  odoMin: 0,
  odoMax: 300000,
  yearMin: null,
  yearMax: null,
};

/* ─── Facet helpers ─────────────────────────────────── */
function getFacetValue(car, facet) {
  switch (facet) {
    case 'brand':  return car.make;
    case 'model':  return car.model;
    case 'year':   return String(car.year);
    case 'fuel':
    case 'engine': return car.fuel || car.engine;
    case 'trans':  return car.transmission;
    case 'drive':  return car.drive;
    default:       return '';
  }
}

var _activeFacetOrder = ['brand','model','year','fuel','engine','trans','drive'];

function _getActiveFacets() {
  return _activeFacetOrder.filter(function(f) {
    return !!document.querySelector('.filter-group[data-filter="' + f + '"]');
  });
}

function selectedSet(facet) {
  return _filterState[facet] || new Set();
}

/* ─── Range state ────────────────────────────────────── */
function refreshRangeStateFromInputs() {
  var oMin = numFromInput('odoMin', 0);
  var oMax = numFromInput('odoMax', _rangeMeta.odoMax || 300000);
  if (oMin > oMax) { var tmp = oMin; oMin = oMax; oMax = tmp; }
  _filterState.odoMin = oMin;
  _filterState.odoMax = oMax;

  var yFrom = numFromInput('yearFromInput', null);
  var yTo   = numFromInput('yearToInput', null);
  if (yFrom !== null && yTo !== null && yFrom > yTo) { var t = yFrom; yFrom = yTo; yTo = t; }
  _filterState.yearFrom = yFrom;
  _filterState.yearTo   = yTo;

  updateRangeLabels();
}

function updateRangeLabels() {
  var oMin = _filterState.odoMin;
  var oMax = _filterState.odoMax;
  var lMin = document.getElementById('odoMinLabel');
  var lMax = document.getElementById('odoMaxLabel');
  if (lMin) lMin.textContent = oMin.toLocaleString('en-US');
  if (lMax) lMax.textContent = oMax.toLocaleString('en-US');
  var fill = document.getElementById('odoRangeFill') || document.querySelector('.range-fill');
  if (fill) {
    var RANGE = Math.max(_rangeMeta.odoMax || 300000, 1);
    var left  = (oMin / RANGE) * 100;
    var right = 100 - (Math.min(oMax, RANGE) / RANGE) * 100;
    fill.style.left  = left + '%';
    fill.style.right = right + '%';
    fill.style.width = '';
  }
}

/* ─── Core filter logic ──────────────────────────────── */
function carMatches(car, excludeFacet) {
  var facets = _getActiveFacets();
  for (var i = 0; i < facets.length; i++) {
    var f = facets[i];
    if (f === excludeFacet) continue;
    var sel = selectedSet(f);
    if (!sel.size) continue;
    var val = getFacetValue(car, f);
    if (!sel.has(val)) return false;
  }
  /* year range */
  var hasYearFacet = selectedSet('year').size > 0;
  if (!hasYearFacet && (_filterState.yearFrom || _filterState.yearTo)) {
    if (_filterState.yearFrom && car.year < _filterState.yearFrom) return false;
    if (_filterState.yearTo   && car.year > _filterState.yearTo)   return false;
  }
  /* mileage */
  var km = car.mileageKm || 0;
  if (km < _filterState.odoMin || km > _filterState.odoMax) return false;

  return true;
}

function sortFacetOptions(facet, a, b) {
  if (facet === 'year') return parseInt(b, 10) - parseInt(a, 10);
  return String(a).localeCompare(String(b));
}

function normalizeSortNumber(value) {
  var n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function buildSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9а-яіїє]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function buildCardHref(car) {
  var title = car.title || [car.year, car.make, car.model].filter(Boolean).join(' ');
  var key = (car.vin || car.id || '').toString();
  var slug = buildSlug(title) + (key ? ('-' + key.toLowerCase()) : '');
  if (car.source === 'parser' || car.source === 'local') {
    return 'car.html?vin=' + encodeURIComponent(car.vin || '') + '&slug=' + encodeURIComponent(slug);
  }
  return 'car.html?lotId=' + encodeURIComponent(car.id || car.vin || '') + '&slug=' + encodeURIComponent(slug);
}

function sortCars(cars) {
  var list = cars.slice();
  list.sort(function(a, b) {
    var priceA = normalizeSortNumber(a.price || a.currentBid);
    var priceB = normalizeSortNumber(b.price || b.currentBid);
    var yearA = normalizeSortNumber(a.year);
    var yearB = normalizeSortNumber(b.year);
    var kmA = normalizeSortNumber(a.mileageKm);
    var kmB = normalizeSortNumber(b.mileageKm);

    if (_sortMode === 'price_asc') return priceA - priceB;
    if (_sortMode === 'price_desc') return priceB - priceA;
    if (_sortMode === 'year_desc') return yearB - yearA;
    if (_sortMode === 'year_asc') return yearA - yearB;
    if (_sortMode === 'mileage_asc') return kmA - kmB;
    if (_sortMode === 'mileage_desc') return kmB - kmA;
    return 0;
  });
  return list;
}

/* ─── Facet UI ───────────────────────────────────────── */
function facetContainer(facet) {
  var idMap = {
    brand: 'filterBrandList',
    model: 'filterModelList',
    year: 'filterYearList',
    fuel: 'filterFuelList',
    engine: 'filterFuelList',
    trans: 'filterTransList',
    drive: 'filterDriveList'
  };

  var byId = document.getElementById(idMap[facet]);
  if (byId) return byId;

  var group = document.querySelector('.filter-group[data-filter="' + facet + '"]');
  if (!group) return null;

  if (facet === 'year') {
    var yearInner = group.querySelector('.filter-inner');
    if (!yearInner) return null;

    yearInner.querySelectorAll('input.year-cb').forEach(function(cb) {
      var row = cb.closest('.cb-item');
      if (row) row.remove();
    });

    var yearDynamic = yearInner.querySelector('.dyn-year-list');
    if (!yearDynamic) {
      yearDynamic = document.createElement('div');
      yearDynamic.className = 'dyn-year-list';
      yearInner.appendChild(yearDynamic);
    }
    return yearDynamic;
  }

  group.querySelectorAll('.filter-inner > .cb-item').forEach(function(item) {
    item.remove();
  });

  var list = group.querySelector('.filter-list');
  if (list) return list;

  var inner = group.querySelector('.filter-inner');
  if (!inner) return null;
  var dyn = inner.querySelector('.dyn-' + facet + '-list');
  if (!dyn) {
    dyn = document.createElement('div');
    dyn.className = 'filter-list dyn-' + facet + '-list';
    inner.appendChild(dyn);
  }
  return dyn;
}

function facetCounts(facet) {
  var counts = {};
  _allCars.forEach(function(car) {
    if (!carMatches(car, facet)) return;
    var v = getFacetValue(car, facet);
    if (v) counts[v] = (counts[v] || 0) + 1;
  });
  selectedSet(facet).forEach(function(v) {
    if (!counts[v]) counts[v] = 0;
  });
  return counts;
}

function renderFacet(facet) {
  var container = facetContainer(facet);
  if (!container) return;
  var counts = facetCounts(facet);
  var values = Object.keys(counts).sort(sortFacetOptions.bind(null, facet));
  container.innerHTML = '';

  values.forEach(function(val) {
    if (!val) return;
    var cnt = counts[val] || 0;
    var checked = selectedSet(facet).has(val);

    var lbl = document.createElement('label');
    lbl.className = 'cb-item';
    if (!cnt && !checked) lbl.style.opacity = '0.45';

    var html = '';
    html += '<input type="checkbox" data-dyn="1" data-facet="' + escHtml(facet) + '" value="' + escHtml(val) + '" ' + (checked ? 'checked' : '') + (cnt || checked ? '' : ' disabled') + ' />';
    html += '<span class="cb-box"></span>';
    html += '<span class="cb-label">' + escHtml(val) + '</span>';
    html += '<span class="cb-num">' + cnt + '</span>';
    lbl.innerHTML = html;

    var input = lbl.querySelector('input');
    input.addEventListener('change', function() {
      if (this.checked) _filterState[facet].add(this.value);
      else _filterState[facet].delete(this.value);
      rerenderAll(true);
    });

    container.appendChild(lbl);
  });

  var group = document.querySelector('.filter-group[data-filter="' + facet + '"]');
  if (group) {
    group.classList.toggle('has-selection', selectedSet(facet).size > 0);
    var countEl = group.querySelector('.filter-count');
    if (countEl) {
      countEl.textContent = selectedSet(facet).size;
      countEl.style.display = selectedSet(facet).size ? '' : 'none';
    }
  }
}

/* ─── Card builder ───────────────────────────────────── */
function buildCarCard(car) {
  var transit = (car.source === 'parser' || car.source === 'local');
  var price   = formatPrice(car.price);
  var km      = formatKm(car.mileageKm);
  var href    = buildCardHref(car);

  var slides       = JSON.stringify(car.images || []);
  var total        = (car.images || []).length;
  var first        = (car.images || [])[0] || '';
  var badgeText    = transit ? 'В ДОРОЗІ' : 'NEW';
  var badgeStyle   = transit
    ? 'background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.25)'
    : 'background:rgba(255,92,0,0.12);color:var(--orange);border:1px solid rgba(255,92,0,0.25)';
  var badgeLabel   = transit ? 'В ДОРОЗІ' : 'АУКЦІОН';
  var vinLine      = transit
    ? escHtml(car.vin || '') + ' · <span>Парсер</span>'
    : escHtml(car.vin || '') + ' · <span>' + escHtml(car.id || '') + '</span>';
  var defaultLoc   = transit ? 'Варшава, Польща' : 'США';
  var locationText = transit ? 'Варшава, Польща' : (car.location || defaultLoc);
  var statusHtml   = transit
    ? '<span class="detail-value status-onward">В дорозі</span>'
    : '<span class="detail-value">' + escHtml(car.status || 'Аукціон') + '</span>';
  var priceLabel   = transit ? 'Ціна' : 'Поточна ставка';

  return '<div class="car-card" style="cursor:pointer" onclick="location.href=\'' + href + '\'">' +
    '<div class="card-badge-new">' + badgeText + '</div>' +
    '<div class="card-photo" data-slides=\'' + slides.replace(/'/g,'&#39;') + '\'>' +
      (first ? '<img src="' + escHtml(first) + '" class="slide-img" alt="' + escHtml(car.title) + '" loading="lazy" />' : '') +
      '<button class="slide-btn slide-prev" onclick="event.stopPropagation()" aria-label="Попереднє"><svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button class="slide-btn slide-next" onclick="event.stopPropagation()" aria-label="Наступне"><svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<div class="slide-counter"><span class="slide-cur">1</span>&thinsp;/&thinsp;<span class="slide-tot">' + total + '</span></div>' +
      '<div class="photo-overlay"></div>' +
    '</div>' +
    '<div class="card-body">' +
      '<div class="card-top">' +
        '<div class="card-title-block">' +
          '<a href="' + href + '" class="card-title" style="display:block" onclick="event.stopPropagation()">' + escHtml(car.title) + '</a>' +
          '<div class="card-vin">' + vinLine + '</div>' +
        '</div>' +
        '<span class="auction-badge" style="' + badgeStyle + '">' + badgeLabel + '</span>' +
        '<button class="fav-btn" onclick="event.stopPropagation()"><svg width="14" height="13" viewBox="0 0 14 13" fill="none"><path d="M7 12S1 8.2 1 4.5A3.5 3.5 0 017 2.1 3.5 3.5 0 0113 4.5C13 8.2 7 12 7 12z" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
      '</div>' +
      '<div class="card-specs">' +
        (car.drive        ? '<span class="spec-tag">' + escHtml(car.drive) + '</span>' : '') +
        (car.engine       ? '<span class="spec-tag">' + escHtml(car.engine) + '</span>' : '') +
        (car.fuel         ? '<span class="spec-tag">' + escHtml(car.fuel) + '</span>' : '') +
        (car.transmission ? '<span class="spec-tag">' + escHtml(car.transmission) + '</span>' : '') +
      '</div>' +
      '<div class="card-details">' +
        '<div class="detail-item"><span class="detail-label">Кілометраж</span><span class="detail-value">' + km + '</span></div>' +
        '<div class="detail-item"><span class="detail-label">Місце</span><span class="detail-value"><span class="status-dot dot-ok"></span>' + escHtml(locationText) + '</span></div>' +
        '<div class="detail-item"><span class="detail-label">Статус</span>' + statusHtml + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card-price">' +
      '<div>' +
        '<div class="current-bid-label">' + priceLabel + '</div>' +
        '<div class="current-bid-val">' + price + '</div>' +
      '</div>' +
      '<div class="bid-note">Продавець: ' + escHtml(car.seller || 'BIDDER') + '</div>' +
      '<a href="' + href + '" class="btn-auction" onclick="event.stopPropagation()" style="display:block;text-align:center">Детальніше</a>' +
    '</div>' +
  '</div>';
}

/* ─── Card interactions ──────────────────────────────── */
function initCardInteractions(root) {
  root.querySelectorAll('.card-photo').forEach(function(ph) {
    var raw;
    try { raw = JSON.parse(ph.getAttribute('data-slides')); } catch(e) { return; }
    var imgs = Array.isArray(raw) ? raw : [];
    var img  = ph.querySelector('.slide-img');
    var cur  = ph.querySelector('.slide-cur');
    var tot  = ph.querySelector('.slide-tot');
    if (!img || !imgs.length) return;
    var idx = 0;
    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      img.src = imgs[idx];
      if (cur) cur.textContent = idx + 1;
    }
    ph.querySelector('.slide-prev').addEventListener('click', function(e) { e.stopPropagation(); show(idx - 1); });
    ph.querySelector('.slide-next').addEventListener('click', function(e) { e.stopPropagation(); show(idx + 1); });
    /* touch swipe */
    var startX = 0;
    ph.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    ph.addEventListener('touchend',   function(e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(dx < 0 ? idx + 1 : idx - 1);
    }, { passive: true });
  });
  root.querySelectorAll('.fav-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) { e.stopPropagation(); this.classList.toggle('active'); });
  });
}

/* ─── Counters ───────────────────────────────────────── */
function updateCounters() {
  var n = _filteredCars.length;
  document.querySelectorAll('#resultsCount, #tabCount, .results-count strong').forEach(function(el) {
    el.textContent = n;
  });
}

/* ─── Render cards (paginated) ───────────────────────── */
function renderCards(reset) {
  var grid = document.getElementById('cars-grid') || document.getElementById('carList');
  if (!grid) return;
  grid.classList.toggle('layout-grid', _layoutMode === 'grid');
  if (reset) { grid.innerHTML = ''; _shownCount = 0; }

  /* empty state */
  if (_filteredCars.length === 0) {
    grid.innerHTML =
      '<div class="filter-empty">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9aa3b8" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
        '<p>Нічого не знайдено</p>' +
        '<button class="btn-reset-empty" onclick="document.querySelector(\'.reset-btn\')&&document.querySelector(\'.reset-btn\').click()">Скинути фільтри</button>' +
      '</div>';
    var loadMore = document.getElementById('loadMore') || document.getElementById('loadMoreBtn');
    if (loadMore) loadMore.style.display = 'none';
    return;
  }

  var batch = _filteredCars.slice(_shownCount, _shownCount + PAGE_SIZE);
  var frag  = document.createDocumentFragment();
  var wrap  = document.createElement('div');
  wrap.innerHTML = batch.map(buildCarCard).join('');
  initCardInteractions(wrap);
  while (wrap.firstChild) frag.appendChild(wrap.firstChild);
  grid.appendChild(frag);
  _shownCount += batch.length;
  var loadMore = document.getElementById('loadMore') || document.getElementById('loadMoreBtn');
  if (loadMore) loadMore.style.display = _shownCount < _filteredCars.length ? 'block' : 'none';
}

/* ─── Active filter chips ────────────────────────────── */
function updateActiveChips() {
  var container = document.querySelector('.active-chips');
  if (!container) return;
  var chips = [];
  _getActiveFacets().forEach(function(f) {
    selectedSet(f).forEach(function(v) {
      chips.push({ facet: f, value: v, label: v });
    });
  });
  if (_filterState.yearFrom || _filterState.yearTo) {
    var label = (_filterState.yearFrom || '—') + ' – ' + (_filterState.yearTo || '—');
    chips.push({ facet: '_yearRange', value: label, label: 'Рік: ' + label });
  }
  container.innerHTML = chips.map(function(c) {
    return '<div class="chip">' + escHtml(c.label) + ' <button type="button" data-facet="' + escHtml(c.facet) + '" data-value="' + escHtml(c.value) + '">×</button></div>';
  }).join('');
  container.querySelectorAll('button[data-facet]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var f = this.getAttribute('data-facet');
      var v = this.getAttribute('data-value');
      if (f === '_yearRange') {
        _filterState.yearFrom = null; _filterState.yearTo = null;
        var yf = document.getElementById('yearFromInput');
        var yt = document.getElementById('yearToInput');
        if (yf) yf.value = ''; if (yt) yt.value = '';
      } else if (_filterState[f]) {
        _filterState[f].delete(v);
      }
      rerenderAll(true);
    });
  });
}

/* ─── Main render cycle ──────────────────────────────── */
function rerenderAll(resetCards) {
  refreshRangeStateFromInputs();
  _filteredCars = _allCars.filter(function(car) { return carMatches(car, null); });
  _filteredCars = sortCars(_filteredCars);
  _getActiveFacets().forEach(renderFacet);
  updateCounters();
  updateActiveChips();
  renderCards(resetCards);
}

function bindSortAndLayout() {
  var sortBtn = document.querySelector('.sort-btn');
  var sortMenu = document.getElementById('sortMenu');
  var sortCurrent = document.getElementById('sortCurrent');

  function closeSortMenu() {
    if (sortMenu) sortMenu.classList.remove('open');
    if (sortBtn) sortBtn.classList.remove('open');
  }

  if (sortBtn && sortMenu) {
    sortBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var shouldOpen = !sortMenu.classList.contains('open');
      closeSortMenu();
      if (shouldOpen) {
        sortMenu.classList.add('open');
        sortBtn.classList.add('open');
      }
    });

    document.addEventListener('click', function(e) {
      if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
        closeSortMenu();
      }
    });

    sortMenu.querySelectorAll('.sort-option[data-sort]').forEach(function(option) {
      option.addEventListener('click', function() {
        _sortMode = this.getAttribute('data-sort') || 'price_desc';
        if (sortCurrent) sortCurrent.textContent = this.textContent.trim();
        sortMenu.querySelectorAll('.sort-option').forEach(function(o) {
          o.classList.toggle('active', o === option);
        });
        closeSortMenu();
        rerenderAll(true);
      });
    });
  }

  var layoutButtons = document.querySelectorAll('.layout-btn[data-layout]');
  if (layoutButtons.length) {
    layoutButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        _layoutMode = this.getAttribute('data-layout') || 'list';
        layoutButtons.forEach(function(btn) {
          btn.classList.toggle('active', btn === button);
        });
        renderCards(true);
      });
    });
  }
}

/* ─── Event binding ──────────────────────────────────── */
function bindResetButtons() {
  document.querySelectorAll('.reset-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      ['brand', 'model', 'year', 'fuel', 'engine', 'trans', 'drive'].forEach(function(f) {
        _filterState[f].clear();
      });

      var yf = document.getElementById('yearFromInput');
      var yt = document.getElementById('yearToInput');
      if (yf) yf.value = '';
      if (yt) yt.value = '';

      var oMin = document.getElementById('odoMin');
      var oMax = document.getElementById('odoMax');
      if (oMin) oMin.value = 0;
      if (oMax) oMax.value = _rangeMeta.odoMax;

      rerenderAll(true);
    });
  });

  ['brand', 'model', 'year', 'fuel', 'engine', 'trans', 'drive'].forEach(function(facet) {
    var group = document.querySelector('.filter-group[data-filter="' + facet + '"]');
    if (!group) return;
    var reset = group.querySelector('.filter-reset');
    if (!reset) return;
    reset.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (_filterState[facet]) _filterState[facet].clear();
      if (facet === 'year') {
        var yf = document.getElementById('yearFromInput');
        var yt = document.getElementById('yearToInput');
        if (yf) yf.value = '';
        if (yt) yt.value = '';
      }
      rerenderAll(true);
    });
  });
}

function bindRangeInputs() {
  ['odoMin', 'odoMax'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function() { rerenderAll(true); });
  });
  ['yearFromInput', 'yearToInput'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', function() { rerenderAll(true); });
      el.addEventListener('input', function() { rerenderAll(true); });
    }
  });
  var loadMore = document.getElementById('loadMore') || document.getElementById('loadMoreBtn');
  if (loadMore) loadMore.addEventListener('click', function() { renderCards(false); });
}

function computeRangeMeta(cars) {
  var years = cars.map(function(car) { return Number(car.year) || 0; }).filter(Boolean);
  var kms = cars.map(function(car) { return Number(car.mileageKm) || 0; }).filter(function(value) { return value >= 0; });
  var maxKm = kms.length ? Math.max.apply(null, kms) : 300000;
  var roundedKm = Math.ceil(maxKm / 5000) * 5000;

  _rangeMeta = {
    odoMin: 0,
    odoMax: Math.max(roundedKm || 300000, 300000),
    yearMin: years.length ? Math.min.apply(null, years) : null,
    yearMax: years.length ? Math.max.apply(null, years) : null,
  };
}

function syncInitialUiState() {
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(function(input) {
    input.checked = false;
  });

  document.querySelectorAll('.filter-group').forEach(function(group) {
    group.classList.remove('has-selection');
    var count = group.querySelector('.filter-count');
    if (count) {
      count.textContent = '0';
      count.style.display = 'none';
    }
  });

  var oMin = document.getElementById('odoMin');
  var oMax = document.getElementById('odoMax');
  if (oMin) {
    oMin.min = String(_rangeMeta.odoMin);
    oMin.max = String(_rangeMeta.odoMax);
    oMin.value = String(_rangeMeta.odoMin);
  }
  if (oMax) {
    oMax.min = String(_rangeMeta.odoMin);
    oMax.max = String(_rangeMeta.odoMax);
    oMax.value = String(_rangeMeta.odoMax);
  }

  var yFrom = document.getElementById('yearFromInput');
  var yTo = document.getElementById('yearToInput');
  if (yFrom) {
    if (_rangeMeta.yearMin) yFrom.min = String(_rangeMeta.yearMin);
    if (_rangeMeta.yearMax) yFrom.max = String(_rangeMeta.yearMax);
    yFrom.value = '';
  }
  if (yTo) {
    if (_rangeMeta.yearMin) yTo.min = String(_rangeMeta.yearMin);
    if (_rangeMeta.yearMax) yTo.max = String(_rangeMeta.yearMax);
    yTo.value = '';
  }

  var yearMin = document.getElementById('yearMin');
  var yearMax = document.getElementById('yearMax');
  var yearMinLabel = document.getElementById('yearMinLabel');
  var yearMaxLabel = document.getElementById('yearMaxLabel');
  var yearRangeFill = document.getElementById('yearRangeFill');
  if (yearMin && _rangeMeta.yearMin) {
    yearMin.min = String(_rangeMeta.yearMin);
    yearMin.max = String(_rangeMeta.yearMax || _rangeMeta.yearMin);
    yearMin.value = String(_rangeMeta.yearMin);
  }
  if (yearMax && _rangeMeta.yearMax) {
    yearMax.min = String(_rangeMeta.yearMin || _rangeMeta.yearMax);
    yearMax.max = String(_rangeMeta.yearMax);
    yearMax.value = String(_rangeMeta.yearMax);
  }
  if (yearMinLabel) yearMinLabel.textContent = _rangeMeta.yearMin || '—';
  if (yearMaxLabel) yearMaxLabel.textContent = _rangeMeta.yearMax || '—';
  if (yearRangeFill) {
    yearRangeFill.style.left = '0%';
    yearRangeFill.style.right = '0%';
    yearRangeFill.style.width = '100%';
  }
}

/* ─── Public API ─────────────────────────────────────── */

/**
 * Initialize the filter engine.
 * @param {Object} options
 * @param {Array}  options.data   - pre-normalized car array (from loadData)
 * @param {string} options.source - 'api' | 'parser' | 'local' (optional, used for hints)
 */
function initFilter(options) {
  if (window.__filterInitialized) return;
  window.__filterInitialized = true;

  _allCars    = options.data || [];
  _shownCount = 0;
  computeRangeMeta(_allCars);

  /* reset state */
  _filterState = {
    brand: new Set(), model: new Set(), year: new Set(),
    fuel: new Set(), engine: new Set(), trans: new Set(), drive: new Set(),
    odoMin: _rangeMeta.odoMin, odoMax: _rangeMeta.odoMax, yearFrom: null, yearTo: null,
  };

  syncInitialUiState();
  bindResetButtons();
  bindRangeInputs();
  bindSortAndLayout();
  rerenderAll(true);
}
