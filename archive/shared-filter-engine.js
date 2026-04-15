(function () {
  'use strict';

  if (window.__sharedFilterEngineInitialized) return;
  window.__sharedFilterEngineInitialized = true;

  var path = (window.location.pathname || '').toLowerCase();
  var isCatalog = path.indexOf('catalog') !== -1;
  if (!isCatalog) return;

  var isAvailable = path.indexOf('catalog-available') !== -1;
  var isCultSubdir = path.indexOf('/cult-cars/') !== -1;

  var dataFile = isAvailable ? 'cars_parser.json' : 'cars_api.json';
  var primaryDataBase = isCultSubdir ? '../data/' : 'data/';
  var fallbackDataBase = isCultSubdir ? 'data/' : '../data/';
  var imageBase = isCultSubdir ? '../images/' : 'images/';

  var PAGE_SIZE = 20;
  var allCars = [];
  var filteredCars = [];
  var shownCount = 0;

  var state = {
    brand: new Set(),
    model: new Set(),
    year: new Set(),
    fuel: new Set(),
    engine: new Set(),
    trans: new Set(),
    drive: new Set(),
    odoMin: 0,
    odoMax: 300000,
    yearFrom: null,
    yearTo: null
  };

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function numFromInput(id, fallback) {
    var el = document.getElementById(id);
    if (!el) return fallback;
    var n = parseInt(el.value, 10);
    return isNaN(n) ? fallback : n;
  }

  function parseMileageToKm(raw) {
    if (typeof raw === 'number' && !isNaN(raw)) return raw;
    var digits = String(raw || '').replace(/\D/g, '');
    var n = parseInt(digits, 10);
    return isNaN(n) ? 0 : n;
  }

  function ensureImagePath(p) {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    if (p.indexOf('images/') === 0 || p.indexOf('../images/') === 0) return p;
    return imageBase + p;
  }

  function normalizeCar(raw) {
    var images = Array.isArray(raw.images) ? raw.images.map(ensureImagePath) : [];
    var mileageKm = typeof raw.mileage_km === 'number' ? raw.mileage_km : parseMileageToKm(raw.mileage);

    return {
      id: raw.id,
      lotId: raw.lotId || raw.listing_id || '',
      vin: raw.vin || '',
      title: raw.title || '',
      year: parseInt(raw.year, 10) || 0,
      make: String(raw.make || '').trim().toUpperCase(),
      model: String(raw.model || '').trim().toUpperCase(),
      fuel: String(raw.fuel || '').trim().toUpperCase(),
      transmission: String(raw.transmission || '').trim().toUpperCase(),
      drive: String(raw.drive || '').trim().toUpperCase(),
      engine: raw.engine || '',
      color: raw.color || '',
      location: raw.location || '',
      seller: raw.seller || 'Car Auctions',
      saleStatus: raw.saleStatus || (isAvailable ? 'В дорозі' : 'Аукціон'),
      price: Number(raw.price) || 0,
      mileageKm: mileageKm,
      mileageRaw: raw.mileage || raw.mileage_km || '',
      images: images,
      imageCount: raw.imageCount || images.length
    };
  }

  function getFacetValue(car, facet) {
    if (facet === 'brand') return car.make;
    if (facet === 'model') return car.model;
    if (facet === 'year') return car.year ? String(car.year) : '';
    if (facet === 'fuel') return car.fuel;
    if (facet === 'engine') return car.fuel || car.engine;
    if (facet === 'trans') return car.transmission;
    if (facet === 'drive') return car.drive;
    return '';
  }

  var activeFacetOrder = ['brand', 'model', 'fuel', 'engine', 'trans', 'drive'].filter(function (facet) {
    return !!document.querySelector('.filter-group[data-filter="' + facet + '"]');
  });

  function selectedSet(facet) {
    return state[facet] || new Set();
  }

  function refreshRangeStateFromInputs() {
    state.odoMin = numFromInput('odoMin', 0);
    state.odoMax = numFromInput('odoMax', 300000);

    if (state.odoMin > state.odoMax) {
      var t = state.odoMin;
      state.odoMin = state.odoMax;
      state.odoMax = t;
    }

    var yf = numFromInput('yearFromInput', null);
    var yt = numFromInput('yearToInput', null);
    state.yearFrom = yf;
    state.yearTo = yt;

    if (state.yearFrom && state.yearTo && state.yearFrom > state.yearTo) {
      var y = state.yearFrom;
      state.yearFrom = state.yearTo;
      state.yearTo = y;
    }

    updateRangeLabels();
  }

  function updateRangeLabels() {
    var minL = document.getElementById('odoMinLabel');
    var maxL = document.getElementById('odoMaxLabel');
    if (minL) minL.textContent = Number(state.odoMin || 0).toLocaleString('en-US');
    if (maxL) maxL.textContent = Number(state.odoMax || 0).toLocaleString('en-US');

    var fill = document.getElementById('odoRangeFill');
    if (fill) {
      var lo = Math.max(0, Math.min(300000, state.odoMin || 0));
      var hi = Math.max(0, Math.min(300000, state.odoMax || 0));
      var left = (lo / 300000) * 100;
      var right = (hi / 300000) * 100;
      fill.style.left = left + '%';
      fill.style.width = Math.max(0, right - left) + '%';
    }
  }

  function carMatches(car, excludeFacet) {
    var facets = activeFacetOrder;
    for (var i = 0; i < facets.length; i++) {
      var f = facets[i];
      if (excludeFacet === f) continue;
      var sel = selectedSet(f);
      if (sel.size) {
        var val = getFacetValue(car, f);
        if (!sel.has(val)) return false;
      }
    }

    if (excludeFacet !== 'year') {
      var yearSel = selectedSet('year');
      if (yearSel.size) {
        if (!yearSel.has(String(car.year || ''))) return false;
      } else {
        if (state.yearFrom && car.year < state.yearFrom) return false;
        if (state.yearTo && car.year > state.yearTo) return false;
      }
    }

    if (car.mileageKm < state.odoMin || car.mileageKm > state.odoMax) return false;

    return true;
  }

  function sortFacetOptions(facet, a, b) {
    if (facet === 'year') return Number(b) - Number(a);
    return a.localeCompare(b);
  }

  function facetContainer(facet) {
    var idMap = {
      brand: 'filterBrandList',
      model: 'filterModelList',
      year: 'filterYearList',
      fuel: 'filterFuelList',
      engine: 'filterEngineList',
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

      yearInner.querySelectorAll('input.year-cb').forEach(function (cb) {
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
    var selected = selectedSet(facet);
    var base = allCars.filter(function (car) {
      return carMatches(car, facet);
    });

    base.forEach(function (car) {
      var val = getFacetValue(car, facet);
      if (!val) return;
      counts[val] = (counts[val] || 0) + 1;
    });

    selected.forEach(function (val) {
      if (!counts[val]) counts[val] = 0;
    });

    return counts;
  }

  function renderFacet(facet) {
    var container = facetContainer(facet);
    if (!container) return;

    var counts = facetCounts(facet);
    var keys = Object.keys(counts).sort(function (a, b) {
      return sortFacetOptions(facet, a, b);
    });

    container.innerHTML = '';

    keys.forEach(function (val) {
      var cnt = counts[val] || 0;
      var checked = selectedSet(facet).has(val);

      var lbl = document.createElement('label');
      lbl.className = 'cb-item';
      if (!cnt && !checked) lbl.style.opacity = '0.45';

      var html = '';
      html += '<input type="checkbox" data-dyn="1" data-facet="' + facet + '" value="' + escHtml(val) + '" ' + (checked ? 'checked' : '') + (cnt || checked ? '' : ' disabled') + ' />';
      html += '<span class="cb-box"></span>';
      html += '<span class="cb-label">' + escHtml(val) + '</span>';
      html += '<span class="cb-num">' + cnt + '</span>';
      lbl.innerHTML = html;

      var input = lbl.querySelector('input');
      input.addEventListener('change', function () {
        if (this.checked) state[facet].add(this.value);
        else state[facet].delete(this.value);
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

  function buildAuctionCard(car) {
    var first = car.images[0] || '';
    var slides = JSON.stringify(car.images || []);
    var total = car.images.length;
    var price = car.price ? '$' + Number(car.price).toLocaleString('en-US') : 'Уточнюється';
    var km = car.mileageKm ? Number(car.mileageKm).toLocaleString('en-US') + ' km' : '—';
    var href = 'car.html#lotId=' + encodeURIComponent(car.lotId || car.vin || '');

    return '' +
      '<div class="car-card" style="cursor:pointer" onclick="location.href=\'' + href + '\'">' +
        '<div class="card-badge-new">NEW</div>' +
        '<div class="card-photo" data-slides=' + "'" + slides.replace(/'/g, '&#39;') + "'" + '>' +
          (first ? '<img src="' + escHtml(first) + '" class="slide-img" alt="' + escHtml(car.title) + '" loading="lazy" />' : '') +
          '<button class="slide-btn slide-prev" onclick="event.stopPropagation()" aria-label="Попереднє"><svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
          '<button class="slide-btn slide-next" onclick="event.stopPropagation()" aria-label="Наступне"><svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
          '<div class="slide-counter"><span class="slide-cur">1</span>&thinsp;/&thinsp;<span class="slide-tot">' + total + '</span></div>' +
          '<div class="photo-overlay"></div>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-top">' +
            '<div class="card-title-block">' +
              '<a href="' + href + '" class="card-title" style="display:block;cursor:pointer" onclick="event.stopPropagation()">' + escHtml(car.title) + '</a>' +
              '<div class="card-vin">' + escHtml((car.vin || '').replace(/\*+$/,'')) + ' · <span>' + escHtml(car.lotId || '') + '</span></div>' +
            '</div>' +
            '<span class="auction-badge" style="background:rgba(255,92,0,0.12);color:var(--orange);border:1px solid rgba(255,92,0,0.25)">АУКЦІОН</span>' +
            '<button class="fav-btn" onclick="event.stopPropagation()"><svg width="14" height="13" viewBox="0 0 14 13" fill="none"><path d="M7 12S1 8.2 1 4.5A3.5 3.5 0 017 2.1 3.5 3.5 0 0113 4.5C13 8.2 7 12 7 12z" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
          '</div>' +
          '<div class="card-specs">' +
            (car.drive ? '<span class="spec-tag">' + escHtml(car.drive) + '</span>' : '') +
            (car.engine ? '<span class="spec-tag">' + escHtml(car.engine) + '</span>' : '') +
            (car.fuel ? '<span class="spec-tag">' + escHtml(car.fuel) + '</span>' : '') +
            (car.transmission ? '<span class="spec-tag">' + escHtml(car.transmission) + '</span>' : '') +
          '</div>' +
          '<div class="card-details">' +
            '<div class="detail-item"><span class="detail-label">Кілометраж</span><span class="detail-value">' + km + '</span></div>' +
            '<div class="detail-item"><span class="detail-label">Місце</span><span class="detail-value"><span class="status-dot dot-ok"></span>' + escHtml(car.location || 'США') + '</span></div>' +
            '<div class="detail-item"><span class="detail-label">Статус</span><span class="detail-value">' + escHtml(car.saleStatus || 'Аукціон') + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="card-price">' +
          '<div>' +
            '<div class="current-bid-label">Поточна ставка</div>' +
            '<div class="current-bid-val">' + price + '</div>' +
          '</div>' +
          '<div class="bid-note">Продавець: ' + escHtml(car.seller || 'Car Auctions') + '</div>' +
          '<a href="' + href + '" class="btn-auction" onclick="event.stopPropagation()" style="display:block;text-align:center">Детальніше</a>' +
        '</div>' +
      '</div>';
  }

  function buildOnRoadCard(car) {
    var first = car.images[0] || '';
    var slides = JSON.stringify(car.images || []);
    var total = car.images.length;
    var price = car.price ? '$' + Number(car.price).toLocaleString('en-US') : 'Уточнюється';
    var km = car.mileageKm ? Number(car.mileageKm).toLocaleString('en-US') + ' km' : escHtml(car.mileageRaw || '—');
    var href = 'car.html#vin=' + encodeURIComponent(car.vin || '');

    return '' +
      '<div class="car-card" style="cursor:pointer" onclick="location.href=\'' + href + '\'">' +
        '<div class="card-badge-new">В ДОРОЗІ</div>' +
        '<div class="card-photo" data-slides=' + "'" + slides.replace(/'/g, '&#39;') + "'" + '>' +
          (first ? '<img src="' + escHtml(first) + '" class="slide-img" alt="' + escHtml(car.title) + '" loading="lazy" />' : '') +
          '<button class="slide-btn slide-prev" onclick="event.stopPropagation()" aria-label="Попереднє"><svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
          '<button class="slide-btn slide-next" onclick="event.stopPropagation()" aria-label="Наступне"><svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
          '<div class="slide-counter"><span class="slide-cur">1</span>&thinsp;/&thinsp;<span class="slide-tot">' + total + '</span></div>' +
          '<div class="photo-overlay"></div>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-top">' +
            '<div class="card-title-block">' +
              '<a href="' + href + '" class="card-title" style="display:block;cursor:pointer" onclick="event.stopPropagation()">' + escHtml(car.title) + '</a>' +
              '<div class="card-vin">' + escHtml(car.vin || '') + ' · <span>Парсер</span></div>' +
            '</div>' +
            '<span class="auction-badge" style="background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.25)">В ДОРОЗІ</span>' +
            '<button class="fav-btn" onclick="event.stopPropagation()"><svg width="14" height="13" viewBox="0 0 14 13" fill="none"><path d="M7 12S1 8.2 1 4.5A3.5 3.5 0 017 2.1 3.5 3.5 0 0113 4.5C13 8.2 7 12 7 12z" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
          '</div>' +
          '<div class="card-specs">' +
            (car.drive ? '<span class="spec-tag">' + escHtml(car.drive) + '</span>' : '') +
            (car.engine ? '<span class="spec-tag">' + escHtml(car.engine) + '</span>' : '') +
            (car.fuel ? '<span class="spec-tag">' + escHtml(car.fuel) + '</span>' : '') +
            (car.transmission ? '<span class="spec-tag">' + escHtml(car.transmission) + '</span>' : '') +
          '</div>' +
          '<div class="card-details">' +
            '<div class="detail-item"><span class="detail-label">Кілометраж</span><span class="detail-value">' + km + '</span></div>' +
            '<div class="detail-item"><span class="detail-label">Місце</span><span class="detail-value"><span class="status-dot dot-ok"></span>' + escHtml(car.location || 'Варшава, Польща') + '</span></div>' +
            '<div class="detail-item"><span class="detail-label">Статус</span><span class="detail-value status-onward">В дорозі</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="card-price">' +
          '<div>' +
            '<div class="current-bid-label">Ціна</div>' +
            '<div class="current-bid-val">' + price + '</div>' +
          '</div>' +
          '<div class="bid-note">Продавець: ' + escHtml(car.seller || 'Car Auctions') + '</div>' +
          '<a href="' + href + '" class="btn-auction" onclick="event.stopPropagation()" style="display:block;text-align:center">Детальніше</a>' +
        '</div>' +
      '</div>';
  }

  function initCardInteractions(root) {
    root.querySelectorAll('.card-photo[data-slides]').forEach(function (photo) {
      var slides = [];
      try { slides = JSON.parse(photo.getAttribute('data-slides') || '[]'); }
      catch (e) { slides = []; }
      if (!Array.isArray(slides) || !slides.length) return;

      var img = photo.querySelector('.slide-img');
      var curEl = photo.querySelector('.slide-cur');
      var index = 0;

      function goTo(i) {
        index = ((i % slides.length) + slides.length) % slides.length;
        if (img) img.src = slides[index];
        if (curEl) curEl.textContent = String(index + 1);
      }

      var prev = photo.querySelector('.slide-prev');
      var next = photo.querySelector('.slide-next');
      if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); goTo(index - 1); });
      if (next) next.addEventListener('click', function (e) { e.stopPropagation(); goTo(index + 1); });

      var touchX = 0;
      photo.addEventListener('touchstart', function (e) {
        touchX = e.changedTouches[0].clientX;
      }, { passive: true });
      photo.addEventListener('touchend', function (e) {
        var d = e.changedTouches[0].clientX - touchX;
        if (Math.abs(d) > 40) {
          e.stopPropagation();
          goTo(d < 0 ? index + 1 : index - 1);
        }
      });
    });

    root.querySelectorAll('.fav-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        btn.classList.toggle('active');
      });
    });
  }

  function updateCounters() {
    var resultsCount = document.getElementById('resultsCount') || document.querySelector('.results-count strong');
    if (resultsCount) resultsCount.textContent = filteredCars.length;

    var tabCount = document.getElementById('tabCount') || document.querySelector('.catalog-tabs .tab-item.active .tab-count');
    if (tabCount) tabCount.textContent = filteredCars.length;
  }

  function renderCards(reset) {
    var carList = document.getElementById('carList');
    if (!carList) return;

    if (reset) {
      carList.innerHTML = '';
      shownCount = 0;
    }

    var batch = filteredCars.slice(shownCount, shownCount + PAGE_SIZE);
    var html = batch.map(function (car) {
      return isAvailable ? buildOnRoadCard(car) : buildAuctionCard(car);
    }).join('');

    if (html) {
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      while (tmp.firstChild) carList.appendChild(tmp.firstChild);
      initCardInteractions(carList);
    }

    shownCount += batch.length;

    var loadMore = document.getElementById('loadMoreBtn');
    if (loadMore) loadMore.style.display = shownCount < filteredCars.length ? '' : 'none';
  }

  function updateActiveChips() {
    var chipsRoot = document.getElementById('activeChips');
    if (!chipsRoot) return;

    var chips = [];
    ['brand', 'model', 'year', 'fuel', 'engine', 'trans', 'drive'].forEach(function (facet) {
      selectedSet(facet).forEach(function (val) {
        chips.push({ facet: facet, value: val, label: val });
      });
    });

    if (state.year.size === 0 && (state.yearFrom || state.yearTo)) {
      var label = (state.yearFrom || '') + ((state.yearFrom || state.yearTo) ? ' - ' : '') + (state.yearTo || '');
      chips.push({ facet: 'yearRange', value: '', label: label });
    }

    chipsRoot.innerHTML = chips.map(function (chip) {
      return '<div class="chip">' + escHtml(chip.label) + ' <button type="button" data-chip-facet="' + chip.facet + '" data-chip-value="' + escHtml(chip.value) + '">×</button></div>';
    }).join('');

    chipsRoot.querySelectorAll('button[data-chip-facet]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-chip-facet');
        var v = btn.getAttribute('data-chip-value') || '';
        if (f === 'yearRange') {
          var yf = document.getElementById('yearFromInput');
          var yt = document.getElementById('yearToInput');
          if (yf) yf.value = '';
          if (yt) yt.value = '';
          state.yearFrom = null;
          state.yearTo = null;
        } else if (state[f]) {
          state[f].delete(v);
        }
        rerenderAll(true);
      });
    });
  }

  function rerenderAll(resetCards) {
    refreshRangeStateFromInputs();

    filteredCars = allCars.filter(function (car) {
      return carMatches(car, null);
    });

    ['brand', 'model', 'year', 'fuel', 'engine', 'trans', 'drive'].forEach(renderFacet);

    updateCounters();
    updateActiveChips();
    renderCards(resetCards);
  }

  function bindResetButtons() {
    var globalResets = document.querySelectorAll('.reset-btn');
    globalResets.forEach(function (btn) {
      btn.addEventListener('click', function () {
        ['brand', 'model', 'year', 'fuel', 'engine', 'trans', 'drive'].forEach(function (f) {
          state[f].clear();
        });

        var yf = document.getElementById('yearFromInput');
        var yt = document.getElementById('yearToInput');
        if (yf) yf.value = '';
        if (yt) yt.value = '';

        var oMin = document.getElementById('odoMin');
        var oMax = document.getElementById('odoMax');
        if (oMin) oMin.value = 0;
        if (oMax) oMax.value = 300000;

        rerenderAll(true);
      });
    });

    ['brand', 'model', 'year', 'fuel', 'engine', 'trans', 'drive'].forEach(function (facet) {
      var group = document.querySelector('.filter-group[data-filter="' + facet + '"]');
      if (!group) return;
      var reset = group.querySelector('.filter-reset');
      if (!reset) return;
      reset.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (state[facet]) state[facet].clear();
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
    ['odoMin', 'odoMax', 'yearFromInput', 'yearToInput'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var evt = id.indexOf('year') === 0 ? 'change' : 'input';
      el.addEventListener(evt, function () {
        rerenderAll(true);
      });
    });

    var loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        renderCards(false);
      });
    }
  }

  async function fetchData() {
    var urls = [primaryDataBase + dataFile, fallbackDataBase + dataFile];
    var lastErr;

    for (var i = 0; i < urls.length; i++) {
      try {
        var res = await fetch(urls[i]);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
      } catch (e) {
        lastErr = e;
      }
    }

    throw lastErr || new Error('Failed to load data');
  }

  async function init() {
    try {
      var raw = await fetchData();
      allCars = Array.isArray(raw) ? raw.map(normalizeCar) : [];

      bindRangeInputs();
      bindResetButtons();
      rerenderAll(true);

      console.log('[shared-filter-engine] ready:', isAvailable ? 'catalog-available' : 'catalog', allCars.length);
    } catch (e) {
      console.error('[shared-filter-engine] failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
