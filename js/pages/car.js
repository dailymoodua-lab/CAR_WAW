    /* ════════════════════════════════════════════════
       CAR DATA
    ════════════════════════════════════════════════ */
    const CARS = [
      {
        id: 1,
        title: '2021 BMW 7 Series, 750i xDrive',
        lot: '44145868', vin: 'WBA7U2C03MCE90660',
        auction: 'IAAI', badge: 'NEW',
        location: 'Northern Virginia (VA)', origin: 'Newark (NJ)',
        distance: '354 mil (220 km)',
        delivery: '18 квітня — 2 травня',
        seller: 'Mercury Insurance', sellerOk: true,
        docs: 'Salvage (Virginia)', docsOk: true,
        damage1: 'Передня частина', damage2: 'Загалом по всьому',
        odometer: '64,145 миль (103,239 km)',
        key: 'Присутній',
        startCode: 'На ходу', startOk: true,
        acv: '$19,850 / $0 USD',
        body: 'Sedan', bodyExt: 'Sedan / 4-door',
        color: 'Чорний',
        engine: '4.4L V8', engineHp: '523 HP',
        transmission: 'Автоматичний',
        fuel: 'Бензиновий',
        drive: 'AWD',
        platformModel: '750i xDrive',
        platformEngine: '4.4L V8',
        platformDrive: 'AWD',
        platformTransmission: 'Автоматичний',
        saleStatus: 'На підтвердженні',
        currentBid: 8600, estimate: [19850, 27010],
        endDate: '2 травня, 15:30',
        endTimestamp: Date.now() + 6 * 24 * 3600000 + 20 * 3600000 + 25 * 60000,
        folder: '66866605_HD_images', prefix: '66866605', count: 12,
        specs: ['AWD', '4.4L', '8 цил.', '523HP'],
        brand: 'BMW'
      },
      {
        id: 2,
        title: '2019 BMW 7 Series, 750 Li',
        lot: '85875885', vin: 'WBA7F2C58KB240823',
        auction: 'Copart', badge: 'NEW',
        location: 'North Charlotte (SC)', origin: 'New York (NY)',
        distance: '420 mil (676 km)',
        delivery: '25 квітня — 9 травня',
        seller: 'ST (South Carolina)', sellerOk: true,
        docs: 'Salvage (NY)', docsOk: true,
        damage1: 'Задня частина', damage2: 'Незначні',
        odometer: '58,000 миль (93,342 km)',
        key: 'Присутній',
        startCode: 'На ходу', startOk: true,
        acv: '$10,100 / $0 USD',
        body: 'Sedan', bodyExt: 'Sedan / 4-door Long Wheelbase',
        color: 'Синій',
        engine: '4.4L V8', engineHp: '445 HP',
        transmission: 'Автоматичний',
        fuel: 'Бензиновий',
        drive: 'AWD',
        platformModel: '750Li', platformEngine: '4.4L V8',
        platformDrive: 'AWD', platformTransmission: 'Автоматичний',
        saleStatus: 'В процесі',
        currentBid: 6400, estimate: [10100, 15750],
        endDate: '9 травня, 16:00',
        endTimestamp: Date.now() + 13 * 24 * 3600000 + 55 * 60000,
        folder: '74449905_HD_images', prefix: '74449905', count: 12,
        specs: ['AWD', '4.4L', '8 цил.', '445HP'],
        brand: 'BMW'
      },
      {
        id: 3,
        title: '2017 BMW 7 Series, 750 i',
        lot: '90692325', vin: 'WBA7F0C57HGM21279',
        auction: 'Copart', badge: null,
        location: 'Fairburn (GA)', origin: 'Savannah (GA)',
        distance: '182 mil (293 km)',
        delivery: 'Завершено',
        seller: 'CT (North Carolina)', sellerOk: true,
        docs: 'Немає даних', docsOk: false,
        damage1: 'Механічний', damage2: 'Немає',
        odometer: '123,000 миль (197,950 km)',
        key: 'Відсутній',
        startCode: 'Не заводиться', startOk: false,
        acv: '$5,450 / $0 USD',
        body: 'Sedan', bodyExt: 'Sedan / 4-door',
        color: 'Білий',
        engine: '4.4L V8', engineHp: '448 HP',
        transmission: 'Автоматичний',
        fuel: 'Бензиновий',
        drive: 'RWD',
        platformModel: '750i', platformEngine: '4.4L V8',
        platformDrive: 'RWD', platformTransmission: 'Автоматичний',
        saleStatus: 'Завершено',
        currentBid: 7600, estimate: [5450, 7600],
        endDate: 'Завершено',
        endTimestamp: Date.now() - 3600000,
        folder: '78907055_HD_images', prefix: '78907055', count: 12,
        specs: ['RWD', '4.4L', '8 цил.', '448HP'],
        brand: 'BMW'
      },
      {
        id: 4,
        title: '2016 BMW 7 Series, 750i xDrive',
        lot: '44174461', vin: 'WBA7F2C53GG421094',
        auction: 'IAAI', badge: 'NEW',
        location: 'Dundalk (MD)', origin: 'Baltimore (MD)',
        distance: '12 mil (19 km)',
        delivery: '20 квітня — 4 травня',
        seller: 'Progressive Casualty', sellerOk: true,
        docs: 'Salvage >75% (MD)', docsOk: true,
        damage1: 'Інший / Розрушений', damage2: 'Незначні',
        odometer: '68,000 миль (109,435 km)',
        key: 'Присутній',
        startCode: 'На ходу', startOk: true,
        acv: '$5,900 / $0 USD',
        body: 'Sedan', bodyExt: 'Sedan / 4-door',
        color: 'Сірий',
        engine: '4.4L V8', engineHp: '445 HP',
        transmission: 'Автоматичний',
        fuel: 'Бензиновий',
        drive: 'AWD',
        platformModel: '750i xDrive', platformEngine: '4.4L V8',
        platformDrive: 'AWD', platformTransmission: 'Автоматичний',
        saleStatus: 'На підтвердженні',
        currentBid: 25, estimate: [5900, 9780],
        endDate: '4 травня, 15:30',
        endTimestamp: Date.now() + 8 * 24 * 3600000 + 22 * 60000,
        folder: '79270765_HD_images', prefix: '79270765', count: 12,
        specs: ['AWD', '4.4L', '8 цил.', '445HP'],
        brand: 'BMW'
      },
      {
        id: 5,
        title: '2018 BMW 7 Series, 740 XI',
        lot: '78456875', vin: 'WBA7E4C54JG023896',
        auction: 'Copart', badge: null,
        location: 'Detroit (MI)', origin: 'Chicago (IL)',
        distance: '280 mil (450 km)',
        delivery: '22 квітня — 6 травня',
        seller: 'Massachusetts Ins.', sellerOk: true,
        docs: 'На ходу', docsOk: true,
        damage1: 'Незначні / Подряпини', damage2: 'Немає',
        odometer: '130,000 миль (209,215 km)',
        key: 'Присутній',
        startCode: 'На ходу', startOk: true,
        acv: '$8,300 / $0 USD',
        body: 'Sedan', bodyExt: 'Sedan / 4-door',
        color: 'Чорний',
        engine: '3.0L I6', engineHp: '322 HP',
        transmission: 'Автоматичний',
        fuel: 'Бензиновий',
        drive: 'RWD',
        platformModel: '740i', platformEngine: '3.0L I6',
        platformDrive: 'RWD', platformTransmission: 'Автоматичний',
        saleStatus: 'В процесі',
        currentBid: 1700, estimate: [8300, 15040],
        endDate: '6 травня, 16:00',
        endTimestamp: Date.now() + 10 * 24 * 3600000 + 16 * 3600000,
        folder: '95678135_HD_images', prefix: '95678135', count: 13,
        specs: ['RWD', '3.0L', '6 цил.', '322HP'],
        brand: 'BMW'
      },
      {
        id: 6,
        title: '2020 BMW 7 Series, 745Le xDrive',
        lot: '96444975', vin: 'WBA7H0C00LBT74819',
        auction: 'IAAI', badge: 'NEW',
        location: 'Richmond (VA)', origin: 'Newark (NJ)',
        distance: '330 mil (531 km)',
        delivery: '18 квітня — 2 травня',
        seller: 'State Farm Insurance', sellerOk: true,
        docs: 'Clear — dealer only (CA)', docsOk: true,
        damage1: 'Крадіжка', damage2: 'Передня частина',
        odometer: '4,189 миль (6,742 km)',
        key: 'Присутній',
        startCode: 'На ходу', startOk: true,
        acv: '$318,067 / $0 USD',
        body: 'Sedan', bodyExt: 'Sedan / 4-door Plug-in Hybrid',
        color: 'Синій',
        engine: '3.0L V6', engineHp: '394 HP',
        transmission: 'Автоматичний',
        fuel: 'Гібридний',
        drive: 'AWD',
        platformModel: '745Le', platformEngine: '3.0L V6',
        platformDrive: 'AWD', platformTransmission: 'Автоматичний',
        saleStatus: 'На підтвердженні',
        currentBid: 111000, estimate: [90610, 140270],
        endDate: '2 травня, 15:30',
        endTimestamp: Date.now() + 6 * 24 * 3600000 + 20 * 3600000 + 25 * 60000,
        folder: '96444975_HD_images', prefix: '96444975', count: 13,
        specs: ['AWD', '3.0L', '6 цил.', '394HP'],
        brand: 'BMW'
      }
    ];

    /* ════════════════════════════════════════════════
       INIT
    ════════════════════════════════════════════════ */
    let currentCar = null;
    window.galleryIndex = 0;
    window.galleryImages = [];
    let galleryIndex = 0;
    let galleryImages = [];
    let bidValue = 0;
    const EUR_RATE = 0.91;
    let calculatorReferenceData = null;
    let currentCarContext = null;
    let parserTransitCache = null;

    function slugify(value) {
      return String(value || '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9а-яіїє]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
    }

    function buildCarSlug(context) {
      const titlePart = slugify(context && context.title ? context.title : 'auto');
      const key = String((context && (context.vin || context.lotId || context.id)) || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');
      return key ? (titlePart + '-' + key) : titlePart;
    }

    function getSiteOrigin() {
      if (window.location && /^https?:/i.test(window.location.origin || '')) {
        return window.location.origin;
      }
      return 'https://leechan.xyz';
    }

    function getSeoImage(context) {
      const firstImage = context && context.images && context.images.length ? context.images[0] : '';
      if (firstImage && /^https?:\/\//i.test(firstImage)) return firstImage;
      if (firstImage && firstImage.startsWith('/')) return getSiteOrigin() + firstImage;
      if (firstImage) return getSiteOrigin() + '/' + firstImage.replace(/^\/+/, '');
      return getSiteOrigin() + '/images/logo-carwaw-black.png';
    }

    function getCarPublicUrl(context) {
      const slug = buildCarSlug(context);
      const params = new URLSearchParams();
      if (context && context.vin) params.set('vin', String(context.vin));
      else if (context && context.lotId) params.set('lotId', String(context.lotId));
      params.set('slug', slug);
      return getSiteOrigin() + '/car.html?' + params.toString();
    }

    function setOrCreateMeta(selector, attr, value) {
      if (!value) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (attr === 'property') el.setAttribute('property', selector.replace(/^meta\[property="|"\]$/g, ''));
        if (attr === 'name') el.setAttribute('name', selector.replace(/^meta\[name="|"\]$/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    }

    function setCanonical(url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }

    function setJsonLd(id, data) {
      let script = document.getElementById(id);
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    }

    function markRouteAsNotFound(route) {
      const hasRouteParams = !!(route && (route.vin || route.lotId));
      if (!hasRouteParams) return;

      const fallbackTitle = 'Авто не знайдено — BIDDER';
      const fallbackDesc = 'За вказаним VIN або lotId авто не знайдено. Перевірте посилання або перейдіть у каталог.';
      const fallbackUrl = getSiteOrigin() + '/car.html';

      document.title = fallbackTitle;
      setCanonical(fallbackUrl);
      setOrCreateMeta('meta[name="description"]', 'name', fallbackDesc);
      setOrCreateMeta('meta[name="robots"]', 'name', 'noindex,follow');
      setOrCreateMeta('meta[property="og:title"]', 'property', fallbackTitle);
      setOrCreateMeta('meta[property="og:description"]', 'property', fallbackDesc);
      setOrCreateMeta('meta[property="og:url"]', 'property', fallbackUrl);
      setOrCreateMeta('meta[name="twitter:title"]', 'name', fallbackTitle);
      setOrCreateMeta('meta[name="twitter:description"]', 'name', fallbackDesc);
    }

    function updateDynamicSeo(context) {
      if (!context) return;
      const publicUrl = getCarPublicUrl(context);
      const title = (context.title || 'Авто') + ' — BIDDER';
      const desc = 'Купити ' + (context.title || 'авто') + ' з доставкою. VIN: ' + (context.vin || '—') + '. Фото, характеристики, орієнтовна ціна та логістика від BIDDER.';
      const image = getSeoImage(context);

      document.title = title;
      setCanonical(publicUrl);
      setOrCreateMeta('meta[name="description"]', 'name', desc);
      setOrCreateMeta('meta[name="robots"]', 'name', 'index,follow');
      setOrCreateMeta('meta[property="og:title"]', 'property', title);
      setOrCreateMeta('meta[property="og:description"]', 'property', desc);
      setOrCreateMeta('meta[property="og:url"]', 'property', publicUrl);
      setOrCreateMeta('meta[property="og:image"]', 'property', image);
      setOrCreateMeta('meta[name="twitter:title"]', 'name', title);
      setOrCreateMeta('meta[name="twitter:description"]', 'name', desc);
      setOrCreateMeta('meta[name="twitter:image"]', 'name', image);

      setJsonLd('schema-vehicle', {
        '@context': 'https://schema.org',
        '@type': 'Vehicle',
        name: context.title,
        brand: context.make || undefined,
        model: context.model || undefined,
        vehicleModelDate: context.year || undefined,
        fuelType: context.fuel || undefined,
        vehicleIdentificationNumber: context.vin || undefined,
        image: context.images || [image],
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: Number(context.price || 0),
          availability: 'https://schema.org/InStock',
          url: publicUrl
        }
      });

      setJsonLd('schema-breadcrumbs', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Головна', item: getSiteOrigin() + '/index.html' },
          { '@type': 'ListItem', position: 2, name: 'Авто в дорозі', item: getSiteOrigin() + '/catalog-available.html' },
          { '@type': 'ListItem', position: 3, name: context.title, item: publicUrl }
        ]
      });

      setJsonLd('schema-faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Скільки часу займає доставка авто?',
            acceptedAnswer: { '@type': 'Answer', text: 'У середньому доставка триває від 30 до 60 днів залежно від порту та маршруту.' }
          },
          {
            '@type': 'Question',
            name: 'Чи можна купити авто дистанційно?',
            acceptedAnswer: { '@type': 'Answer', text: 'Так, увесь процес відбувається онлайн: підбір, ставки, документи та доставка.' }
          }
        ]
      });
    }

    async function getParserTransitPool() {
      if (Array.isArray(parserTransitCache)) return parserTransitCache;
      const sources = ['data/parser/cars_transit.json', 'data/cars_parser.json'];
      for (let i = 0; i < sources.length; i += 1) {
        try {
          const resp = await fetch(sources[i], { cache: 'no-cache' });
          if (!resp.ok) continue;
          const rows = await resp.json();
          if (Array.isArray(rows) && rows.length) {
            parserTransitCache = rows;
            return parserTransitCache;
          }
        } catch (_) {}
      }
      parserTransitCache = [];
      return parserTransitCache;
    }

    function mapRelatedItem(source, fallbackSource) {
      if (!source) return null;
      const title = source.title || [source.year, source.make, source.model].filter(Boolean).join(' ');
      const vin = source.vin || '';
      const lotId = source.lotId || source.lot || source.id || '';
      const price = safeNum(source.price || source.currentBid || 0);
      const mileage = source.mileage || source.odometer || '';
      const imageList = Array.isArray(source.images)
        ? source.images.map(function(img) {
            if (!img) return '';
            if (/^https?:\/\//i.test(img) || String(img).startsWith('/')) return String(img);
            if (String(img).startsWith('images/')) return String(img);
            return 'images/' + String(img).replace(/^\/+/, '');
          }).filter(Boolean)
        : [];
      const firstImage = (source.localImages && source.localImages[0]) || imageList[0] || '';
      return {
        title: title || 'Авто',
        vin: vin,
        lotId: lotId,
        make: source.make || (title ? title.split(' ')[1] : ''),
        model: source.model || '',
        year: source.year || extractYear({ title: title }),
        fuel: source.fuel || '',
        price: price,
        mileage: mileage,
        sourceType: fallbackSource || 'parser',
        image: firstImage
      };
    }

    function makeRelatedHref(item) {
      const slug = buildCarSlug(item);
      if (item.vin) return 'car.html?vin=' + encodeURIComponent(item.vin) + '&slug=' + encodeURIComponent(slug);
      return 'car.html?lotId=' + encodeURIComponent(item.lotId) + '&slug=' + encodeURIComponent(slug);
    }

    async function renderRelatedCars(context) {
      const grid = document.getElementById('relatedCarsGrid');
      if (!grid || !context) return;

      let pool = [];
      if (context.sourceType === 'local') {
        pool = Object.keys(LOCAL_CARS || {}).map(function(vinKey) {
          return mapRelatedItem(LOCAL_CARS[vinKey], 'local');
        });
      } else if (context.sourceType === 'parser') {
        const parserRows = await getParserTransitPool();
        pool = parserRows.map(function(row) { return mapRelatedItem(row, 'parser'); });
      } else {
        pool = CARS.map(function(row) {
          return mapRelatedItem({
            title: row.title,
            vin: row.vin,
            lot: row.lot,
            currentBid: row.currentBid,
            fuel: row.fuel,
            odometer: row.odometer,
            images: Array.from({ length: row.count || 0 }).map(function(_, idx) {
              return 'images/' + row.folder + '/' + row.prefix + '_Image_' + (idx + 1) + '.jpg';
            })
          }, 'catalog');
        });
      }

      const currentVin = String(context.vin || '').toUpperCase();
      const currentLot = String(context.lotId || '').toUpperCase();
      const currentMake = String(context.make || '').toUpperCase();
      const currentFuel = String(context.fuel || '').toUpperCase();

      const ranked = pool
        .filter(function(item) {
          const vin = String(item && item.vin || '').toUpperCase();
          const lot = String(item && item.lotId || '').toUpperCase();
          return !(vin && vin === currentVin) && !(lot && lot === currentLot);
        })
        .map(function(item) {
          let score = 0;
          if (String(item.make || '').toUpperCase() === currentMake) score += 4;
          if (String(item.fuel || '').toUpperCase() === currentFuel) score += 2;
          const yearDiff = Math.abs(safeNum(item.year) - safeNum(context.year));
          score += Math.max(0, 3 - Math.min(yearDiff, 3));
          return { score: score, item: item };
        })
        .sort(function(a, b) { return b.score - a.score; })
        .slice(0, 4)
        .map(function(entry) { return entry.item; });

      if (!ranked.length) {
        grid.innerHTML = '';
        return;
      }

      grid.innerHTML = ranked.map(function(item) {
        const href = makeRelatedHref(item);
        const price = item.price ? ('$' + Math.round(item.price).toLocaleString('en-US')) : 'Ціну уточнюйте';
        return '' +
          '<a class="related-card" href="' + href + '">' +
            '<div class="related-photo">' + (item.image ? '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" />' : '') + '</div>' +
            '<div class="related-body">' +
              '<div class="related-title">' + item.title + '</div>' +
              '<div class="related-meta">' + (item.mileage || (item.year ? String(item.year) : '—')) + '</div>' +
              '<div class="related-price">' + price + '</div>' +
            '</div>' +
          '</a>';
      }).join('');
    }

    function setCurrentCarContext(context) {
      currentCarContext = context;
      updateDynamicSeo(currentCarContext);
      renderRelatedCars(currentCarContext).catch(function() {});
    }

    function parseCarRouteParams() {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const pathMatch = window.location.pathname.match(/\/car\/(.+?)\/?$/i);
      const slugFromPath = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
      const slug = searchParams.get('slug') || hashParams.get('slug') || slugFromPath;
      const vinFromSlug = slug && slug.match(/([A-HJ-NPR-Z0-9]{11,17})$/i);
      const lotFromSlug = slug && slug.match(/(\d{5,})$/);

      return {
        lotId: hashParams.get('lotId') || searchParams.get('lotId') || (lotFromSlug ? lotFromSlug[1] : ''),
        vin: hashParams.get('vin') || searchParams.get('vin') || (vinFromSlug ? vinFromSlug[1].toUpperCase() : ''),
        slug: slug || ''
      };
    }

    function safeNum(value) {
      const n = Number(value);
      return Number.isFinite(n) ? n : 0;
    }

    function normalizeText(value) {
      return String(value || '')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9а-яіїє]+/gi, ' ')
        .trim();
    }

    function extractYear(car) {
      const match = String(car && car.title || '').match(/\b(20\d{2}|19\d{2})\b/);
      return match ? Number(match[1]) : new Date().getFullYear();
    }

    function extractEngineVolume(car) {
      const source = String((car && car.engine) || (car && car.platformEngine) || '');
      const match = source.match(/(\d+(?:\.\d+)?)/);
      if (match) return Number(match[1]);
      if (/electro|electric|електро/i.test(source + ' ' + String(car && car.fuel || ''))) return 75;
      return 2.0;
    }

    function inferFuelType(car) {
      const source = normalizeText((car && car.fuel) + ' ' + (car && car.engine) + ' ' + (car && car.platformEngine));
      if (source.includes('electro') || source.includes('electric') || source.includes('електро')) return 'Electro';
      if (source.includes('hybrid') || source.includes('гібрид')) return 'Hybrid';
      if (source.includes('diesel') || source.includes('дизел')) return 'Diesel';
      return 'Gas';
    }

    function inferVehicleType(car) {
      const source = normalizeText((car && car.body) + ' ' + (car && car.bodyExt) + ' ' + (car && car.title));
      if (source.includes('moto') || source.includes('мото')) return 'Moto';
      if (source.includes('pickup') || source.includes('пікап') || source.includes('truck') || source.includes('бус')) return 'PickupTrucks';
      if (source.includes('suv') || source.includes('кросовер') || source.includes('позашлях')) return 'SUVs';
      return 'Automobiles';
    }

    function inferAuctionType(car) {
      const auction = String(car && car.auction || '').toUpperCase();
      if (auction === 'IAAI') return 'IAAI';
      if (auction === 'MANHEIM') return 'Manheim';
      return 'Copart';
    }

    function inferExportDocsType(car) {
      const source = normalizeText((car && car.docs) + ' ' + (car && car.origin));
      if (source.includes('canada') || source.includes('канада')) return 'Canada';
      if (source.includes('manheim')) return 'Manheim';
      if (source.includes('closed') || source.includes('закрит')) return 'Usa closed';
      return 'Usa';
    }

    function getAuctionFeeForCar(auctionKey, price, reference) {
      const tables = (reference && reference.coefficients) || {};
      const tableKey = String(auctionKey || 'Copart').toLowerCase();
      const table = tables[tableKey] || [];
      for (let i = 0; i < table.length; i += 1) {
        if (price <= safeNum(table[i].item)) return safeNum(table[i].coefficient);
      }
      return table.length ? safeNum(table[table.length - 1].coefficient) : Math.max(75, Math.min(Math.round(price * 0.065), 1500));
    }

    function getTransferFeeForCar(price, auctionFee, docsType) {
      const rate = (docsType === 'Canada' || docsType === 'Manheim') ? 0.02 : 0.01;
      return Math.max(1, Math.round((safeNum(price) + safeNum(auctionFee)) * rate));
    }

    function findOriginForCar(car, reference) {
      const origins = reference && reference.calculatorDetails && Array.isArray(reference.calculatorDetails.deliveryCoefficientToPort)
        ? reference.calculatorDetails.deliveryCoefficientToPort
        : [];
      if (!origins.length) return null;

      const haystack = normalizeText((car && car.location) + ' ' + (car && car.origin) + ' ' + (car && car.title));
      const cityTokens = haystack.split(' ').filter(Boolean);

      let best = origins[0];
      let bestScore = -1;

      origins.forEach(origin => {
        const cityName = normalizeText(origin.cityName);
        let score = 0;
        if (cityName && haystack.includes(cityName)) score += 5;
        cityTokens.forEach(token => {
          if (token.length > 2 && cityName.includes(token)) score += 1;
        });
        if (score > bestScore) {
          bestScore = score;
          best = origin;
        }
      });

      return best;
    }

    function buildCalculatorContext(car, bid) {
      const reference = calculatorReferenceData;
      const details = reference && reference.calculatorDetails ? reference.calculatorDetails : null;
      const docsType = inferExportDocsType(car);
      const auctionKey = inferAuctionType(car);
      const origin = findOriginForCar(car, reference);
      const auctionFee = getAuctionFeeForCar(auctionKey, bid, reference);
      const usDelivery = origin ? safeNum(origin.value) : 430;
      let oceanDelivery = origin && origin.deliveryCoefficient ? safeNum(origin.deliveryCoefficient.klaipedaValue) : 995;
      if (oceanDelivery >= 999999 || oceanDelivery <= 0) oceanDelivery = 995;

      return {
        routeKey: 'klaipeda',
        docsType,
        auctionKey,
        origin,
        auctionFee,
        usDelivery,
        exportDocs: details && details.exportDocumentsFee ? safeNum(details.exportDocumentsFee[docsType]) : 150,
        oceanDelivery,
        portUnload: details ? (safeNum(details.unloadingFromPortKlaidepa) || 400) : 400,
        europeDelivery: details ? (safeNum(details.deliveryToLvivKlaidepa) || 800) : 800,
        customsDelivery: details ? (safeNum(details.deliveryToBorderKlaidepa) || 80) : 80,
        borderHandling: details ? (safeNum(details.specialTransportPrice) || 110) : 110,
        brokerFeeUsd: details ? (safeNum(details.brokerPriceKlaidepa) || 250) : 250,
        companyFee: details ? (safeNum(details.lubeAvtoFee) || 600) : 600,
        insuranceFee: details ? (safeNum(details.insuranceFee) || 1) : 1,
        transferFee: getTransferFeeForCar(bid, auctionFee, docsType)
      };
    }

    function buildFullCalculatorUrl(car, bid, context) {
      const params = new URLSearchParams();
      params.set('route', context.routeKey);
      params.set('type', inferVehicleType(car));
      params.set('fuel', inferFuelType(car));
      params.set('year', String(extractYear(car)));
      params.set('engine', String(extractEngineVolume(car)));
      params.set('price', String(Math.round(bid)));
      params.set('auction', context.auctionKey);
      params.set('docs', context.docsType);
      if (context.origin && context.origin.id != null) {
        params.set('origin', String(context.origin.id));
      }
      return 'calculator.html?' + params.toString();
    }

    function primeCalculatorReferenceData() {
      fetch('data/calculator-reference-data.json', { cache: 'no-cache' })
        .then(response => {
          if (!response.ok) throw new Error('calculator-reference-unavailable');
          return response.json();
        })
        .then(data => {
          calculatorReferenceData = data;
          if (currentCar) updateCalculators();
        })
        .catch(() => {
          calculatorReferenceData = null;
          if (currentCar) updateCalculators();
        });
    }

    function getCarId() {
      const params = new URLSearchParams(window.location.search);
      const id = parseInt(params.get('id'));
      return (id >= 1 && id <= 6) ? id : 1;
    }

    function fmt(n) {
      return '$' + Math.round(n).toLocaleString('en-US');
    }
    function fmtEUR(n) {
      return '€' + Math.round(n).toLocaleString('en-US');
    }

    function loadCar(car) {
      currentCar = car;
      document.title = car.title + ' — BIDDER';

      // Breadcrumb
      document.getElementById('bcCarTitle').textContent = car.title;

      // Title bar
      document.getElementById('carTitleMain').textContent = car.title;
      document.getElementById('carVin').textContent = car.vin;
      document.getElementById('carLot').textContent = car.lot;

      const auctBadge = document.getElementById('carAuctionBadge');
      if (car.auction === 'IAAI') {
        auctBadge.className = 'badge-auction-iaai';
        auctBadge.textContent = 'IAAI';
      } else {
        auctBadge.className = 'badge-auction-copart';
        auctBadge.textContent = 'Copart';
      }

      document.getElementById('carLocation').textContent = car.location;
      document.getElementById('carOrigin').textContent = car.origin;
      document.getElementById('carDistance').textContent = car.distance;
      document.getElementById('carDelivery').textContent = car.delivery;

      // Direct auction badge
      document.getElementById('auctionDirectDate').textContent = car.endDate !== 'Завершено' ? car.endDate : '—';

      // Specs section 1
      document.getElementById('sLot').textContent = car.lot;
      document.getElementById('sVin').textContent = car.vin;
      document.getElementById('sSeller').textContent = car.seller;

      const docsEl = document.getElementById('sDocs');
      docsEl.textContent = car.docs;
      docsEl.className = 'spec-value ' + (car.docsOk ? 'doc-ok' : 'doc-bad');

      document.getElementById('sDamage1').textContent = car.damage1;
      document.getElementById('sDamage2').textContent = car.damage2;
      document.getElementById('sOdometer').textContent = car.odometer;
      document.getElementById('sKey').textContent = car.key;

      // Specs section 2
      document.getElementById('sBody').textContent = car.body;
      document.getElementById('sColor').textContent = car.color;
      document.getElementById('sEngine').textContent = car.engine + ', ' + car.engineHp;
      document.getElementById('sTransmission').textContent = car.transmission;
      document.getElementById('sFuel').textContent = car.fuel;
      document.getElementById('sDrive').textContent = car.drive;

      // Hidden rows
      const startEl = document.getElementById('sStartCode');
      startEl.textContent = car.startCode;
      startEl.className = 'spec-value ' + (car.startOk ? 'start-ok' : 'start-bad');

      document.getElementById('sAcv').textContent = car.acv;
      document.getElementById('sBodyExt').textContent = car.bodyExt;
      document.getElementById('sPlatform').textContent = car.auction;
      document.getElementById('sPlatformModel').textContent = car.platformModel;
      document.getElementById('sPlatformEngine').textContent = car.platformEngine;
      document.getElementById('sPlatformDrive').textContent = car.platformDrive;

      const statusEl = document.getElementById('sSaleStatus');
      statusEl.textContent = car.saleStatus;
      if (car.saleStatus === 'Завершено') statusEl.className = 'spec-value status-done';
      else if (car.saleStatus === 'В процесі') statusEl.className = 'spec-value status-process';
      else statusEl.className = 'spec-value';

      // Bid sidebar
      bidValue = car.currentBid + 500;
      document.getElementById('bidCurrent').textContent = fmt(car.currentBid);
      updateBidDisplay();

      // Timer
      document.getElementById('timerEnd').textContent = car.endDate;
      startTimer(car.endTimestamp);

      // Calculators
      updateCalculators();

      // Gallery
      galleryImages = [];
      for (let i = 1; i <= car.count; i++) {
        galleryImages.push('images/' + car.folder + '/' + car.prefix + '_Image_' + i + '.jpg');
      }
      galleryIndex = 0;
      renderGallery();

      document.getElementById('galleryShowAll').textContent = 'Показати всі фото (' + car.count + ')';

      // Render description section
      renderCarDescription(car);

      const makeModel = String(car.title || '').split(/\s+/);
      setCurrentCarContext({
        title: car.title,
        vin: car.vin,
        lotId: car.lot,
        make: makeModel[1] || car.brand || '',
        model: makeModel.slice(2).join(' ') || '',
        year: extractYear(car),
        fuel: car.fuel || '',
        price: safeNum(car.currentBid),
        images: galleryImages.slice(),
        sourceType: 'catalog'
      });
    }

    /* ════════════════════════════════════════════════
       GALLERY
    ════════════════════════════════════════════════ */
    function renderGallery() {
      window.galleryImages = galleryImages;
      window.galleryIndex  = galleryIndex;

      const main = document.getElementById('galleryMain');
      main.src = galleryImages[galleryIndex];
      document.getElementById('galleryCounter').textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;

      const thumbsEl = document.getElementById('galleryThumbs');
      thumbsEl.innerHTML = '';
      galleryImages.forEach((src, i) => {
        const div = document.createElement('div');
        div.className = 'thumb-item' + (i === galleryIndex ? ' active' : '');
        div.innerHTML = '<img src="' + src + '" alt="Photo ' + (i+1) + '" loading="lazy" />';
        div.addEventListener('click', () => setGalleryIndex(i));
        thumbsEl.appendChild(div);
      });

      // Update "Показати всі фото" button
      const showAllBtn = document.getElementById('galleryShowAll');
      if (showAllBtn) {
        const LIMIT = 12;
        if (galleryImages.length <= LIMIT) {
          showAllBtn.style.display = 'none';
        } else {
          showAllBtn.style.display = '';
          showAllBtn.textContent = 'Показати всі фото (+' + (galleryImages.length - LIMIT) + ')';
        }
      }
    }

    function setGalleryIndex(idx) {
      if (idx < 0) idx = galleryImages.length - 1;
      if (idx >= galleryImages.length) idx = 0;
      galleryIndex = idx;
      window.galleryIndex = idx;
      const main = document.getElementById('galleryMain');
      main.classList.add('loading');
      main.src = galleryImages[galleryIndex];
      main.onload = () => main.classList.remove('loading');
      document.getElementById('galleryCounter').textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;

      document.querySelectorAll('.thumb-item').forEach((el, i) => {
        el.classList.toggle('active', i === galleryIndex);
      });
    }

    document.getElementById('galleryPrev').addEventListener('click', () => setGalleryIndex(galleryIndex - 1));
    document.getElementById('galleryNext').addEventListener('click', () => setGalleryIndex(galleryIndex + 1));

    // Keyboard support
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') setGalleryIndex(galleryIndex - 1);
      if (e.key === 'ArrowRight') setGalleryIndex(galleryIndex + 1);
    });

    // Touch swipe
    let touchStartX = 0;
    const galleryWrap = document.querySelector('.gallery-main-wrap');
    galleryWrap.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    galleryWrap.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40) setGalleryIndex(galleryIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });

    /* ════════════════════════════════════════════════
       SHOW MORE SPECS
    ════════════════════════════════════════════════ */
    let moreOpen = false;
    function toggleMoreSpecs() {
      moreOpen = !moreOpen;
      const rows = document.getElementById('specsMoreRows');
      const btn = document.getElementById('showMoreText');
      const icon = document.getElementById('showMoreIcon');
      rows.classList.toggle('open', moreOpen);
      if (moreOpen) {
        btn.textContent = 'Показати менше';
        icon.innerHTML = '<path d="M2 7h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>';
      } else {
        btn.textContent = 'Показати більше (8)';
        icon.innerHTML = '<path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>';
      }
    }

    /* ════════════════════════════════════════════════
       SERVICE CHECKBOXES
    ════════════════════════════════════════════════ */
    function toggleService(row) {
      const cb = row.querySelector('.service-cb');
      cb.classList.toggle('checked');
    }

    /* ════════════════════════════════════════════════
       BID
    ════════════════════════════════════════════════ */
    function updateBidDisplay() {
      document.getElementById('bidInput').value = fmt(bidValue);
      updateCalculators();
    }

    function adjustBid(delta) {
      if (!currentCar) return;
      bidValue = Math.max(currentCar.currentBid, bidValue + delta);
      updateBidDisplay();
    }

    /* ════════════════════════════════════════════════
       CALCULATORS
    ════════════════════════════════════════════════ */
    function calcAuctionFee(bid) {
      let fee = bid * 0.065;
      if (fee < 75) fee = 75;
      if (fee > 1500) fee = 1500;
      return fee;
    }

    function updateCalculators() {
      if (!currentCar) return;
      const bid = safeNum(bidValue || currentCar.currentBid);
      const calcContext = buildCalculatorContext(currentCar, bid);
      const fee = calcContext.auctionFee || calcAuctionFee(bid);
      const portDelivery = calcContext.usDelivery;
      const oceanDelivery = calcContext.oceanDelivery;
      const serviceFee = calcContext.exportDocs + calcContext.companyFee;
      const subtotal = bid + fee + portDelivery + oceanDelivery + serviceFee;

      document.getElementById('calcBidVal').textContent = fmt(bid);
      document.getElementById('calcAuctionFee').textContent = fmt(fee);
      document.getElementById('calcPortDelivery').textContent = fmt(portDelivery);
      document.getElementById('calcOceanDelivery').textContent = fmt(oceanDelivery);
      document.getElementById('calcOceanDeliveryLabel').textContent = calcContext.origin && calcContext.origin.deliveryCoefficient && calcContext.origin.deliveryCoefficient.portName
        ? 'Морська доставка через ' + calcContext.origin.deliveryCoefficient.portName
        : 'Морська доставка';
      document.getElementById('calcServiceFee').textContent = fmt(serviceFee);
      document.getElementById('calcSubtotal').textContent = fmt(subtotal);
      document.getElementById('calcPriceNote').textContent = calculatorReferenceData
        ? 'Розрахунок підтягує логістику, порти та сервіс BIDDER з локального довідника. Курс USD/EUR = 0.91.'
        : 'Показано базовий орієнтир без live-API. Для повного сценарію відкрийте калькулятор.';

      const estLow = currentCar.estimate[0];
      const estHigh = currentCar.estimate[1];
      document.getElementById('calcRange').textContent = fmt(estLow) + ' – ' + fmt(estHigh);
      document.getElementById('calcEstBadge').textContent = 'Оціночна вартість: ' + fmt(estLow) + ' – ' + fmt(estHigh);

      // Customs
      const subtotalEUR = subtotal * EUR_RATE;
      const tax = subtotalEUR * 0.10;
      const vatBase = subtotalEUR + tax;
      const vat = vatBase * 0.21;
      const brokerEUR = (calcContext.brokerFeeUsd + calcContext.customsDelivery + calcContext.borderHandling + calcContext.insuranceFee + calcContext.transferFee) * EUR_RATE;
      const customsTotal = tax + vat + brokerEUR;
      const finalTotal = subtotalEUR + customsTotal;

      document.getElementById('calcTax').textContent = fmtEUR(tax);
      document.getElementById('calcVat').textContent = fmtEUR(vat);
      document.getElementById('calcBrokerFee').textContent = fmtEUR(brokerEUR);
      document.getElementById('calcCustomsTotal').textContent = fmtEUR(customsTotal);
      document.getElementById('calcFinalTotal').textContent = fmtEUR(finalTotal);
      document.getElementById('calcCustomsNote').textContent = calculatorReferenceData
        ? 'Митний блок враховує брокера, доставку на митницю, страхування та переказ коштів за логікою референсу.'
        : 'Митний блок показує орієнтир. Для точного сценарію по документу та маршруту відкрийте повний калькулятор.';

      const fullCalculatorLink = document.getElementById('openFullCalculator');
      if (fullCalculatorLink) {
        fullCalculatorLink.href = buildFullCalculatorUrl(currentCar, bid, calcContext);
      }
    }

    /* ════════════════════════════════════════════════
       TIMER
    ════════════════════════════════════════════════ */
    let timerInterval = null;
    function startTimer(endTs) {
      if (timerInterval) clearInterval(timerInterval);
      function tick() {
        const now = Date.now();
        const diff = endTs - now;
        const el = document.getElementById('timerDisplay');
        if (diff <= 0) {
          el.textContent = 'Аукціон завершено';
          el.classList.add('expired');
          clearInterval(timerInterval);
          return;
        }
        el.classList.remove('expired');
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const parts = [];
        if (d > 0) parts.push(d + 'д');
        parts.push(String(h).padStart(2,'0') + 'г');
        parts.push(String(m).padStart(2,'0') + 'хв');
        parts.push(String(s).padStart(2,'0') + 'с');
        el.textContent = parts.join(' ');
      }
      tick();
      timerInterval = setInterval(tick, 1000);
    }

    /* ════════════════════════════════════════════════
       ACCORDION
    ════════════════════════════════════════════════ */
    function toggleCalc(id) {
      document.getElementById(id).classList.toggle('open');
    }

    /* ════════════════════════════════════════════════
       WATCH BUTTON
    ════════════════════════════════════════════════ */
    function toggleWatch() {
      document.getElementById('watchBtn').classList.toggle('active');
    }

    /* ════════════════════════════════════════════════
       COPY VIN
    ════════════════════════════════════════════════ */
    function copyVin() {
      if (!currentCar) return;
      navigator.clipboard.writeText(currentCar.vin).then(() => {
        const btn = document.getElementById('copyVinBtn');
        btn.textContent = 'Скопійовано!';
        setTimeout(() => { btn.textContent = 'Копіювати'; }, 2000);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = currentCar.vin;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        const btn = document.getElementById('copyVinBtn');
        btn.textContent = 'Скопійовано!';
        setTimeout(() => { btn.textContent = 'Копіювати'; }, 2000);
      });
    }

    /* ════════════════════════════════════════════════
       HEADER
    ════════════════════════════════════════════════ */

    /* ════════════════════════════════════════════════
       CAR DESCRIPTION
    ════════════════════════════════════════════════ */
    function renderCarDescription(car) {
      const rows = [
        ['Марка', 'BMW'],
        ['Модель', car.title.replace(/^\d{4}\s+BMW\s+/, '').replace(' Series,', ' Series')],
        ['Рік', car.title.match(/^\d{4}/)?.[0] || '—'],
        ['VIN', car.vin],
        ['Номер лота', car.lot],
        ['Аукціон', car.auction],
        ['Місцезнаходження', car.location],
        ['Порт відправлення', car.origin],
        ['Відстань до порту', car.distance],
        ['Пробіг', car.odometer],
        ['Тип кузова', car.body],
        ['Колір', car.color],
        ['Двигун', car.engine + ', ' + car.engineHp],
        ['Коробка передач', car.transmission],
        ['Тип палива', car.fuel],
        ['Тип приводу', car.drive],
        ['Первинне пошкодження', car.damage1],
        ['Вторинне пошкодження', car.damage2],
        ['Ключ', car.key],
        ['Початковий код', car.startCode],
        ['ACV / ERC', car.acv],
        ['Документи', car.docs],
        ['Продавець', car.seller],
        ['Статус продажу', car.saleStatus],
        ['Розширений тип кузова', car.bodyExt],
        ['Платформа — модель', car.platformModel],
        ['Платформа — двигун', car.platformEngine],
        ['Платформа — привід', car.platformDrive],
        ['Платформа — КП', car.platformTransmission],
      ];
      const container = document.getElementById('descGridContainer');
      if (!container) return;
      container.innerHTML = rows.map(([label, value]) => `
        <div class="desc-row">
          <span class="desc-label">${label}</span>
          <span class="desc-value">${value || '—'}</span>
        </div>
      `).join('');
    }

    /* ════════════════════════════════════════════════
       FAQ ACCORDION
    ════════════════════════════════════════════════ */
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    /* ════════════════════════════════════════════════
       API CAR LOADING
    ════════════════════════════════════════════════ */
    const API_BASE_CAR = 'https://auto.ecofactor.ua';
    const API_KEY_CAR  = 'eco_dae2c8f67505028dd8eb15477aa4f40994041ac717999b66';
    const PARSER_IN_ROUTE_API_BASE = 'https://api-lubeavto.azurewebsites.net';

    function normalizeDrivetrain(v) {
      if (!v) return '—';
      const s = v.toUpperCase();
      if (s.includes('ALL WHEEL') || s === 'AWD') return 'AWD';
      if (s.includes('FRONT WHEEL') || s === 'FWD') return 'FWD';
      if (s.includes('REAR WHEEL') || s === 'RWD') return 'RWD';
      if (s.includes('4X4') || s.includes('FOUR WHEEL')) return '4WD';
      return v;
    }
    function normalizeFuel(v) {
      if (!v) return '—';
      const s = v.toUpperCase();
      if (s.includes('DIESEL')) return 'Дизель';
      if (s.includes('ELECTRIC') && !s.includes('GAS') && !s.includes('HYBRID')) return 'Електро';
      if (s.includes('HYBRID') || (s.includes('ELECTRIC') && s.includes('GAS'))) return 'Гібрид';
      if (s.includes('HYDROGEN')) return 'Водень';
      if (s.includes('GAS') || s.includes('FLEX') || s.includes('GASOLINE')) return 'Бензин';
      return v;
    }
    function normalizeTransmission(v) {
      if (!v) return '—';
      const s = v.toUpperCase();
      if (s.includes('AUTO')) return 'Автоматична';
      if (s.includes('MANUAL')) return 'Механічна';
      return v;
    }
    function normalizeCondition(v) {
      if (!v) return '—';
      const s = v.toUpperCase();
      if (s.includes('RUNS AND DRIVES') || s.includes('RUN & DRIVE')) return 'На ходу';
      if (s.includes('ENGINE START')) return 'Заводиться';
      return v;
    }
    function fmtOdometer(miles) {
      if (!miles) return '—';
      const km = Math.round(miles * 1.60934);
      return miles.toLocaleString() + ' mi (' + km.toLocaleString() + ' km)';
    }

    async function loadApiCar(lotId) {
      const r = await fetch(API_BASE_CAR + '/api/v1/vehicles/' + lotId, {
        headers: { 'X-API-Key': API_KEY_CAR }
      });
      const data = await r.json();
      return data.data || data;
    }

    function applyApiCarToPage(d) {
      const title = [d.year, d.make, d.model].filter(Boolean).join(' ');
      document.title = title + ' — BIDDER';

      const trySet = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };

      trySet('bcCarTitle', title);
      trySet('carTitleMain', title);
      trySet('carVin', d.vin || '—');
      trySet('carLot', d.lotId || d.id || '—');

      const auctBadge = document.getElementById('carAuctionBadge');
      if (auctBadge) {
        const src = (d.source || '').toLowerCase();
        if (src === 'iaai') { auctBadge.className = 'badge-auction-iaai'; auctBadge.textContent = 'IAAI'; }
        else { auctBadge.className = 'badge-auction-copart'; auctBadge.textContent = 'Copart'; }
      }

      trySet('carLocation', d.location || d.city || '—');
      trySet('carOrigin', '—');
      trySet('carDistance', '—');
      trySet('carDelivery', '—');
      trySet('auctionDirectDate', '—');

      trySet('sLot', d.lotId || d.id || '—');
      trySet('sVin', d.vin || '—');
      trySet('sSeller', d.seller || '—');

      const docsEl = document.getElementById('sDocs');
      if (docsEl) { docsEl.textContent = d.titleType || d.docs || '—'; docsEl.className = 'spec-value'; }

      trySet('sDamage1', d.primaryDamage || d.damage || '—');
      trySet('sDamage2', d.secondaryDamage || '—');
      trySet('sOdometer', fmtOdometer(d.odometer));
      trySet('sKey', d.keys || d.key || '—');
      trySet('sBody', d.bodyStyle || d.body || '—');
      trySet('sColor', d.color || '—');

      const engStr = [d.engine, d.engineDisplacement && (d.engineDisplacement + 'L'), d.cylinders && (d.cylinders + 'cyl')].filter(Boolean).join(' ');
      trySet('sEngine', engStr || '—');
      trySet('sTransmission', normalizeTransmission(d.transmission));
      trySet('sFuel', normalizeFuel(d.fuel));
      trySet('sDrive', normalizeDrivetrain(d.drivetrain || d.drive));

      const condStr = normalizeCondition(d.condition || d.startCode || '');
      const startEl = document.getElementById('sStartCode');
      if (startEl) { startEl.textContent = condStr; startEl.className = 'spec-value' + (condStr === 'На ходу' ? ' start-ok' : ''); }

      trySet('sAcv', d.estimatedValue ? '$' + d.estimatedValue.toLocaleString() : '—');
      trySet('sBodyExt', d.bodyStyle || '—');
      trySet('sPlatform', (d.source || '').toUpperCase() || '—');
      trySet('sPlatformModel', d.model || '—');
      trySet('sPlatformEngine', engStr || '—');
      trySet('sPlatformDrive', normalizeDrivetrain(d.drivetrain || d.drive));

      const statusEl = document.getElementById('sSaleStatus');
      if (statusEl) { statusEl.textContent = condStr; statusEl.className = 'spec-value'; }

      // Bid sidebar
      const bid = d.currentBid || 0;
      bidValue = bid + 500;
      const bidCur = document.getElementById('bidCurrent');
      if (bidCur) bidCur.textContent = '$' + Math.round(bid).toLocaleString('en-US');
      updateBidDisplay();

      const timerEnd = document.getElementById('timerEnd');
      if (timerEnd) timerEnd.textContent = '—';
      if (typeof updateCalculators === 'function') updateCalculators();

      // Gallery
      const images = d.images || d.photos || [];
      galleryImages = images.length ? images : (d.thumbnail ? [d.thumbnail] : []);
      galleryIndex = 0;
      if (galleryImages.length) renderGallery();

      const galleryShowAll = document.getElementById('galleryShowAll');
      if (galleryShowAll) galleryShowAll.textContent = 'Показати всі фото (' + galleryImages.length + ')';

      // Description section
      const rows = [
        ['Марка', d.make],
        ['Модель', d.model],
        ['Рік', d.year],
        ['VIN', d.vin],
        ['Номер лота', d.lotId || d.id],
        ['Аукціон', (d.source || '').toUpperCase()],
        ['Місцезнаходження', d.location || d.city],
        ['Пробіг', fmtOdometer(d.odometer)],
        ['Тип кузова', d.bodyStyle],
        ['Колір', d.color],
        ['Двигун', engStr],
        ['Коробка передач', normalizeTransmission(d.transmission)],
        ['Тип палива', normalizeFuel(d.fuel)],
        ['Тип приводу', normalizeDrivetrain(d.drivetrain || d.drive)],
        ['Первинне пошкодження', d.primaryDamage || d.damage],
        ['Вторинне пошкодження', d.secondaryDamage],
        ['Ключ', d.keys || d.key],
        ['Початковий стан', condStr],
        ['Документи', d.titleType || d.docs],
        ['Продавець', d.seller],
        ['Статус', condStr],
      ];
      const container = document.getElementById('descGridContainer');
      if (container) {
        container.innerHTML = rows.map(([lbl, val]) =>
          '<div class="desc-row"><span class="desc-label">' + lbl + '</span><span class="desc-value">' + (val || '—') + '</span></div>'
        ).join('');
      }

      setCurrentCarContext({
        title: title || 'Авто',
        vin: d.vin || '',
        lotId: d.lotId || d.id || '',
        make: d.make || '',
        model: d.model || '',
        year: d.year || '',
        fuel: normalizeFuel(d.fuel || ''),
        price: safeNum(d.currentBid || d.estimatedValue || 0),
        images: galleryImages.slice(),
        sourceType: 'api'
      });
    }


    /* ════════════════════════════════════════════════
       LOCAL CARS (Авто в дорозі)
    ════════════════════════════════════════════════ */
    window.LOCAL_CARS = {
      '1C4PJLCB3LD601278': { title:'2020 Jeep Cherokee Latitude', vin:'1C4PJLCB3LD601278', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'121,766 mi (196,000 km)', key:'Так', body:'SUV / Кросовер', color:'Червоний', engine:'2.4L, 4 цил.', engineHp:'180 к.с.', transmission:'Автоматична', fuel:'Бензин', drive:'Передній (FWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'SUV', platformModel:'Cherokee Latitude', platformEngine:'2.4L I4', platformDrive:'FWD', saleStatus:'В дорозі', currentBid:8700, localImages:['images/local/1C4PJLCB3LD601278/1.jpg','images/local/1C4PJLCB3LD601278/2.jpg','images/local/1C4PJLCB3LD601278/3.jpg','images/local/1C4PJLCB3LD601278/4.jpg','images/local/1C4PJLCB3LD601278/5.jpg','images/local/1C4PJLCB3LD601278/6.jpg','images/local/1C4PJLCB3LD601278/7.jpg','images/local/1C4PJLCB3LD601278/8.jpg','images/local/1C4PJLCB3LD601278/9.jpg','images/local/1C4PJLCB3LD601278/10.jpg','images/local/1C4PJLCB3LD601278/11.jpg','images/local/1C4PJLCB3LD601278/12.jpg'] },
      '1FMCU0BZ3LUB13706': { title:'2020 Ford Escape Hybrid', vin:'1FMCU0BZ3LUB13706', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'116,797 mi (188,000 km)', key:'Так', body:'SUV / Кросовер', color:'Червоний', engine:'2.5L, 4 цил.', engineHp:'200 к.с.', transmission:'Автоматична', fuel:'Гібрид', drive:'Передній (FWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'SUV', platformModel:'Escape Hybrid', platformEngine:'2.5L Hybrid', platformDrive:'FWD', saleStatus:'В дорозі', currentBid:12500, localImages:['images/local/1FMCU0BZ3LUB13706/1.jpg','images/local/1FMCU0BZ3LUB13706/2.jpg','images/local/1FMCU0BZ3LUB13706/3.jpg','images/local/1FMCU0BZ3LUB13706/4.jpg','images/local/1FMCU0BZ3LUB13706/5.jpg','images/local/1FMCU0BZ3LUB13706/6.jpg','images/local/1FMCU0BZ3LUB13706/7.jpg','images/local/1FMCU0BZ3LUB13706/8.jpg','images/local/1FMCU0BZ3LUB13706/9.jpg','images/local/1FMCU0BZ3LUB13706/10.jpg','images/local/1FMCU0BZ3LUB13706/11.jpg','images/local/1FMCU0BZ3LUB13706/12.jpg'] },
      '1C4RJHBGXPC619954': { title:'2023 Jeep Grand Cherokee', vin:'1C4RJHBGXPC619954', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'45,982 mi (74,000 km)', key:'Так', body:'SUV / Кросовер', color:'—', engine:'3.6L, 6 цил.', engineHp:'293 к.с.', transmission:'Автоматична', fuel:'Бензин', drive:'Повний (4WD)', startCode:'—', startOk:false, acv:'—', bodyExt:'SUV', platformModel:'Grand Cherokee', platformEngine:'3.6L V6', platformDrive:'4WD', saleStatus:'В дорозі', currentBid:22900, localImages:['images/local/1C4RJHBGXPC619954/1.jpg','images/local/1C4RJHBGXPC619954/2.jpg','images/local/1C4RJHBGXPC619954/3.jpg','images/local/1C4RJHBGXPC619954/4.jpg','images/local/1C4RJHBGXPC619954/5.jpg','images/local/1C4RJHBGXPC619954/6.jpg','images/local/1C4RJHBGXPC619954/7.jpg','images/local/1C4RJHBGXPC619954/8.jpg','images/local/1C4RJHBGXPC619954/9.jpg','images/local/1C4RJHBGXPC619954/10.jpg','images/local/1C4RJHBGXPC619954/11.jpg'] },
      '1FMCU0E13TUA17077': { title:'2026 Ford Escape Hybrid', vin:'1FMCU0E13TUA17077', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'—', damage2:'—', odometer:'0 km (нове)', key:'Так', body:'SUV / Кросовер', color:'—', engine:'2.5L, 4 цил.', engineHp:'200 к.с.', transmission:'Автоматична', fuel:'Гібрид', drive:'Передній (FWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'SUV', platformModel:'Escape Hybrid 2026', platformEngine:'2.5L Hybrid', platformDrive:'FWD', saleStatus:'В дорозі', currentBid:22700, localImages:['images/local/1FMCU0E13TUA17077/1.jpg','images/local/1FMCU0E13TUA17077/2.jpg','images/local/1FMCU0E13TUA17077/3.jpg','images/local/1FMCU0E13TUA17077/4.jpg','images/local/1FMCU0E13TUA17077/5.jpg','images/local/1FMCU0E13TUA17077/6.jpg','images/local/1FMCU0E13TUA17077/7.jpg','images/local/1FMCU0E13TUA17077/8.jpg','images/local/1FMCU0E13TUA17077/9.jpg','images/local/1FMCU0E13TUA17077/10.jpg','images/local/1FMCU0E13TUA17077/11.jpg','images/local/1FMCU0E13TUA17077/12.jpg'] },
      '1G1FW6S07H4179725': { title:'2017 Chevrolet Bolt EV', vin:'1G1FW6S07H4179725', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'57,169 mi (92,000 km)', key:'Так', body:'Хетчбек', color:'—', engine:'Електро', engineHp:'200 к.с.', transmission:'Автоматична', fuel:'Електро', drive:'Передній (FWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'Hatchback', platformModel:'Bolt EV', platformEngine:'Electric', platformDrive:'FWD', saleStatus:'В дорозі', currentBid:9800, localImages:['images/local/1G1FW6S07H4179725/1.jpg','images/local/1G1FW6S07H4179725/2.jpg','images/local/1G1FW6S07H4179725/3.jpg','images/local/1G1FW6S07H4179725/4.jpg','images/local/1G1FW6S07H4179725/5.jpg','images/local/1G1FW6S07H4179725/6.jpg','images/local/1G1FW6S07H4179725/7.jpg','images/local/1G1FW6S07H4179725/8.jpg','images/local/1G1FW6S07H4179725/9.jpg','images/local/1G1FW6S07H4179725/10.jpg','images/local/1G1FW6S07H4179725/11.jpg'] },
      '1G1FY6S00P4150432': { title:'2023 Chevrolet Bolt EUV', vin:'1G1FY6S00P4150432', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'29,205 mi (47,000 km)', key:'Так', body:'SUV / Кросовер', color:'—', engine:'Електро', engineHp:'200 к.с.', transmission:'Автоматична', fuel:'Електро', drive:'Передній (FWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'SUV', platformModel:'Bolt EUV', platformEngine:'Electric', platformDrive:'FWD', saleStatus:'В дорозі', currentBid:13850, localImages:['images/local/1G1FY6S00P4150432/1.jpg','images/local/1G1FY6S00P4150432/2.jpg','images/local/1G1FY6S00P4150432/3.jpg','images/local/1G1FY6S00P4150432/4.jpg','images/local/1G1FY6S00P4150432/5.jpg','images/local/1G1FY6S00P4150432/6.jpg','images/local/1G1FY6S00P4150432/7.jpg','images/local/1G1FY6S00P4150432/8.jpg','images/local/1G1FY6S00P4150432/9.jpg','images/local/1G1FY6S00P4150432/10.jpg','images/local/1G1FY6S00P4150432/11.jpg'] },
      '1G1FY6S04P4144827': { title:'2023 Chevrolet Bolt EUV', vin:'1G1FY6S04P4144827', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'70,215 mi (113,000 km)', key:'Так', body:'SUV / Кросовер', color:'—', engine:'Електро', engineHp:'200 к.с.', transmission:'Автоматична', fuel:'Електро', drive:'Передній (FWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'SUV', platformModel:'Bolt EUV', platformEngine:'Electric', platformDrive:'FWD', saleStatus:'В дорозі', currentBid:13300, localImages:['images/local/1G1FY6S04P4144827/1.jpg','images/local/1G1FY6S04P4144827/2.jpg','images/local/1G1FY6S04P4144827/3.jpg','images/local/1G1FY6S04P4144827/4.jpg','images/local/1G1FY6S04P4144827/5.jpg','images/local/1G1FY6S04P4144827/6.jpg','images/local/1G1FY6S04P4144827/7.jpg','images/local/1G1FY6S04P4144827/8.jpg','images/local/1G1FY6S04P4144827/9.jpg','images/local/1G1FY6S04P4144827/10.jpg','images/local/1G1FY6S04P4144827/11.jpg','images/local/1G1FY6S04P4144827/12.jpg'] },
      '1GKB0NDE9RU112057': { title:'2024 Hummer EV SUV', vin:'1GKB0NDE9RU112057', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'9,942 mi (16,000 km)', key:'Так', body:'SUV / Пікап', color:'—', engine:'Електро', engineHp:'830 к.с.', transmission:'Автоматична', fuel:'Електро', drive:'Повний (AWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'SUV', platformModel:'Hummer EV SUV', platformEngine:'Electric AWD', platformDrive:'AWD', saleStatus:'В дорозі', currentBid:37100, localImages:['images/local/1GKB0NDE9RU112057/1.jpg','images/local/1GKB0NDE9RU112057/2.jpg','images/local/1GKB0NDE9RU112057/3.jpg','images/local/1GKB0NDE9RU112057/4.jpg','images/local/1GKB0NDE9RU112057/5.jpg','images/local/1GKB0NDE9RU112057/6.jpg','images/local/1GKB0NDE9RU112057/7.jpg','images/local/1GKB0NDE9RU112057/8.jpg','images/local/1GKB0NDE9RU112057/9.jpg','images/local/1GKB0NDE9RU112057/10.jpg','images/local/1GKB0NDE9RU112057/11.jpg','images/local/1GKB0NDE9RU112057/12.jpg'] },
      '1V25MPE83PC028416': { title:'2023 Volkswagen ID.4', vin:'1V25MPE83PC028416', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'31,699 mi (51,000 km)', key:'Так', body:'SUV / Кросовер', color:'—', engine:'Електро', engineHp:'201 к.с.', transmission:'Автоматична', fuel:'Електро', drive:'Задній (RWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'SUV', platformModel:'ID.4', platformEngine:'Electric RWD', platformDrive:'RWD', saleStatus:'В дорозі', currentBid:18500, localImages:['images/local/1V25MPE83PC028416/1.jpg','images/local/1V25MPE83PC028416/2.jpg','images/local/1V25MPE83PC028416/3.jpg','images/local/1V25MPE83PC028416/4.jpg','images/local/1V25MPE83PC028416/5.jpg','images/local/1V25MPE83PC028416/6.jpg','images/local/1V25MPE83PC028416/7.jpg','images/local/1V25MPE83PC028416/8.jpg','images/local/1V25MPE83PC028416/9.jpg','images/local/1V25MPE83PC028416/10.jpg','images/local/1V25MPE83PC028416/11.jpg'] },
      '1VWSA7A38MC008663': { title:'2021 Volkswagen Passat', vin:'1VWSA7A38MC008663', lot:'Локальний', auction:'LOCAL', location:'Варшава, Польща', origin:'США', distance:'В дорозі', delivery:'Готовий до огляду', endDate:'—', endTimestamp:null, seller:"BIDDER", docs:'Є', docsOk:true, damage1:'Є пошкодження', damage2:'—', odometer:'95,086 mi (153,000 km)', key:'Так', body:'Седан', color:'—', engine:'2.0L, 4 цил.', engineHp:'174 к.с.', transmission:'Автоматична', fuel:'Бензин', drive:'Передній (FWD)', startCode:'—', startOk:false, acv:'—', bodyExt:'Sedan', platformModel:'Passat', platformEngine:'2.0L TSI', platformDrive:'FWD', saleStatus:'В дорозі', currentBid:12500, localImages:['images/local/1VWSA7A38MC008663/1.jpg','images/local/1VWSA7A38MC008663/2.jpg','images/local/1VWSA7A38MC008663/3.jpg','images/local/1VWSA7A38MC008663/4.jpg','images/local/1VWSA7A38MC008663/5.jpg','images/local/1VWSA7A38MC008663/6.jpg','images/local/1VWSA7A38MC008663/7.jpg','images/local/1VWSA7A38MC008663/8.jpg','images/local/1VWSA7A38MC008663/9.jpg','images/local/1VWSA7A38MC008663/10.jpg','images/local/1VWSA7A38MC008663/11.jpg','images/local/1VWSA7A38MC008663/12.jpg'] }
    };
    

    function loadLocalCar(vin) {
      const localCar = LOCAL_CARS[vin];
      if (!localCar) return;

      // Adapt local car to loadCar() format using count/folder trick
      // We manually set gallery after loadCar
      const carObj = Object.assign({}, localCar, {
        count: 0,  // skip folder-based gallery build
        folder: '',
        prefix: '',
        estimate: [localCar.currentBid, Math.round(localCar.currentBid * 1.25)],
        endDate: '—',
        endTimestamp: null
      });
      loadCar(carObj);

      // Override gallery with local image paths
      galleryImages = localCar.localImages;
      galleryIndex = 0;
      renderGallery();
      document.getElementById('galleryShowAll').textContent =
        'Показати всі фото (' + localCar.localImages.length + ')';

      // Override auction badge
      const badge = document.getElementById('carAuctionBadge');
      badge.style.cssText = 'background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.25);border-radius:6px;font-size:11px;font-weight:700;padding:3px 8px;letter-spacing:0.06em';
      badge.textContent = 'В НАЯВНОСТІ';

      // Sidebar: replace bid button with contact
      const bidBtn = document.querySelector('.bid-action-btn');
      if (bidBtn) {
        bidBtn.textContent = 'Зателефонувати';
        bidBtn.onclick = () => { window.location.href = 'tel:+380685878888'; };
      }

      setCurrentCarContext({
        title: localCar.title,
        vin: localCar.vin,
        lotId: localCar.lot,
        make: (localCar.title || '').split(/\s+/)[1] || '',
        model: (localCar.title || '').split(/\s+/).slice(2).join(' '),
        year: extractYear(localCar),
        fuel: localCar.fuel || '',
        price: safeNum(localCar.currentBid),
        images: galleryImages.slice(),
        sourceType: 'local'
      });
    }

    /* ════════════════════════════════════════════════
       BOOT
    ════════════════════════════════════════════════ */
    // ── Load parser car from cars_parser.json ────────────────────
    async function loadParserCar(vin) {
      const normalizedVin = String(vin || '').trim().toUpperCase();
      const sources = ['data/parser/cars_transit.json', 'data/cars_parser.json'];
      let car = null;

      async function fetchParserDetailImages(parserCar) {
        const ids = [];
        const pushId = function(value) {
          const raw = String(value || '').trim();
          if (!raw) return;
          const match = raw.match(/(\d{2,})$/);
          const id = match ? match[1] : raw;
          if (/^\d+$/.test(id) && !ids.includes(id)) ids.push(id);
        };

        pushId(parserCar && parserCar.external_id);
        pushId(parserCar && parserCar.id);

        for (let i = 0; i < ids.length; i += 1) {
          try {
            const detailResp = await fetch(PARSER_IN_ROUTE_API_BASE + '/api/cars/in-route/' + ids[i], { cache: 'no-cache' });
            if (!detailResp.ok) continue;
            const detail = await detailResp.json();

            const main = detail && detail.mainPhoto && detail.mainPhoto.link ? [detail.mainPhoto.link] : [];
            const photos = Array.isArray(detail && detail.photos)
              ? detail.photos.map(function(photo) { return photo && photo.link; }).filter(Boolean)
              : [];

            const merged = main.concat(photos);
            if (merged.length) return merged;
          } catch (_) {
            // Try next id candidate
          }
        }

        return [];
      }

      for (let i = 0; i < sources.length; i += 1) {
        try {
          const resp = await fetch(sources[i], { cache: 'no-cache' });
          if (!resp.ok) continue;
          const cars = await resp.json();
          if (!Array.isArray(cars)) continue;

          car = cars.find(c => String(c && c.vin || '').trim().toUpperCase() === normalizedVin);
          if (car) break;
        } catch (_) {
          // Try next source
        }
      }

      if (!car) return false;

      // Fill page title / breadcrumb
      document.title = car.title + ' — BIDDER';
      const bc = document.getElementById('bcCarTitle');
      if (bc) bc.textContent = car.title;

      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || '—'; };
      setTxt('carTitleMain', car.title);
      setTxt('carVin',       car.vin);
      setTxt('carLot',       'Парсер');
      setTxt('carLocation',  car.location || 'Варшава, Польща');
      setTxt('carOrigin',    'США');
      setTxt('carDistance',  'В дорозі');
      setTxt('carDelivery',  'Готовий до огляду');

      const badge = document.getElementById('carAuctionBadge');
      if (badge) { badge.style.cssText='background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.25);border-radius:6px;font-size:11px;font-weight:700;padding:3px 8px'; badge.textContent='В ДОРОЗІ'; }

      const auctDir = document.getElementById('auctionDirectDate');
      if (auctDir) auctDir.textContent = '—';

      // Specs table
      setTxt('sLot',      'Парсер');
      setTxt('sVin',      car.vin);
      setTxt('sSeller',   car.seller || 'BIDDER');
      setTxt('sDamage1',  '—');
      setTxt('sDamage2',  '—');
      setTxt('sOdometer', car.mileage ? car.mileage + ' km' : '—');

      const docsEl = document.getElementById('sDocs');
      if (docsEl) { docsEl.textContent = 'Є'; docsEl.className = 'spec-value doc-ok'; }

      setTxt('sKey',          'Так');
      setTxt('sBodyStyle',    '—');
      setTxt('sColor',        '—');
      setTxt('sEngine',       car.engine || '—');
      setTxt('sEngineHp',     '—');
      setTxt('sTransmission', car.transmission || 'Автоматична');
      setTxt('sFuel',         car.fuel || 'Бензин');
      setTxt('sDrive',        car.drive || '—');

      // Gallery
      const baseImages = (car.images || []).map(function (pathValue) {
        var path = String(pathValue || '').trim();
        if (!path) return '';
        if (/^https?:\/\//i.test(path) || path.startsWith('/')) return path;
        if (path.startsWith('images/')) return path;
        return 'images/' + path;
      }).filter(Boolean);

      const detailImages = await fetchParserDetailImages(car);
      const seen = new Set();
      galleryImages = baseImages.concat(detailImages).filter(function(src) {
        if (!src || seen.has(src)) return false;
        seen.add(src);
        return true;
      });

      galleryIndex  = 0;
      if (typeof renderGallery === 'function') renderGallery();
      const showAll = document.getElementById('galleryShowAll');
      if (showAll) showAll.textContent = 'Показати всі фото (' + galleryImages.length + ')';

      // Price
      const bidEl = document.getElementById('currentBidVal');
      if (bidEl) bidEl.textContent = '$' + Number(car.price || 0).toLocaleString('en-US');

      // Hide bid block, show contact
      const bidBtn = document.querySelector('.bid-action-btn');
      if (bidBtn) { bidBtn.textContent = 'Зателефонувати'; bidBtn.onclick = () => { window.location.href='tel:+380685878888'; }; }

      setCurrentCarContext({
        title: car.title,
        vin: car.vin,
        lotId: car.id || car.external_id || '',
        make: car.make || (String(car.title || '').split(/\s+/)[1] || ''),
        model: car.model || '',
        year: car.year || extractYear(car),
        fuel: car.fuel || '',
        price: safeNum(car.price),
        images: galleryImages.slice(),
        sourceType: 'parser'
      });

      return true;
    }

    (async function boot() {
      primeCalculatorReferenceData();
      const route = parseCarRouteParams();
      const lotId = route.lotId;
      const vin = route.vin;

      if (vin && LOCAL_CARS[vin]) {
        // Local hardcoded car (10 catalog cars)
        loadLocalCar(vin);
      } else if (vin) {
        // Try parser cars from JSON
        try {
          const found = await loadParserCar(vin);
          if (!found) {
            const carId = getCarId();
            loadCar(CARS.find(c=>c.id===carId)||CARS[0]);
            markRouteAsNotFound(route);
          }
        } catch(e) {
          console.error('Parser car load failed:', e);
          loadCar(CARS[0]);
          markRouteAsNotFound(route);
        }
      } else if (lotId) {
        try {
          const apiData = await loadApiCar(lotId);
          applyApiCarToPage(apiData);
        } catch(e) {
          console.error('API car load failed:', e);
          loadCar(CARS[0]);
          markRouteAsNotFound(route);
        }
      } else {
        const carId = getCarId();
        const car = CARS.find(c => c.id === carId) || CARS[0];
        loadCar(car);
      }
    })();

/* ════ LIGHTBOX ════ */
  /* ════ LIGHTBOX ════ */
  (function(){
    const overlay = document.getElementById('lbOverlay');
    const img     = document.getElementById('lbImg');
    const counter = document.getElementById('lbCounter');
    let lbImages = [], lbIdx = 0;

    function openLb(images, startIdx) {
      lbImages = images; lbIdx = startIdx || 0;
      showLb();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    function showLb() {
      img.classList.add('loading');
      img.src = lbImages[lbIdx];
      img.onload = () => img.classList.remove('loading');
      counter.textContent = (lbIdx+1) + ' / ' + lbImages.length;
    }
    function prevLb() { lbIdx = (lbIdx - 1 + lbImages.length) % lbImages.length; showLb(); }
    function nextLb() { lbIdx = (lbIdx + 1) % lbImages.length; showLb(); }

    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbPrev').addEventListener('click', prevLb);
    document.getElementById('lbNext').addEventListener('click', nextLb);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeLb(); });
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') prevLb();
      if (e.key === 'ArrowRight') nextLb();
    });

    // Touch swipe
    let tsX = 0;
    overlay.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tsX;
      if (Math.abs(dx) > 40) { dx < 0 ? nextLb() : prevLb(); }
    }, { passive: true });

    // Expose globally so gallery can call it
    window.openLightbox = openLb;
  })();

  /* ════ GALLERY CLICK → LIGHTBOX + "Показати всі фото" fix ════ */
  (function(){
    const mainImg  = document.getElementById('galleryMain');
    const showAllBtn = document.getElementById('galleryShowAll');
    const THUMB_LIMIT = 12;

    // Click on main photo → open lightbox
    if (mainImg) {
      mainImg.style.cursor = 'zoom-in';
      mainImg.addEventListener('click', () => {
        if (window.galleryImages && window.galleryImages.length)
          window.openLightbox(window.galleryImages, window.galleryIndex || 0);
      });
    }

    // Override renderGallery to update "Показати всі фото" button correctly
    const origRender = window.renderGallery;
    window.renderGalleryWithFix = function() {
      if (origRender) origRender();
      // Update showAll button
      if (!showAllBtn) return;
      const total = window.galleryImages ? window.galleryImages.length : 0;
      if (total <= THUMB_LIMIT) {
        showAllBtn.style.display = 'none';
      } else {
        const hidden = total - THUMB_LIMIT;
        showAllBtn.style.display = '';
        showAllBtn.textContent = 'Показати всі фото (+' + hidden + ')';
      }
    };

    // showAll button → open lightbox at index 0
    if (showAllBtn) {
      showAllBtn.addEventListener('click', e => {
        e.preventDefault();
        if (window.galleryImages && window.galleryImages.length)
          window.openLightbox(window.galleryImages, window.galleryIndex || 0);
      });
    }
  })();

    /* ── Active nav item: local VIN → Авто в дорозі, иначе → Каталог авто ── */
    (function() {
      const route = parseCarRouteParams();
      const vin = route.vin;
      const isLocal = vin && typeof LOCAL_CARS !== 'undefined' && LOCAL_CARS[vin];
      document.getElementById(isLocal ? 'navAvailable' : 'navCatalog')
        .classList.add('act');
    })();
