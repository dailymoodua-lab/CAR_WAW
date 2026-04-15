(function () {
  'use strict';

  var CURRENCY = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });
  var CURRENT_YEAR = new Date().getFullYear();
  var FALLBACK_REFERENCE_DATA = {
    generatedAt: '2026-04-08',
    coefficients: {
      vehicle: [
        { item: 'Automobiles', coefficient: 800 },
        { item: 'Crossover', coefficient: 900 },
        { item: 'SUVs', coefficient: 950 },
        { item: 'Moto', coefficient: 450 },
        { item: 'PickupTrucks', coefficient: 1200 }
      ],
      copart: [
        { item: '49', coefficient: 71 }, { item: '99', coefficient: 71 }, { item: '199', coefficient: 145 },
        { item: '299', coefficient: 180 }, { item: '349', coefficient: 205 }, { item: '399', coefficient: 220 },
        { item: '449', coefficient: 245 }, { item: '499', coefficient: 255 }, { item: '549', coefficient: 280 },
        { item: '599', coefficient: 290 }, { item: '699', coefficient: 305 }, { item: '799', coefficient: 330 },
        { item: '899', coefficient: 350 }, { item: '999', coefficient: 365 }, { item: '1199', coefficient: 405 },
        { item: '1299', coefficient: 425 }, { item: '1399', coefficient: 440 }, { item: '1499', coefficient: 455 },
        { item: '1599', coefficient: 480 }, { item: '1699', coefficient: 495 }, { item: '1799', coefficient: 515 },
        { item: '1999', coefficient: 535 }, { item: '2399', coefficient: 555 }, { item: '2499', coefficient: 590 },
        { item: '2999', coefficient: 625 }, { item: '3499', coefficient: 670 }, { item: '3999', coefficient: 720 },
        { item: '4499', coefficient: 780 }, { item: '4999', coefficient: 805 }, { item: '5999', coefficient: 855 },
        { item: '6499', coefficient: 915 }, { item: '6999', coefficient: 935 }, { item: '7499', coefficient: 970 },
        { item: '7999', coefficient: 990 }, { item: '8499', coefficient: 1030 }, { item: '8999', coefficient: 1050 },
        { item: '9999', coefficient: 1050 }, { item: '10499', coefficient: 1080 }, { item: '10999', coefficient: 1080 },
        { item: '11499', coefficient: 1080 }, { item: '11999', coefficient: 1090 }, { item: '12499', coefficient: 1105 },
        { item: '14999', coefficient: 1120 }
      ],
      iaai: [
        { item: '49', coefficient: 71 }, { item: '99', coefficient: 71 }, { item: '199', coefficient: 145 },
        { item: '299', coefficient: 180 }, { item: '349', coefficient: 205 }, { item: '399', coefficient: 220 },
        { item: '449', coefficient: 245 }, { item: '499', coefficient: 255 }, { item: '549', coefficient: 280 },
        { item: '599', coefficient: 290 }, { item: '699', coefficient: 305 }, { item: '799', coefficient: 330 },
        { item: '899', coefficient: 350 }, { item: '999', coefficient: 365 }, { item: '1199', coefficient: 405 },
        { item: '1299', coefficient: 425 }, { item: '1399', coefficient: 440 }, { item: '1499', coefficient: 455 },
        { item: '1599', coefficient: 480 }, { item: '1699', coefficient: 495 }, { item: '1799', coefficient: 515 },
        { item: '1999', coefficient: 535 }, { item: '2399', coefficient: 555 }, { item: '2499', coefficient: 590 },
        { item: '2999', coefficient: 625 }, { item: '3499', coefficient: 670 }, { item: '3999', coefficient: 720 },
        { item: '4499', coefficient: 780 }, { item: '4999', coefficient: 805 }, { item: '5999', coefficient: 855 },
        { item: '6499', coefficient: 915 }, { item: '6999', coefficient: 935 }, { item: '7499', coefficient: 970 },
        { item: '7999', coefficient: 990 }, { item: '8499', coefficient: 1030 }, { item: '8999', coefficient: 1050 },
        { item: '9999', coefficient: 1050 }, { item: '10499', coefficient: 1080 }, { item: '10999', coefficient: 1080 },
        { item: '11499', coefficient: 1080 }, { item: '11999', coefficient: 1090 }, { item: '12499', coefficient: 1105 },
        { item: '14999', coefficient: 1120 }
      ],
      manheim: [
        { item: '1000', coefficient: 225 }, { item: '3000', coefficient: 280 }, { item: '5000', coefficient: 340 },
        { item: '7000', coefficient: 390 }, { item: '9000', coefficient: 425 }, { item: '11000', coefficient: 465 },
        { item: '13000', coefficient: 495 }, { item: '15000', coefficient: 525 }, { item: '17000', coefficient: 555 },
        { item: '19000', coefficient: 585 }, { item: '21000', coefficient: 610 }, { item: '23000', coefficient: 630 },
        { item: '25000', coefficient: 655 }, { item: '27000', coefficient: 685 }, { item: '30000', coefficient: 710 },
        { item: '32500', coefficient: 735 }, { item: '35000', coefficient: 760 }, { item: '37500', coefficient: 785 },
        { item: '40000', coefficient: 810 }, { item: '45000', coefficient: 835 }, { item: '50000', coefficient: 885 },
        { item: '60000', coefficient: 935 }, { item: '70000', coefficient: 1035 }, { item: '80000', coefficient: 1135 },
        { item: '90000', coefficient: 1235 }, { item: '100000', coefficient: 1335 }, { item: '110000', coefficient: 1435 },
        { item: '999999999', coefficient: 1555 }
      ]
    },
    calculatorDetails: {
      brokerPriceKlaidepa: 250,
      unloadingFromPortBrokerOdesa: 670,
      deliveryToBorderKlaidepa: 80,
      lubeAvtoFee: 600,
      unloadingFromPortKlaidepa: 400,
      deliveryToLvivKlaidepa: 800,
      specialTransportPrice: 110,
      insuranceFee: 1,
      exportDocumentsFee: { Usa: 150, 'Usa closed': 200, Canada: 350, Manheim: 250 },
      deliveryCoefficientToPort: [
        { id: 523, cityName: 'Abbotsford (electro&hybrid)', value: 1900, deliveryCoefficient: { portName: 'Montreal, CA', klaipedaValue: 1475, odesaValue: 999999 } },
        { id: 454, cityName: 'Abbotsford (GAS&DIESEL ONLY)', value: 350, deliveryCoefficient: { portName: 'VANCOUVER,CA', klaipedaValue: 2300, odesaValue: 999999 } },
        { id: 1, cityName: 'ABILENE - TX', value: 420, deliveryCoefficient: { portName: 'HOUSTON,TX', klaipedaValue: 900, odesaValue: 1400 } },
        { id: 282, cityName: 'AKRON-CANTON (OH)', value: 600, deliveryCoefficient: { portName: 'New York, NY', klaipedaValue: 750, odesaValue: 1250 } },
        { id: 2, cityName: 'ALBANY - NY', value: 325, deliveryCoefficient: { portName: 'New York, NY', klaipedaValue: 750, odesaValue: 1250 } },
        { id: 3, cityName: 'ALBUQUERQUE - NM', value: 770, deliveryCoefficient: { portName: 'HOUSTON,TX', klaipedaValue: 900, odesaValue: 1400 } },
        { id: 296, cityName: 'ACE - Carson (CA)', value: 345, deliveryCoefficient: { portName: 'LOSANGELES,CA', klaipedaValue: 1475, odesaValue: 999999 } }
      ]
    },
    selectOptions: {
      vehicleType: [
        { value: 'Automobiles', label: 'Легковий' },
        { value: 'Crossover', label: 'Кросовер' },
        { value: 'SUVs', label: 'Позашляховик' },
        { value: 'Moto', label: 'Мотоцикл' },
        { value: 'PickupTrucks', label: 'Бус / Пікап' }
      ],
      fuelType: [
        { value: 'Gas', label: 'Бензин' },
        { value: 'Diesel', label: 'Дизель' },
        { value: 'Electro', label: 'Електро' },
        { value: 'Hybrid', label: 'Гібрид' }
      ]
    }
  };

  var REQUEST_INPUT_IDS = {
    routePreset: true,
    carType: true,
    fuelType: true,
    auctionType: true,
    carYear: true,
    engineVolume: true,
    lotPrice: true,
    exportDocsType: true,
    deliveryOrigin: true,
    insuranceIncluded: true,
    transferIncluded: true
  };
  var AUTO_SYNC_IDS = {
    routePreset: true,
    auctionType: true,
    lotPrice: true,
    exportDocsType: true,
    deliveryOrigin: true,
    insuranceIncluded: true,
    transferIncluded: true
  };
  var OUTPUT_FIELD_IDS = [
    'auctionFee', 'usDelivery', 'exportDocs', 'oceanDelivery', 'portUnload', 'europeDelivery',
    'customsDelivery', 'borderHandling', 'brokerFee', 'companyFee', 'insuranceFee', 'transferFee'
  ];
  var activeReferenceData = FALLBACK_REFERENCE_DATA;
  var lastApiResult = null;
  var calcDebounceTimer = null;
  var calcRequestSeq = 0;
  var calcListenersBound = false;
  var activeComboId = null;
  var calcRequestInFlight = false;
  var REFERENCE_INIT_API_URL = 'https://api-lubeavto.azurewebsites.net/api/v0/calculator/count-pricing';
  var REFERENCE_API_URL = 'https://api-lubeavto.azurewebsites.net/api/v0/calculator/count-pricing/calculate';

  function $(id) {
    return document.getElementById(id);
  }

  function toSafeNumber(value) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function numberValue(id) {
    return toSafeNumber($(id) && $(id).value || 0);
  }

  function setNumericValue(id, value) {
    if (!$(id)) return;
    var safe = Math.round(toSafeNumber(value) * 100) / 100;
    $(id).value = String(safe);
    // Sync visible label if exists
    var labelEl = $(id + 'Label');
    if (labelEl) {
      labelEl.textContent = safe > 0 ? formatUsd(safe) : '—';
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatUsd(value) {
    return '$' + CURRENCY.format(Math.round(toSafeNumber(value)));
  }

  function setText(id, value) {
    if (!$(id)) return;
    $(id).textContent = value;
  }

  function setValue(id, value) {
    if (!$(id)) return;
    $(id).value = value;
  }

  function lockDerivedFields() {
    OUTPUT_FIELD_IDS.forEach(function (id) {
      if (!$(id)) return;
      $(id).readOnly = true;
      $(id).setAttribute('aria-readonly', 'true');
    });
  }

  function getRouteKey() {
    return String($('routePreset') && $('routePreset').value || 'klaipeda').toLowerCase();
  }

  function getFuelKey() {
    return String($('fuelType') && $('fuelType').value || 'Gas');
  }

  function getAuctionKey() {
    return String($('auctionType') && $('auctionType').value || 'Copart');
  }

  function getExportDocsKey() {
    return String($('exportDocsType') && $('exportDocsType').value || 'Usa');
  }

  function getVehicleType() {
    return String($('carType') && $('carType').value || 'Automobiles');
  }

  function getReferenceOrigins(reference) {
    return (reference && reference.calculatorDetails && reference.calculatorDetails.deliveryCoefficientToPort) || FALLBACK_REFERENCE_DATA.calculatorDetails.deliveryCoefficientToPort;
  }

  function populateSelect(selectId, options, getValue, getLabel) {
    var select = $(selectId);
    if (!select || !Array.isArray(options) || !options.length) return;
    var currentValue = select.value;
    var placeholderHtml = selectId === 'deliveryOrigin' ? '<option value="" disabled>Оберіть місто відправки</option>' : '';
    select.innerHTML = placeholderHtml + options.map(function (item) {
      return '<option value="' + escapeHtml(getValue(item)) + '">' + escapeHtml(getLabel(item)) + '</option>';
    }).join('');

    if (currentValue) {
      select.value = currentValue;
    }

    if (!select.value && selectId === 'deliveryOrigin') {
      select.value = String(getValue(options[0]));
    }
  }

  function updateSourceBadge(reference, mode) {
    var badge = $('referenceSourceBadge');
    if (!badge) return;
    badge.textContent = '';
    badge.hidden = true;
  }

  function getComboValues(id) {
    if (id === 'carYear') {
      var years = [];
      for (var year = CURRENT_YEAR; year >= 2009; year -= 1) {
        years.push({ value: String(year), label: String(year) });
      }
      years.push({ value: '2008', label: '2008 і старше' });
      return years;
    }

    if (id === 'engineVolume') {
      if (getFuelKey() === 'Electro') {
        return ['24', '30', '40', '50', '60', '75', '82', '95', '100', '120', '150', '200'].map(function (value) {
          return { value: value, label: value };
        });
      }
      var values = [];
      for (var volume = 0.1; volume <= 10.0001; volume += 0.1) {
        var normalized = (Math.round(volume * 10) / 10).toFixed(1);
        values.push({ value: normalized, label: normalized });
      }
      return values;
    }

    return [];
  }

  function renderComboMenu(id, query) {
    var menu = $(id + 'Menu');
    if (!menu) return;

    var filter = String(query || '').trim().toLowerCase();
    var options = getComboValues(id).filter(function (item) {
      return !filter || String(item.label).toLowerCase().indexOf(filter) !== -1 || String(item.value).toLowerCase().indexOf(filter) !== -1;
    });

    menu.innerHTML = options.map(function (item) {
      return '<button type="button" class="calc-combo-option" data-combo-value="' + escapeHtml(item.value) + '">' + escapeHtml(item.label) + '</button>';
    }).join('');
  }

  function closeComboMenus() {
    ['carYear', 'engineVolume'].forEach(function (id) {
      var menu = $(id + 'Menu');
      if (menu) menu.hidden = true;
    });
    activeComboId = null;
  }

  function openComboMenu(id) {
    var menu = $(id + 'Menu');
    if (!menu) return;
    closeComboMenus();
    renderComboMenu(id, $(id) && $(id).value || '');
    menu.hidden = false;
    activeComboId = id;
  }

  function updateFieldSuggestions() {
    if (activeComboId) {
      renderComboMenu(activeComboId, $(activeComboId) && $(activeComboId).value || '');
    }
  }

  function bindCustomComboboxes() {
    ['carYear', 'engineVolume'].forEach(function (id) {
      var input = $(id);
      var menu = $(id + 'Menu');
      if (!input || !menu || input.__comboBound) return;
      input.__comboBound = true;

      input.addEventListener('focus', function () {
        openComboMenu(id);
      });

      input.addEventListener('click', function () {
        openComboMenu(id);
      });

      input.addEventListener('input', function () {
        normalizeFieldValue(id);
        openComboMenu(id);
      });

      input.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          openComboMenu(id);
        }
        if (event.key === 'Escape') {
          closeComboMenus();
        }
      });

      menu.addEventListener('mousedown', function (event) {
        var option = event.target && event.target.closest ? event.target.closest('.calc-combo-option') : null;
        if (!option) return;
        event.preventDefault();
        input.value = option.getAttribute('data-combo-value') || '';
        normalizeFieldValue(id, true);
        closeComboMenus();
        if (AUTO_SYNC_IDS[id]) syncReferenceFields();
        if (hasRequiredInputs()) {
          scheduleAccurateCalculation();
        } else {
          renderIdleState();
        }
      });
    });

    if (typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('[data-combo-target]').forEach(function (button) {
        if (button.__comboBound) return;
        button.__comboBound = true;
        button.addEventListener('click', function (event) {
          event.preventDefault();
          var target = this.getAttribute('data-combo-target');
          if (activeComboId === target) {
            closeComboMenus();
            return;
          }
          openComboMenu(target);
        });
      });
    }

    document.addEventListener('click', function (event) {
      if (!event.target || !event.target.closest || !event.target.closest('.calc-combo')) {
        closeComboMenus();
      }
    });
  }

  function updateEngineFieldState() {
    var label = document.querySelector('label[for="engineVolume"]');
    var hint = $('engineHelpText');
    var input = $('engineVolume');
    var isElectro = getFuelKey() === 'Electro';
    if (label) {
      label.textContent = isElectro ? 'Ємність батареї (кВт⋅год)' : "Об'єм двигуна (л)";
    }
    if (hint) {
      hint.textContent = isElectro
        ? 'Оберіть популярне значення або введіть ємність батареї вручну.'
        : 'Оберіть популярне значення або введіть точний обʼєм від 0.1 до 10.0 л.';
    }
    if (input) {
      input.step = isElectro ? '1' : '0.1';
      input.max = isElectro ? '250' : '10';
      input.placeholder = isElectro ? '60' : '0.1 - 10.0';
      input.inputMode = isElectro ? 'numeric' : 'decimal';
    }
    updateFieldSuggestions();
  }

  function normalizeFieldValue(id, finalize) {
    var input = $(id);
    if (!input) return;

    if (id === 'carYear') {
      input.value = String(input.value || '').replace(/[^0-9]/g, '').slice(0, 4);
      if (finalize && input.value) {
        var yearValue = Number(input.value);
        if (Number.isFinite(yearValue)) {
          yearValue = Math.min(CURRENT_YEAR, Math.max(2008, yearValue));
          input.value = String(yearValue);
        }
      }
      return;
    }

    if (id === 'engineVolume') {
      var normalized = String(input.value || '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
      var parts = normalized.split('.');
      if (parts.length > 2) {
        normalized = parts.shift() + '.' + parts.join('');
      }

      if (finalize && normalized && !normalized.endsWith('.')) {
        var numericValue = Number(normalized);
        if (Number.isFinite(numericValue)) {
          if (getFuelKey() === 'Electro') {
            normalized = String(Math.max(1, Math.round(numericValue)));
          } else {
            numericValue = Math.min(10, Math.max(0.1, numericValue));
            normalized = numericValue.toFixed(1);
          }
        }
      }

      input.value = normalized;
    }
  }

  function getAuctionTable(reference, auctionKey) {
    var coeffs = (reference && reference.coefficients) || {};
    return coeffs[String(auctionKey || '').toLowerCase()] || coeffs.copart || [];
  }

  function getAuctionEntry(auctionKey, price, reference) {
    var table = getAuctionTable(reference, auctionKey);
    var amount = toSafeNumber(price);
    if (!table.length) return null;
    for (var i = 0; i < table.length; i += 1) {
      if (amount <= toSafeNumber(table[i].item)) {
        return table[i];
      }
    }
    return table[table.length - 1] || null;
  }

  function getAuctionFee(auctionKey, price, reference) {
    var entry = getAuctionEntry(auctionKey, price, reference);
    return entry ? toSafeNumber(entry.coefficient) : 0;
  }

  function getSelectedOrigin(reference) {
    var origins = getReferenceOrigins(reference);
    var selectedId = String($('deliveryOrigin') && $('deliveryOrigin').value || '');
    for (var i = 0; i < origins.length; i += 1) {
      if (String(origins[i].id) === selectedId) return origins[i];
    }
    return origins[0] || null;
  }

  function guessPortKeyByName(portName) {
    var key = String(portName || '').trim().toLowerCase();
    var map = {
      'houston,tx': 'houston_tx',
      'new york, ny': 'elizabeth_nj',
      'losangeles,ca': 'losangeles_ca',
      'chicago,il': 'chicago_il',
      'savannah,ga': 'savannah_ga',
      'florida, fl': 'florida_fl',
      'montreal, ca': 'monreal_CA',
      'vancouver,ca': 'vancouver_cad',
      'oakland, ca': 'oakland_ca'
    };
    return map[key] || '';
  }

  function normalizeDeliveryOrigin(origin) {
    if (!origin || typeof origin !== 'object') return null;

    var normalized = Object.assign({}, origin);
    var deliveryCoefficient = Object.assign({}, origin.deliveryCoefficient || {});

    if (!deliveryCoefficient.portKey) {
      var guessed = guessPortKeyByName(deliveryCoefficient.portName);
      if (guessed) {
        deliveryCoefficient.portKey = guessed;
      }
    }

    normalized.deliveryCoefficient = deliveryCoefficient;
    return normalized;
  }

  function getExportDocsFee(reference) {
    var key = getExportDocsKey();
    var map = (reference && reference.calculatorDetails && reference.calculatorDetails.exportDocumentsFee) || FALLBACK_REFERENCE_DATA.calculatorDetails.exportDocumentsFee;
    return toSafeNumber(map[key]);
  }

  function calculateTransferFee(price, auctionFee) {
    var checkbox = $('transferIncluded');
    if (checkbox && !checkbox.checked) return 0;
    var docsKey = getExportDocsKey();
    var rate = (docsKey === 'Canada' || docsKey === 'Manheim') ? 0.02 : 0.01;
    return Math.max(1, Math.round((toSafeNumber(price) + toSafeNumber(auctionFee)) * rate));
  }

  function calculateInsuranceFee(reference) {
    var checkbox = $('insuranceIncluded');
    var include = !checkbox || checkbox.checked;
    var baseFee = toSafeNumber(reference && reference.calculatorDetails && reference.calculatorDetails.insuranceFee) || 1;
    return include ? baseFee : 0;
  }

  function getVehicleCoefficientEntry(reference) {
    var list = reference && reference.coefficients && reference.coefficients.vehicle || FALLBACK_REFERENCE_DATA.coefficients.vehicle;
    var vehicleType = getVehicleType();
    for (var i = 0; i < list.length; i += 1) {
      if (String(list[i].item) === vehicleType) return list[i];
    }
    return list[0] || null;
  }

  function buildCalculatorPayload(reference) {
    var fuelType = getFuelKey();
    var isElectro = fuelType === 'Electro';
    var isMoto = getVehicleType() === 'Moto';
    var engineValue = numberValue('engineVolume');
    var year = numberValue('carYear');
    var price = numberValue('lotPrice');
    var origin = normalizeDeliveryOrigin(getSelectedOrigin(reference));

    return {
      price: price,
      vehicleType: getVehicleType(),
      fuelType: fuelType && fuelType.length ? fuelType : undefined,
      releaseYear: isElectro ? undefined : (year > 0 ? year : undefined),
      engineSize: isElectro ? undefined : (isMoto ? Math.max(0, engineValue * 1000) : (engineValue > 0 ? engineValue : undefined)),
      batteryCapacity: isElectro ? Math.max(0, engineValue) : 0,
      auction: getAuctionKey(),
      isKlaipeda: getRouteKey() !== 'odesa',
      vehicleCoefficients: getVehicleCoefficientEntry(reference),
      auctionCoefficients: getAuctionEntry(getAuctionKey(), price, reference),
      exportDocumentFee: {
        key: getExportDocsKey(),
        value: getExportDocsFee(reference)
      },
      deliveryCoefficientToPort: origin
    };
  }

  function renderFromApiResult(result) {
    if (!result) return;

    calcRequestInFlight = false;
    lastApiResult = result;
    updateSourceBadge(activeReferenceData, 'live');

    var route = getRouteKey();
    var origin = result.deliveryCoefficientToPort || getSelectedOrigin(activeReferenceData);
    var portName = origin && origin.deliveryCoefficient ? origin.deliveryCoefficient.portName : '—';
    var oceanDelivery = route === 'odesa'
      ? toSafeNumber(origin && origin.deliveryCoefficient && origin.deliveryCoefficient.odesaValue)
      : toSafeNumber(origin && origin.deliveryCoefficient && origin.deliveryCoefficient.klaipedaValue);

    if (oceanDelivery >= 999999) oceanDelivery = 0;

    var values = {
      lotPrice: numberValue('lotPrice'),
      auctionFee: toSafeNumber(result.auctionCoefficients && result.auctionCoefficients.coefficient),
      usDelivery: toSafeNumber(origin && origin.value),
      exportDocs: toSafeNumber(result.exportDocumentsFee),
      oceanDelivery: oceanDelivery,
      portUnload: route === 'odesa' ? toSafeNumber(result.unloadingFromPortBrokerOdesa) : toSafeNumber(result.unloadingFromPortKlaidepa),
      europeDelivery: route === 'odesa' ? 0 : toSafeNumber(result.deliveryToLvivKlaidepa),
      customsDelivery: route === 'odesa' ? 0 : toSafeNumber(result.deliveryToBorderKlaidepa),
      borderHandling: toSafeNumber(result.specialTransportPrice),
      brokerFee: route === 'odesa' ? 0 : toSafeNumber(result.brokerPriceKlaidepa),
      companyFee: toSafeNumber(result.lubeAvtoFee),
      insuranceFee: ($('insuranceIncluded') && !$('insuranceIncluded').checked) ? 0 : toSafeNumber(result.insuranceFee),
      transferFee: calculateTransferFee(numberValue('lotPrice'), toSafeNumber(result.auctionCoefficients && result.auctionCoefficients.coefficient)),
      excise: toSafeNumber(result.excise),
      importDuty: toSafeNumber(result.toll),
      vat: toSafeNumber(result.vat),
      nonVatFee: toSafeNumber(result.nonVatFee)
    };

    setNumericValue('auctionFee', values.auctionFee);
    setNumericValue('usDelivery', values.usDelivery);
    setNumericValue('exportDocs', values.exportDocs);
    setNumericValue('oceanDelivery', values.oceanDelivery);
    setNumericValue('portUnload', values.portUnload);
    setNumericValue('europeDelivery', values.europeDelivery);
    setNumericValue('customsDelivery', values.customsDelivery);
    setNumericValue('borderHandling', values.borderHandling);
    setNumericValue('brokerFee', values.brokerFee);
    setNumericValue('companyFee', values.companyFee);
    setNumericValue('insuranceFee', values.insuranceFee);
    setNumericValue('transferFee', values.transferFee);

    var carBlock = values.lotPrice + values.auctionFee;
    var logisticsBlock = values.usDelivery + values.exportDocs + values.oceanDelivery + values.portUnload + values.europeDelivery + values.customsDelivery + values.borderHandling;
    var customsBlock = values.excise + values.importDuty + values.vat + values.nonVatFee;
    var serviceBlock = values.brokerFee + values.companyFee + values.insuranceFee + values.transferFee;
    var total = carBlock + logisticsBlock + customsBlock + serviceBlock;

    if ($('grandTotal')) $('grandTotal').textContent = formatUsd(total);
    setText('calcTotalCaption', 'Підсумкова сума вже враховує логістику, митницю та сервісні витрати.');

    renderBreakdown(buildRows(values, {
      route: route,
      auctionLabel: getAuctionKey(),
      originLabel: origin ? origin.cityName : '—',
      portLabel: portName
    }), total);
  }

  function renderPendingState() {
    calcRequestInFlight = true;
    updateSourceBadge(activeReferenceData, 'loading');
    setText('grandTotal', '...');
    setText('calcTotalCaption', 'Підсумок оновлюється після відповіді API-движка.');

    if ($('breakdownPrimary')) {
      $('breakdownPrimary').innerHTML = '<div class="calc-row"><span>Готуємо payload та очікуємо відповідь API</span><strong>...</strong></div>';
    }
    if ($('breakdownSecondary')) {
      $('breakdownSecondary').innerHTML = '<div class="calc-row"><span>Точний розрахунок оновиться автоматично</span><strong>...</strong></div>';
    }
    if ($('breakdownList')) {
      $('breakdownList').innerHTML = '';
    }
  }

  function renderApiUnavailableState() {
    calcRequestInFlight = false;
    lastApiResult = null;
    updateSourceBadge(activeReferenceData, 'fallback');
    setText('grandTotal', '—');
    setText('calcTotalCaption', 'Точний підсумок зараз не отримано. Для ручного прорахунку перейдіть у контакти.');

    if ($('breakdownPrimary')) {
      $('breakdownPrimary').innerHTML = '<div class="calc-row"><span>API-розрахунок тимчасово недоступний</span><strong>—</strong></div>';
    }
    if ($('breakdownSecondary')) {
      $('breakdownSecondary').innerHTML = '<div class="calc-row"><span>Спробуйте ще раз або зверніться до менеджера за точним прорахунком</span><strong>—</strong></div>';
    }
    if ($('breakdownList')) {
      $('breakdownList').innerHTML = '';
    }
  }

  function renderIdleState() {
    calcRequestInFlight = false;
    lastApiResult = null;
    updateSourceBadge(activeReferenceData, 'idle');
    setText('grandTotal', '$0');
    setText('calcTotalCaption', 'Поки що калькулятор у нейтральному стані. Жодних випадкових сум до введення ваших даних.');

    if ($('breakdownPrimary')) {
      $('breakdownPrimary').innerHTML = '';
    }
    if ($('breakdownSecondary')) {
      $('breakdownSecondary').innerHTML = '<div class="calc-row"><span>Митниця та сервіс зʼявляться після заповнення основних полів</span><strong>$0</strong></div>';
    }
    if ($('breakdownList')) {
      $('breakdownList').innerHTML = '';
    }
  }

  function resetDerivedOutputs() {
    OUTPUT_FIELD_IDS.forEach(function (id) {
      setValue(id, '0');
    });
  }

  function hasRequiredInputs() {
    var year = numberValue('carYear');
    var engineValue = numberValue('engineVolume');
    var price = numberValue('lotPrice');
    return year >= 2008 && year <= CURRENT_YEAR && engineValue > 0 && price > 0;
  }

  function requestAccurateCalculation() {
    var reference = activeReferenceData || FALLBACK_REFERENCE_DATA;
    var payload = buildCalculatorPayload(reference);
    var requestId = ++calcRequestSeq;

    if (!hasRequiredInputs()) {
      renderIdleState();
      return Promise.resolve(null);
    }

    if (!payload.deliveryCoefficientToPort) {
      return Promise.resolve(null);
    }

    renderPendingState();

    return fetch(REFERENCE_API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json-patch+json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('reference-api-' + response.status);
        return response.json();
      })
      .then(function (result) {
        if (requestId !== calcRequestSeq) return result;
        renderFromApiResult(result);
        return result;
      })
      .catch(function () {
        if (requestId !== calcRequestSeq) return null;
        renderApiUnavailableState();
        return null;
      });
  }

  function scheduleAccurateCalculation() {
    if (calcDebounceTimer) clearTimeout(calcDebounceTimer);
    calcDebounceTimer = setTimeout(function () {
      requestAccurateCalculation();
    }, 220);
  }

  function populateReferenceOptions(reference) {
    var origins = getReferenceOrigins(reference);
    if (origins.length) {
      populateSelect('deliveryOrigin', origins, function (item) { return item.id; }, function (item) { return item.cityName; });
    }
  }

  function setDefaultsFromReference(reference) {
    var defaults = reference && reference.defaultValues || {};
    if ($('routePreset')) $('routePreset').value = String(defaults.deliveryPort || 'Klaipeda').toLowerCase() === 'odesa' ? 'odesa' : 'klaipeda';
    if ($('carType')) $('carType').value = defaults.vehicleType || 'Automobiles';
    if ($('fuelType')) $('fuelType').value = defaults.fuelType || 'Gas';
    if ($('auctionType')) $('auctionType').value = defaults.auction || 'Copart';
    if ($('exportDocsType')) $('exportDocsType').value = defaults.exportDocumentFee || 'Usa';
    if ($('deliveryOrigin')) {
      var origins = getReferenceOrigins(reference);
      $('deliveryOrigin').value = origins.length ? String(origins[0].id) : '';
    }
    if ($('carYear')) $('carYear').value = '';
    if ($('engineVolume')) $('engineVolume').value = '';
    if ($('lotPrice')) $('lotPrice').value = '';
    if ($('insuranceIncluded')) $('insuranceIncluded').checked = true;
    if ($('transferIncluded')) $('transferIncluded').checked = true;
    updateEngineFieldState();
  }

  function syncReferenceFields() {
    var reference = activeReferenceData || FALLBACK_REFERENCE_DATA;
    var ref = reference.calculatorDetails || FALLBACK_REFERENCE_DATA.calculatorDetails;
    var lotPrice = numberValue('lotPrice');
    var route = getRouteKey();
    var auctionFee = getAuctionFee(getAuctionKey(), lotPrice, reference);
    var origin = getSelectedOrigin(reference);
    var oceanDelivery = 0;
    var usDelivery = 0;
    var portName = '—';

    if (!hasRequiredInputs()) {
      resetDerivedOutputs();
      return;
    }

    if (origin) {
      usDelivery = toSafeNumber(origin.value);
      portName = origin.deliveryCoefficient && origin.deliveryCoefficient.portName || '—';
      if (route === 'odesa') {
        oceanDelivery = toSafeNumber(origin.deliveryCoefficient && origin.deliveryCoefficient.odesaValue);
      } else {
        oceanDelivery = toSafeNumber(origin.deliveryCoefficient && origin.deliveryCoefficient.klaipedaValue);
      }
      if (oceanDelivery >= 999999) oceanDelivery = 0;
    }

    setNumericValue('auctionFee', auctionFee);
    setNumericValue('usDelivery', usDelivery);
    setNumericValue('exportDocs', getExportDocsFee(reference));
    setNumericValue('oceanDelivery', oceanDelivery);

    if (route === 'odesa') {
      setNumericValue('portUnload', toSafeNumber(ref.unloadingFromPortBrokerOdesa) || 670);
      setNumericValue('europeDelivery', 0);
      setNumericValue('customsDelivery', 0);
      setNumericValue('borderHandling', toSafeNumber(ref.specialTransportPrice) || 110);
      setNumericValue('brokerFee', 0);
    } else {
      setNumericValue('portUnload', toSafeNumber(ref.unloadingFromPortKlaidepa) || 400);
      setNumericValue('europeDelivery', toSafeNumber(ref.deliveryToLvivKlaidepa) || 800);
      setNumericValue('customsDelivery', toSafeNumber(ref.deliveryToBorderKlaidepa) || 80);
      setNumericValue('borderHandling', toSafeNumber(ref.specialTransportPrice) || 110);
      setNumericValue('brokerFee', toSafeNumber(ref.brokerPriceKlaidepa) || 250);
    }

    setNumericValue('companyFee', toSafeNumber(ref.lubeAvtoFee) || 600);
    setNumericValue('insuranceFee', calculateInsuranceFee(reference));
    setNumericValue('transferFee', calculateTransferFee(lotPrice, auctionFee));

  }

  function buildRows(values, context) {
    var rows = [
      ['Вартість авто / ставка', values.lotPrice],
      ['Аукціонний збір (' + context.auctionLabel + ')', values.auctionFee],
      ['Доставка по США — ' + context.originLabel, values.usDelivery],
      ['Документи на експорт авто', values.exportDocs],
      ['Доставка з США - ' + context.portLabel, values.oceanDelivery],
      [context.route === 'odesa' ? 'Вигрузка з порту Одеса + брокер' : 'Вигрузка з порту Клайпеда', values.portUnload]
    ];

    if (context.route !== 'odesa') {
      rows.push(['Доставка Клайпеда - Варшава', values.europeDelivery]);
      rows.push(['Доставка на митницю', values.customsDelivery]);
    }

    rows.push(['Проходження кордону та залучення спец. транспорту', values.borderHandling]);
    rows.push(['Акциз', values.excise]);
    rows.push(['Ввізне мито', values.importDuty]);
    rows.push(['ПДВ', values.vat]);

    if (values.nonVatFee > 0) {
      rows.push(['Фінансовий збір за не сплату ПДВ', values.nonVatFee]);
    }
    if (values.brokerFee > 0) {
      rows.push(['Брокерські послуги', values.brokerFee]);
    }

    rows.push(['Комісія BIDDER', values.companyFee]);

    if (values.insuranceFee > 0) {
      rows.push(['Страхування', values.insuranceFee]);
    }
    if (values.transferFee > 0) {
      rows.push(['Комісія за переказ коштів в США', values.transferFee]);
    }

    return rows;
  }

  function buildRowsHtml(rows) {
    return rows.map(function (row) {
      return '<div class="calc-row"><span>' + escapeHtml(row[0]) + '</span><strong>' + formatUsd(row[1]) + '</strong></div>';
    }).join('');
  }

  function renderBreakdown(rows, total) {
    var primaryHost = $('breakdownPrimary');
    var secondaryHost = $('breakdownSecondary');
    var legacyHost = $('breakdownList');
    var splitIndex = rows.findIndex(function (row) {
      return /Акциз|Ввізне мито|ПДВ/i.test(String(row[0] || ''));
    });

    if (splitIndex === -1) splitIndex = Math.ceil(rows.length / 2);

    var primaryRows = rows.slice(0, splitIndex);
    var secondaryRows = rows.slice(splitIndex);

    if (primaryHost) {
      primaryHost.innerHTML = buildRowsHtml(primaryRows);
    }
    if (secondaryHost) {
      secondaryHost.innerHTML = buildRowsHtml(secondaryRows);
    }
    if (legacyHost) {
      legacyHost.innerHTML = buildRowsHtml(rows) + '<div class="calc-row total"><span>Всього ціна з доставкою</span><strong>' + formatUsd(total) + '</strong></div>';
    }
  }

  function resetToReference() {
    setDefaultsFromReference(activeReferenceData || FALLBACK_REFERENCE_DATA);
    syncReferenceFields();
    renderIdleState();
  }

  function loadReferenceData() {
    function mapInitialDataToReference(initialData) {
      if (!initialData || typeof initialData !== 'object') return null;

      var deliveryCoefficientToPort = Array.isArray(initialData.deliveryCoefficientToPort)
        ? initialData.deliveryCoefficientToPort.map(normalizeDeliveryOrigin)
        : [];

      if (!deliveryCoefficientToPort.length) return null;

      return {
        generatedAt: new Date().toISOString().slice(0, 10),
        source: REFERENCE_INIT_API_URL,
        coefficients: {
          vehicle: Array.isArray(initialData.vehicleCoefficients) ? initialData.vehicleCoefficients : [],
          copart: Array.isArray(initialData.copartCoefficients) ? initialData.copartCoefficients : [],
          iaai: Array.isArray(initialData.iaaiCoefficients) ? initialData.iaaiCoefficients : [],
          manheim: Array.isArray(initialData.manheimCoefficients) ? initialData.manheimCoefficients : []
        },
        calculatorDetails: {
          brokerPriceKlaidepa: toSafeNumber(initialData.brokerPriceKlaidepa),
          unloadingFromPortBrokerOdesa: toSafeNumber(initialData.unloadingFromPortBrokerOdesa),
          deliveryToBorderKlaidepa: toSafeNumber(initialData.deliveryToBorderKlaidepa),
          lubeAvtoFee: toSafeNumber(initialData.lubeAvtoFee),
          unloadingFromPortKlaidepa: toSafeNumber(initialData.unloadingFromPortKlaidepa),
          deliveryToLvivKlaidepa: toSafeNumber(initialData.deliveryToLvivKlaidepa),
          specialTransportPrice: toSafeNumber(initialData.specialTransportPrice),
          insuranceFee: 1,
          exportDocumentsFee: (initialData.exportDocumentsFee && typeof initialData.exportDocumentsFee === 'object')
            ? initialData.exportDocumentsFee
            : FALLBACK_REFERENCE_DATA.calculatorDetails.exportDocumentsFee,
          deliveryCoefficientToPort: deliveryCoefficientToPort
        },
        selectOptions: FALLBACK_REFERENCE_DATA.selectOptions
      };
    }

    function loadLocalReference() {
      return fetch('data/calculator-reference-data.json', { cache: 'no-cache' })
        .then(function (response) {
          if (!response.ok) throw new Error('reference-data unavailable');
          return response.json();
        })
        .then(function (data) {
          if (!data || typeof data !== 'object') return FALLBACK_REFERENCE_DATA;
          if (data.calculatorDetails && Array.isArray(data.calculatorDetails.deliveryCoefficientToPort)) {
            data.calculatorDetails.deliveryCoefficientToPort = data.calculatorDetails.deliveryCoefficientToPort.map(normalizeDeliveryOrigin);
          }
          return data;
        })
        .catch(function () {
          return FALLBACK_REFERENCE_DATA;
        });
    }

    return fetch(REFERENCE_INIT_API_URL, { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('reference-init unavailable');
        return response.json();
      })
      .then(function (initialData) {
        var mapped = mapInitialDataToReference(initialData);
        if (!mapped) throw new Error('reference-init malformed');
        return mapped;
      })
      .catch(function () {
        return loadLocalReference();
      });
  }

  function bindCalculatorEvents() {
    if (calcListenersBound) return;
    calcListenersBound = true;

    Object.keys(REQUEST_INPUT_IDS).forEach(function (id) {
      if (!$(id)) return;

      $(id).addEventListener('change', function () {
        normalizeFieldValue(id, true);
        if (id === 'fuelType') updateEngineFieldState();
        if (AUTO_SYNC_IDS[id]) syncReferenceFields();
        if (hasRequiredInputs()) {
          scheduleAccurateCalculation();
        } else {
          renderIdleState();
        }
      });

      $(id).addEventListener('input', function () {
        normalizeFieldValue(id, false);
        if (id === 'fuelType') updateEngineFieldState();
        if (AUTO_SYNC_IDS[id]) syncReferenceFields();
        if (hasRequiredInputs()) {
          scheduleAccurateCalculation();
        } else {
          renderIdleState();
        }
      });
    });

    if ($('recalculateBtn')) {
      $('recalculateBtn').addEventListener('click', function () {
        syncReferenceFields();
        requestAccurateCalculation();
        if (window.BIDDERAnalytics && typeof window.BIDDERAnalytics.push === 'function') {
          window.BIDDERAnalytics.push({
            event: 'cta_click',
            cta_label: 'calculator_recalculate',
            cta_location: 'calculator_page'
          });
        }
      });
    }

    if ($('resetPresetBtn')) $('resetPresetBtn').addEventListener('click', resetToReference);
  }

  function initializeCalculator() {
    activeReferenceData = FALLBACK_REFERENCE_DATA;
    lockDerivedFields();
    populateReferenceOptions(activeReferenceData);
    setDefaultsFromReference(activeReferenceData);
    updateFieldSuggestions();
    updateSourceBadge(activeReferenceData);
    syncReferenceFields();
    renderIdleState();
    bindCustomComboboxes();
    bindCalculatorEvents();

    loadReferenceData().then(function (referenceData) {
      activeReferenceData = referenceData || FALLBACK_REFERENCE_DATA;
      populateReferenceOptions(activeReferenceData);
      updateSourceBadge(activeReferenceData);
      syncReferenceFields();
      renderIdleState();
      applyUrlPrefill();
    });
  }

  function applyUrlPrefill() {
    var params = new URLSearchParams(window.location.search);
    var fieldMap = {
      route: 'routePreset',
      type: 'carType',
      fuel: 'fuelType',
      year: 'carYear',
      engine: 'engineVolume',
      price: 'lotPrice',
      auction: 'auctionType',
      docs: 'exportDocsType',
      origin: 'deliveryOrigin'
    };

    Object.keys(fieldMap).forEach(function (key) {
      var value = params.get(key);
      var field = $(fieldMap[key]);
      if (!value || !field) return;
      field.value = value;
    });

    updateEngineFieldState();
    syncReferenceFields();
    if (hasRequiredInputs()) {
      requestAccurateCalculation();
    } else {
      renderIdleState();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCalculator);
  } else {
    initializeCalculator();
  }
})();
