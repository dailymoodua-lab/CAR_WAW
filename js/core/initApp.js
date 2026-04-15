/* ═══════════════════════════════════════════════════════
   Car Auctions — App Orchestrator
   Detects current page and bootstraps the right modules.
   ═══════════════════════════════════════════════════════ */

/**
 * Detect current page name from URL pathname.
 * Returns: 'index' | 'catalog' | 'catalog-available' | 'car' | 'blog'
 */
function detectPage() {
  var name = location.pathname.split('/').pop().replace(/\.html$/i, '');
  if (!name || name === '/' || name === '') return 'index';
  return name;
}

/* ─── Common component init ─────────────────────────── */

/** FAQ accordion — shared across all pages */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(function(item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i) {
        i.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });
}

/** Smooth-scroll for anchor nav links (in-page) */
function initAnchorNav() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/** Burger / mobile nav panel */
function initMobileNav() {
  var btn = document.getElementById('menuBtn');
  if (!btn || btn._navInit) return;
  btn._navInit = true;
  var panel = document.getElementById('mobileNavPanel');
  var backdrop = document.getElementById('mobileMenuBackdrop');
  if (!panel) return;

  function closeMenu() {
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  btn.addEventListener('click', function() {
    var isOpen = panel.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
    }
  });

  if (backdrop) backdrop.addEventListener('click', closeMenu);
  document.querySelectorAll('#mobileNavPanel a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) closeMenu();
  });
}

/** Lang dropdown close-on-outside-click */
function initLangDropdown() {
  document.addEventListener('click', function(e) {
    var ls = document.getElementById('langSwitch');
    if (ls && !ls.contains(e.target)) ls.classList.remove('open');
  });
}

/** Top bar close button */
function initTopBar() {
  var btn = document.querySelector('.top-bar-close');
  var bar = document.querySelector('.top-bar');
  if (btn && bar) {
    btn.addEventListener('click', function() {
      bar.style.display = 'none';
    });
  }
}

/* ─── Main orchestrator ─────────────────────────────── */

/**
 * Bootstrap the application.
 * Auto-detects page and invokes its init module.
 */
function initApp() {
  var page = detectPage();
  document.documentElement.dataset.page = page;

  /* common init for all pages */
  initFaq();
  initAnchorNav();
  initTopBar();
  initMobileNav();
  initLangDropdown();

  /* per-page init */
  switch (page) {
    case 'catalog':
      if (window.CatalogPage) CatalogPage.init();
      break;

    case 'catalog-available':
      if (window.CatalogAvailablePage) CatalogAvailablePage.init();
      break;

    case 'car':
      /* car.js handles its own DOMContentLoaded init */
      break;

    case 'blog':
      if (window.BlogPage) BlogPage.init();
      break;

    case 'index':
    default:
      if (window.IndexPage) IndexPage.init();
      break;
  }
}

/* auto-start */
document.addEventListener('DOMContentLoaded', initApp);
