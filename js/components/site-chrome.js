(function () {
  'use strict';

  function currentPage() {
    var file = window.location.pathname.split('/').pop();
    return file || 'index.html';
  }

  function isHomePage(page) {
    return page === 'index.html' || page === '';
  }

  function navHref(page, hash) {
    return isHomePage(page) ? hash : 'index.html' + hash;
  }

  function activeClass(page, target) {
    if (page === 'car.html') return '';
    return page === target ? ' class="act"' : '';
  }

  function activeMobileClass(page, target) {
    if (page === 'car.html') return 'mobile-nav-link';
    return page === target ? 'mobile-nav-link active' : 'mobile-nav-link';
  }

  function renderHeader(page) {
    var faqHref = navHref(page, '#faq');
    var contactHref = navHref(page, '#contact');

    return '' +
      '<header class="hdr">' +
        '<div class="hdr-in">' +
          '<a href="index.html" class="logo">' +
            '<img src="images/logo-carwaw-black.png" alt="BIDDER" style="height:54px;width:auto;object-fit:contain;" />' +
          '</a>' +
          '<nav class="nav-main" id="mainNav">' +
            '<a href="index.html"' + activeClass(page, 'index.html') + '>Головна</a>' +
            '<a href="catalog-available.html" id="navAvailable"' + activeClass(page, 'catalog-available.html') + '>Авто в дорозі</a>' +
            '<a href="calculator.html" id="navCalculator"' + activeClass(page, 'calculator.html') + '>Калькулятор</a>' +
            '<a href="' + faqHref + '">FAQ</a>' +
            '<a href="' + contactHref + '">Контакти</a>' +
          '</nav>' +
          '<div class="hdr-socials">' +
            '<a href="tel:+48784890644" class="hdr-soc-btn" title="Телефон">' +
              '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
            '</a>' +
            '<a href="https://wa.me/48784890644" class="hdr-soc-btn" title="WhatsApp">' +
              '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.126 1.528 5.855L.057 23.272a.75.75 0 00.921.921l5.417-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.705 9.705 0 01-4.949-1.354l-.355-.21-3.676.998 1.007-3.574-.229-.368A9.708 9.708 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>' +
            '</a>' +
            '<a href="https://www.facebook.com/" class="hdr-soc-btn" title="Facebook">' +
              '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>' +
            '</a>' +
            '<a href="https://www.instagram.com/" class="hdr-soc-btn" title="Instagram">' +
              '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>' +
            '</a>' +
            '<a href="https://www.tiktok.com/" class="hdr-soc-btn" title="TikTok">' +
              '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.16 8.16 0 004.77 1.52V6.78a4.85 4.85 0 01-1-.09z"/></svg>' +
            '</a>' +
          '</div>' +
          '<div class="hdr-right">' +
            '<a href="tel:+48784890644" class="hdr-phone">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
              '+48 784 890 644' +
            '</a>' +
            '<div class="lang-switch" id="langSwitch" aria-label="Language">' +
              '<button class="lang-trigger" id="langTrigger" onclick="event.stopPropagation();document.getElementById(\'langSwitch\').classList.toggle(\'open\')" aria-haspopup="true">' +
                '<span id="langLabel">PL</span>' +
                '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5l3 3 3-3"/></svg>' +
              '</button>' +
              '<div class="lang-menu" id="langMenu">' +
                '<button class="lang-btn" data-lang="pl" onclick="setLang(\'pl\')">PL</button>' +
                '<button class="lang-btn" data-lang="uk" onclick="setLang(\'uk\')">UK</button>' +
                '<button class="lang-btn" data-lang="en" onclick="setLang(\'en\')">EN</button>' +
              '</div>' +
            '</div>' +
            '<a href="' + contactHref + '" class="btn-ora">Зв\'язатися</a>' +
            '<button class="menu-btn" id="menuBtn" aria-label="Відкрити меню" aria-expanded="false">' +
              '<span></span><span></span><span></span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="mobile-menu-backdrop" id="mobileMenuBackdrop"></div>' +
      '<nav class="mobile-nav-panel" id="mobileNavPanel" aria-label="Мобільне меню">' +
        '<div class="mobile-nav-links">' +
          '<a href="index.html" class="' + activeMobileClass(page, 'index.html') + '">Головна</a>' +
          '<a href="catalog-available.html" id="mobileNavAvailable" class="' + activeMobileClass(page, 'catalog-available.html') + '">Авто в дорозі</a>' +
          '<a href="calculator.html" id="mobileNavCalculator" class="' + activeMobileClass(page, 'calculator.html') + '">Калькулятор</a>' +
          '<a href="' + faqHref + '" class="mobile-nav-link">FAQ</a>' +
          '<a href="' + contactHref + '" class="mobile-nav-link">Контакти</a>' +
        '</div>' +
        '<div class="mobile-nav-contact">' +
          '<a href="tel:+48784890644" class="mobile-nav-phone">+48 784 890 644</a>' +
          '<a href="tel:+48571660242" class="mobile-nav-phone">+48 571 660 242</a>' +
          '<a href="' + contactHref + '" class="btn-ora" style="display:flex;align-items:center;justify-content:center;margin-top:4px;">Зв\'язатися</a>' +
        '</div>' +
        '<div class="mobile-nav-lang">' +
          '<span class="mobile-nav-lang-label">Мова</span>' +
          '<div class="mobile-lang-btns">' +
            '<button class="lang-btn" data-lang="pl" onclick="setLang(\'pl\')">PL</button>' +
            '<button class="lang-btn" data-lang="uk" onclick="setLang(\'uk\')">UK</button>' +
            '<button class="lang-btn" data-lang="en" onclick="setLang(\'en\')">EN</button>' +
          '</div>' +
        '</div>' +
      '</nav>';
  }

  function renderFooter() {
    return '' +
      '<footer class="footer">' +
        '<div class="footer-in">' +
          '<div class="footer-grid">' +
            '<div>' +
              '<div class="footer-logo">' +
                  '<img src="images/logo-carwaw-white.png" alt="BIDDER" style="height:68px;width:auto;object-fit:contain;" />' +
              '</div>' +
              '<p class="footer-tag">Ваш надійний партнер в імпорті авто з аукціонів США, Китаю та Європи з 2013 року.</p>' +
              '<div class="footer-soc">' +
                '<a class="fsoc" href="#"><svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M21.198 2.433a2.242 2.242 0 00-1.022.215l-16.5 6.925a2.25 2.25 0 00.153 4.218l3.982 1.23 2.005 6.019a1 1 0 001.782.258l2.695-3.417 4.203 3.102a2.25 2.25 0 003.516-1.418l2.25-14.625a2.25 2.25 0 00-4.064-1.507z"/></svg></a>' +
                '<a class="fsoc" href="#"><svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg></a>' +
                '<a class="fsoc" href="#"><svg viewBox="0 0 24 24" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>' +
                '<a class="fsoc" href="#"><svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>' +
              '</div>' +
            '</div>' +
            '<div class="fcol">' +
              '<h4>Навігація</h4>' +
              '<ul>' +
                '<li><a href="index.html">Головна</a></li>' +
                '<li><a href="catalog.html">Каталог авто</a></li>' +
                '<li><a href="catalog-available.html">Авто в дорозі</a></li>' +
                '<li><a href="blog.html">Блог</a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="fcol">' +
              '<h4>Напрямки</h4>' +
              '<ul>' +
                '<li><a href="catalog.html">Авто з США</a></li>' +
                '<li><a href="catalog.html">Авто з Китаю</a></li>' +
                '<li><a href="catalog.html">Авто з Європи</a></li>' +
                '<li><a href="catalog.html">Мото та RORO</a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="fcol">' +
              '<h4>Контакт</h4>' +
              '<p class="fline">Jawczyce, ul. Poznańska, 56, 05-850, Polska</p>' +
              '<p class="fline"><a href="tel:+48784890644">+48 784 890 644</a></p>' +
              '<p class="fline"><a href="tel:+48571660242">+48 571 660 242</a></p>' +
              '<p class="fline"><a href="mailto:info@bidders.pl">info@bidders.pl</a></p>' +
              '<p class="fline"><a href="mailto:sales@bidders.pl">sales@bidders.pl</a></p>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bot">' +
            '<span>© 2026 BIDDER. Всі права захищено.</span>' +
            '<div>' +
              '<a href="#">Політика конфіденційності</a>' +
              '<a href="#">Умови використання</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-brands">' +
            '<img src="images/copart-logo.png" alt="Copart" />' +
            '<img src="images/copart-logo.png" alt="Copart" />' +
            '<img src="images/copart-logo.png" alt="Copart" />' +
            '<img src="images/copart-logo.png" alt="Copart" />' +
            '<img src="images/copart-logo.png" alt="Copart" />' +
            '<img src="images/copart-logo.png" alt="Copart" />' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  var page = currentPage();
  var headerTarget = document.getElementById('siteHeader') || document.querySelector('header.hdr');
  var footerTarget = document.getElementById('siteFooter') || document.querySelector('footer.footer');

  if (headerTarget) {
    headerTarget.outerHTML = renderHeader(page);
  }

  if (footerTarget) {
    footerTarget.outerHTML = renderFooter();
  }
})();
