/* ═══════════════════════════════════════════
   AUTH MODAL — Car Auctions  v2
   2 режими: Вхід / Реєстрація
   Aurora canvas + glassmorphism
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Inject HTML ───────────────────────────────── */
  const html = `
  <div class="auth-overlay" id="authOverlay">
    <div class="auth-dim" id="authDim"></div>

    <div class="auth-modal" id="authModal" role="dialog" aria-modal="true">
      <button class="auth-close" id="authClose" aria-label="Закрити">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Logo -->
      <div class="auth-logo">
        <img src="images/logo-carwaw-black.png" alt="BIDDER" />
      </div>

      <h2 class="auth-title" id="authTitle">Вхід</h2>
      <p class="auth-subtitle" id="authSubtitle">Увійдіть до свого особистого кабінету</p>

      <form class="auth-form" id="authForm" autocomplete="on" novalidate>

        <!-- Name (register only) -->
        <div class="auth-field auth-field-reg" id="fieldName" style="display:none">
          <label for="authName">Ім'я та прізвище</label>
          <div class="auth-input-wrap">
            <input type="text" id="authName" name="name" placeholder="Ваше ім'я" autocomplete="name" />
            <svg class="auth-input-icon" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5.5" r="3" stroke="currentColor" stroke-width="1.3"/>
              <path d="M1.5 14.5c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- Email -->
        <div class="auth-field">
          <label for="authEmail">Email</label>
          <div class="auth-input-wrap">
            <input type="email" id="authEmail" name="email" placeholder="your@email.com" autocomplete="email" />
            <svg class="auth-input-icon" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/>
              <path d="M1 5l7 5 7-5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- Phone (register only) -->
        <div class="auth-field auth-field-reg" id="fieldPhone" style="display:none">
          <label for="authPhone">Телефон</label>
          <div class="auth-input-wrap">
            <input type="tel" id="authPhone" name="phone" placeholder="+48 000 000 000" autocomplete="tel" />
            <svg class="auth-input-icon" viewBox="0 0 16 16" fill="none">
              <path d="M3 2h3l1.5 3.5L6 7a9 9 0 003 3l1.5-1.5L14 10v3a1 1 0 01-1 1A12 12 0 012 3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Password -->
        <div class="auth-field">
          <label for="authPassword">Пароль</label>
          <div class="auth-input-wrap">
            <input type="password" id="authPassword" name="password" placeholder="••••••••"
              autocomplete="current-password" />
            <svg class="auth-input-icon toggle-pw" id="togglePw" viewBox="0 0 16 16" fill="none"
              style="pointer-events:all;cursor:pointer">
              <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" stroke-width="1.3"/>
              <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/>
            </svg>
          </div>
        </div>

        <!-- Confirm password (register only) -->
        <div class="auth-field auth-field-reg" id="fieldConfirm" style="display:none">
          <label for="authConfirm">Підтвердіть пароль</label>
          <div class="auth-input-wrap">
            <input type="password" id="authConfirm" name="confirm" placeholder="••••••••"
              autocomplete="new-password" />
            <svg class="auth-input-icon" viewBox="0 0 16 16" fill="none">
              <rect x="4" y="7" width="8" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- Row: remember + forgot (login only) -->
        <div class="auth-row auth-row-login" id="rowRemember">
          <label class="auth-check-label">
            <input type="checkbox" id="authRemember" name="remember" />
            Запам'ятати мене
          </label>
          <a href="#" class="auth-forgot">Забули пароль?</a>
        </div>

        <!-- Terms (register only) -->
        <div class="auth-field-reg" id="rowTerms" style="display:none">
          <label class="auth-check-label" style="font-size:12px;color:rgba(255,255,255,0.45)">
            <input type="checkbox" id="authTerms" name="terms" />
            Погоджуюсь з <a href="#" style="color:#ffdb16">умовами використання</a>
          </label>
        </div>

        <!-- Submit -->
        <button type="submit" class="auth-submit" id="authSubmitBtn">Увійти</button>

        <div class="auth-divider"><span>або</span></div>

        <!-- Bottom link -->
        <p class="auth-register" id="authBottomText">
          Немає акаунту? <a href="#" id="authSwitchMode">Реєстрація</a>
        </p>

      </form>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);

  /* ── 2. Mode switching ────────────────────────────── */
  let currentMode = 'login'; // 'login' | 'register'

  const regFields  = ['fieldName','fieldPhone','fieldConfirm','rowTerms'];
  const loginOnly  = ['rowRemember'];

  const modes = {
    login: {
      title:    'Вхід',
      subtitle: 'Увійдіть до свого особистого кабінету',
      submit:   'Увійти',
      bottom:   'Немає акаунту?',
      switchTxt:'Реєстрація',
      switchTo: 'register',
      successTxt: '✓ Вхід виконано',
    },
    register: {
      title:    'Реєстрація',
      subtitle: 'Створіть обліковий запис BIDDER',
      submit:   'Створити акаунт',
      bottom:   'Вже маєте акаунт?',
      switchTxt:'Увійти',
      switchTo: 'login',
      successTxt: '✓ Акаунт створено',
    },
  };

  function setMode(mode, animate = true) {
    currentMode = mode;
    const m = modes[mode];

    document.getElementById('authTitle').textContent    = m.title;
    document.getElementById('authSubtitle').textContent = m.subtitle;
    document.getElementById('authSubmitBtn').textContent = m.submit;
    document.getElementById('authSwitchMode').textContent = m.switchTxt;
    document.getElementById('authBottomText').childNodes[0].textContent = m.bottom + ' ';

    /* Show/hide registration fields */
    regFields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (mode === 'register') {
        el.style.maxHeight = '0'; el.style.overflow = 'hidden'; el.style.display = '';
        el.style.opacity = '0'; el.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
        requestAnimationFrame(() => { el.style.maxHeight = '120px'; el.style.opacity = '1'; });
      } else {
        el.style.maxHeight = '0'; el.style.opacity = '0';
        setTimeout(() => { el.style.display = 'none'; }, 340);
      }
    });
    loginOnly.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = mode === 'login' ? '' : 'none';
    });

    /* Shake animation on mode switch */
    if (animate) {
      const modal = document.getElementById('authModal');
      modal.style.transition = 'transform 0.18s ease';
      modal.style.transform  = 'scale(0.98)';
      setTimeout(() => {
        modal.style.transform  = '';
        modal.style.transition = '';
      }, 180);
    }
  }

  document.getElementById('authSwitchMode').addEventListener('click', e => {
    e.preventDefault();
    setMode(currentMode === 'login' ? 'register' : 'login');
  });

  /* ── 4. Open / close ──────────────────────────────── */
  const overlay = document.getElementById('authOverlay');
  const dim     = document.getElementById('authDim');

  function openModal(mode = 'login') {
    setMode(mode, false);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('authEmail')?.focus(), 380);
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('authClose').addEventListener('click', closeModal);
  dim.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
  document.getElementById('authModal').addEventListener('click', e => e.stopPropagation());

  /* ── 5. Hook nav & footer links ───────────────────── */
  const LOGIN_TEXTS    = ['Особистий кабінет', 'Особистий\u00a0кабінет', 'Увійти', 'Войти', 'Личный кабинет', 'Обране', 'Мої ставки', 'Сповіщення'];
  const REGISTER_TEXTS = ['Зареєструватися', 'Реєстрація', 'Register'];

  function hookLinks() {
    document.querySelectorAll('a, button').forEach(el => {
      const text = el.textContent.trim();
      if (REGISTER_TEXTS.includes(text)) {
        el.addEventListener('click', e => { e.preventDefault(); openModal('register'); });
      } else if (LOGIN_TEXTS.includes(text)) {
        el.addEventListener('click', e => { e.preventDefault(); openModal('login'); });
      }
    });
  }
  hookLinks();

  /* ── 6. Password toggle ───────────────────────────── */
  let pwVisible = false;
  document.getElementById('togglePw').addEventListener('click', () => {
    pwVisible = !pwVisible;
    document.getElementById('authPassword').type = pwVisible ? 'text' : 'password';
    document.getElementById('togglePw').style.color = pwVisible ? 'rgba(255,92,0,0.7)' : '';
  });

  /* ── 7. Submit mock ───────────────────────────────── */
  document.getElementById('authForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('authSubmitBtn');
    const m   = modes[currentMode];
    btn.textContent = '...'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = m.successTxt;
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      setTimeout(closeModal, 900);
      setTimeout(() => {
        btn.textContent = m.submit;
        btn.disabled = false;
        btn.style.background = '';
      }, 1500);
    }, 1100);
  });

  /* ── 8. Global API ────────────────────────────────── */
  window.AuthModal = {
    open:  (mode = 'login') => openModal(mode),
    close: closeModal,
  };

})();
