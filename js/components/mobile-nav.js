/* ═══════════════════════════════════════════════════
   MOBILE BOTTOM NAV + CHAT — leechan AUTO
   Magic sliding indicator navigation
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Mobile bottom nav and chat are intentionally disabled.
  return;

  /* ── Current page detection ──────────────────────── */
  const page = window.location.pathname.split('/').pop() || '';
  const isCatalog = page.startsWith('catalog');
  const isBlog    = page.startsWith('blog');
  // car.html → highlight catalog as closest
  const activeBtnId = isCatalog ? 'mnCatalog' : isBlog ? 'mnBlog' : 'mnCatalog';

  /* ── 1. Inject HTML ──────────────────────────────── */
  document.body.insertAdjacentHTML('beforeend', `
  <nav class="m-nav" id="mobileBottomNav" aria-label="Мобільна навігація">
    <div class="m-nav-track" id="mNavTrack">

      <!-- Sliding indicator -->
      <div class="m-nav-indicator" id="mNavIndicator"></div>

      <!-- Home -->
      <button class="m-nav-btn" id="mnHome" data-nav="home" aria-label="Головна">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
          <path d="M9 22V13h6v9"/>
        </svg>
        <span>Головна</span>
      </button>

      <!-- Account -->
      <button class="m-nav-btn" id="mnAccount" data-nav="account" aria-label="Кабінет">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7"/>
        </svg>
        <span>Кабінет</span>
      </button>

      <!-- Chat (center accent) -->
      <button class="m-nav-btn" id="mnChat" data-nav="chat" aria-label="Чат">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <span>Чат</span>
      </button>

      <!-- Catalog -->
      <button class="m-nav-btn" id="mnCatalog" data-nav="catalog" aria-label="Каталог">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
        <span>Каталог</span>
      </button>

      <!-- Phone -->
      <a class="m-nav-btn" id="mnPhone" href="tel:+48505321502" data-nav="phone" aria-label="Дзвінок">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1z"/>
        </svg>
        <span>Дзвінок</span>
      </a>

    </div>
    <div class="m-nav-safe"></div>
  </nav>

  <!-- ── CHAT MODAL ── -->
  <div class="chat-overlay" id="chatOverlay" role="dialog" aria-modal="true" aria-label="Чат">
    <div class="chat-sheet" id="chatSheet">
      <div class="chat-handle"></div>
      <div class="chat-hdr">
        <div class="chat-avatar">🚗</div>
        <div class="chat-hdr-info">
          <div class="chat-hdr-name">leechan AUTO</div>
          <div class="chat-hdr-status">Онлайн-підтримка</div>
        </div>
        <button class="chat-close-btn" id="chatCloseBtn" aria-label="Закрити">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-bubble bot">
          Привіт! Я онлайн-асистент leechan&nbsp;AUTO&nbsp;👋<br>Чим можу допомогти?
          <div class="chat-bubble-time" id="chatInitTime"></div>
        </div>
      </div>
      <div class="chat-input-bar">
        <input class="chat-input" id="chatInput" type="text"
          placeholder="Написати повідомлення…"
          autocomplete="off" enterkeyhint="send" />
        <button class="chat-send-btn" id="chatSendBtn" aria-label="Відправити">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
  `);

  document.getElementById('chatInitTime').textContent = getTime();

  /* ── 2. Magic indicator logic ────────────────────── */
  const track     = document.getElementById('mNavTrack');
  const indicator = document.getElementById('mNavIndicator');
  const allBtns   = track.querySelectorAll('.m-nav-btn');

  // Move indicator under a specific button
  function moveIndicatorTo(btn) {
    const trackRect = track.getBoundingClientRect();
    const btnRect   = btn.getBoundingClientRect();
    // Center of button relative to track, minus half indicator width (25 = 50/2)
    const x = btnRect.left - trackRect.left + (btnRect.width / 2) - 25;
    indicator.style.transform = `translateX(${x}px) translateY(-16px)`;
  }

  // Set active button
  function setActive(btn) {
    allBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    moveIndicatorTo(btn);
  }

  // Set initial active state (no transition on first paint)
  const initBtn = document.getElementById(activeBtnId);
  if (initBtn) {
    indicator.style.transition = 'none';
    setActive(initBtn);
    // Re-enable transition after first frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        indicator.style.transition = '';
      });
    });
  }

  // Re-position on resize (orientation change)
  window.addEventListener('resize', () => {
    const activeBtn = track.querySelector('.m-nav-btn.active');
    if (activeBtn) {
      indicator.style.transition = 'none';
      moveIndicatorTo(activeBtn);
      requestAnimationFrame(() => { indicator.style.transition = ''; });
    }
  });

  /* ── 3. Button click handlers ────────────────────── */
  document.getElementById('mnHome').addEventListener('click', () => {
    setActive(document.getElementById('mnHome'));
    setTimeout(() => { window.location.href = 'index.html'; }, 200);
  });

  document.getElementById('mnAccount').addEventListener('click', () => {
    setActive(document.getElementById('mnAccount'));
    if (window.AuthModal) window.AuthModal.open('login');
  });

  document.getElementById('mnChat').addEventListener('click', () => {
    setActive(document.getElementById('mnChat'));
    openChat();
  });

  document.getElementById('mnCatalog').addEventListener('click', () => {
    setActive(document.getElementById('mnCatalog'));
    if (!isCatalog) setTimeout(() => { window.location.href = 'catalog.html'; }, 200);
  });

  // Phone is an <a> tag — animate indicator on tap
  document.getElementById('mnPhone').addEventListener('click', () => {
    setActive(document.getElementById('mnPhone'));
  });

  /* ── 4. Chat open / close ─────────────────────────── */
  const overlay  = document.getElementById('chatOverlay');
  const sheet    = document.getElementById('chatSheet');
  const input    = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');

  function openChat() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      messages.scrollTop = messages.scrollHeight;
      input.focus();
    }, 460);
  }

  function resetSheetPosition() {
    sheet.style.bottom     = '0px';
    sheet.style.maxHeight  = '';
  }

  function closeChat() {
    input.blur();
    resetSheetPosition();
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Restore nav active state
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) setActive(activeBtn);
  }

  document.getElementById('chatCloseBtn').addEventListener('click', closeChat);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeChat(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeChat();
  });

  /* ── 5. Messages ──────────────────────────────────── */
  function getTime() {
    const d = new Date();
    return d.getHours().toString().padStart(2, '0') + ':' +
           d.getMinutes().toString().padStart(2, '0');
  }

  function addBubble(html, role) {
    const div = document.createElement('div');
    div.className = 'chat-bubble ' + role;
    div.innerHTML = html + '<div class="chat-bubble-time">' + getTime() + '</div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'chat-typing';
    t.id = 'chatTyping';
    t.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(t);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('chatTyping');
    if (t) t.remove();
  }

  const BOT_REPLY =
    'Привіт! Я зараз знаходжусь у тестовому режимі 🤖<br>' +
    'Якщо ти хочеш зі мною спілкуватись — підключи чат-бот.';

  function escapeHTML(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addBubble(escapeHTML(text), 'user');
    showTyping();
    setTimeout(() => { hideTyping(); addBubble(BOT_REPLY, 'bot'); },
      1100 + Math.random() * 700);
  }

  document.getElementById('chatSendBtn').addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(); } });

  /* ── 6. Keyboard / viewport handling (iOS Safari) ── */
  // На iOS position:fixed не реагує на клавіатуру —
  // використовуємо visualViewport щоб вручну підняти sheet над клавіатурою

  function adjustForKeyboard() {
    if (!overlay.classList.contains('open')) return;

    const vv = window.visualViewport;
    // Висота клавіатури = різниця між висотою вікна та видимою областю
    const kbHeight = Math.max(0,
      window.innerHeight - vv.offsetTop - vv.height
    );

    if (kbHeight > 80) {
      // Підняти sheet над клавіатурою
      sheet.style.bottom    = kbHeight + 'px';
      // Обмежити висоту щоб sheet не вийшов за верх екрану
      sheet.style.maxHeight = (vv.height - 20) + 'px';
    } else {
      // Клавіатура закрита — повернути до стандартного стану
      resetSheetPosition();
    }

    // Прокрутити повідомлення до низу
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', adjustForKeyboard, { passive: true });
    window.visualViewport.addEventListener('scroll', adjustForKeyboard, { passive: true });
  }

  // Резервний fallback для старого iOS (немає visualViewport)
  input.addEventListener('focus', () => {
    setTimeout(() => { messages.scrollTop = messages.scrollHeight; }, 400);
  });
  input.addEventListener('blur', () => {
    // Клавіатура закрилась — повернути позицію
    setTimeout(resetSheetPosition, 100);
  });

})();
