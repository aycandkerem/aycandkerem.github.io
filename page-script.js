(() => {
  const lang = () => localStorage.getItem('aycaKeremLanguage') === 'en' ? 'en' : 'tr';
  const applyLanguage = () => {
    const current = lang();
    document.documentElement.lang = current;
    document.querySelectorAll('[data-tr][data-en]').forEach(element => {
      const value = element.dataset[current];
      if (value) element.textContent = value;
    });
    document.querySelectorAll('[data-page-language]').forEach(button => {
      const active = button.dataset.pageLanguage === current;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  document.querySelectorAll('[data-page-language]').forEach(button => button.addEventListener('click', () => {
    localStorage.setItem('aycaKeremLanguage', button.dataset.pageLanguage);
    location.reload();
  }));
  applyLanguage();

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
    const open = !nav.classList.contains('open');
    closeMenu();
    if (open) {
      nav.classList.add('open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 30), { passive: true });
  addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  document.querySelectorAll('[data-case-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-case-filter]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.caseFilter;
    document.querySelectorAll('.case-study-row').forEach(row => {
      row.hidden = filter !== 'all' && row.dataset.category !== filter;
    });
  }));

  const modal = document.getElementById('pageVideoModal');
  const modalVideo = modal?.querySelector('video');
  const closeModal = () => {
    if (!modal || !modalVideo) return;
    modal.classList.remove('open');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.case-play-large').forEach(button => button.addEventListener('click', () => {
    modalVideo.src = button.dataset.video;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalVideo.play().catch(() => {});
  }));
  modal?.querySelector('.page-video-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    const video = entry.target.querySelector?.('video');
    video?.play().catch(() => {});
    observer.unobserve(entry.target);
  }), { threshold: .12 });
  document.querySelectorAll('.reveal,.case-study-row').forEach(element => observer.observe(element));
})();
