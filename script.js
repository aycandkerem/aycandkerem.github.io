(() => {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeMenu = () => {
    nav?.classList.remove('open');
    toggle?.classList.remove('active');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.addEventListener('click', () => {
    const shouldOpen = !nav.classList.contains('open');
    closeMenu();
    if (shouldOpen) {
      nav.classList.add('open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 30), { passive: true });
  addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const translations = window.SITE_TRANSLATIONS || {};
  const popup = document.getElementById('languagePopup');
  const currentLanguage = () => localStorage.getItem('aycaKeremLanguage') === 'en' ? 'en' : 'tr';
  const applyLanguage = language => {
    const lang = language === 'en' ? 'en' : 'tr';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = translations[element.dataset.i18n]?.[lang];
      if (typeof value === 'string') element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const value = translations[element.dataset.i18nAria]?.[lang];
      if (value) element.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-i18n-content]').forEach(element => {
      const value = translations[element.dataset.i18nContent]?.[lang];
      if (value) element.setAttribute('content', value);
    });
    const title = translations['meta.title']?.[lang];
    if (title) document.title = title;
    document.querySelectorAll('[data-language]').forEach(button => {
      const active = button.dataset.language === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  const selectLanguage = language => {
    localStorage.setItem('aycaKeremLanguage', language);
    sessionStorage.setItem('aycaKeremLanguagePromptSeen', 'true');
    popup?.classList.remove('open');
    document.body.classList.remove('language-popup-open');
    applyLanguage(language);
  };
  document.querySelectorAll('[data-language]').forEach(button =>
    button.addEventListener('click', () => selectLanguage(button.dataset.language)));
  document.querySelectorAll('[data-popup-language]').forEach(button =>
    button.addEventListener('click', () => selectLanguage(button.dataset.popupLanguage)));
  applyLanguage(currentLanguage());
  if (!sessionStorage.getItem('aycaKeremLanguagePromptSeen')) {
    requestAnimationFrame(() => {
      popup?.classList.add('open');
      document.body.classList.add('language-popup-open');
    });
  }

  const heroVideo = document.querySelector('.hero-video');
  const showHero = () => heroVideo?.classList.remove('is-loading');
  if (heroVideo?.readyState >= 2) showHero();
  else heroVideo?.addEventListener('loadeddata', showHero, { once: true });

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const track = document.querySelector('.logo-track');
  if (track && !track.dataset.cloned) {
    [...track.children].forEach(item => track.appendChild(item.cloneNode(true)));
    track.dataset.cloned = 'true';
  }
  document.querySelectorAll('.brand-item img').forEach(image =>
    image.addEventListener('error', () => image.closest('.brand-item')?.classList.add('image-missing')));
})();
