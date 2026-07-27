
const header=document.getElementById('siteHeader'),menuToggle=document.getElementById('menuToggle'),mainNav=document.getElementById('mainNav');window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});menuToggle?.addEventListener('click',()=>mainNav.classList.toggle('open'));mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>ro.observe(e));const vo=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.src&&v.dataset.src){v.src=v.dataset.src;v.load()}v.play().catch(()=>{})}else v.pause()}),{rootMargin:'250px 0px',threshold:.35});document.querySelectorAll('.portfolio-video').forEach(v=>vo.observe(v));document.querySelectorAll('.filter-button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter-button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.portfolio-item').forEach(i=>i.classList.toggle('hidden',!(b.dataset.filter==='all'||i.dataset.category===b.dataset.filter)))}));const modal=document.getElementById('videoModal'),mv=document.getElementById('modalVideo');document.querySelectorAll('.video-open').forEach(b=>b.addEventListener('click',()=>{mv.src=b.dataset.video;modal.classList.add('open');document.body.style.overflow='hidden';mv.play().catch(()=>{})}));document.querySelectorAll('[data-close-modal]').forEach(x=>x.addEventListener('click',()=>{modal.classList.remove('open');mv.pause();mv.removeAttribute('src');document.body.style.overflow=''}));const track=document.querySelector('.logo-track');if(track)[...track.children].forEach(i=>track.appendChild(i.cloneNode(true)));document.querySelectorAll('.brand-item img').forEach(i=>i.addEventListener('error',()=>i.style.display='none'));


// Language system
(() => {
  const translations = window.SITE_TRANSLATIONS || {};
  const popup = document.getElementById('languagePopup');
  const languageButtons = document.querySelectorAll('[data-language]');
  const popupButtons = document.querySelectorAll('[data-popup-language]');

  const applyLanguage = (language) => {
    const lang = language === 'en' ? 'en' : 'tr';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const entry = translations[element.dataset.i18n];
      if (entry && typeof entry[lang] === 'string') {
        element.textContent = entry[lang];
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const entry = translations[element.dataset.i18nAria];
      if (entry && entry[lang]) element.setAttribute('aria-label', entry[lang]);
    });

    document.querySelectorAll('[data-i18n-content]').forEach((element) => {
      const entry = translations[element.dataset.i18nContent];
      if (entry && entry[lang]) element.setAttribute('content', entry[lang]);
    });

    const titleEntry = translations['meta.title'];
    if (titleEntry && titleEntry[lang]) document.title = titleEntry[lang];

    languageButtons.forEach((button) => {
      const active = button.dataset.language === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    localStorage.setItem('aycaKeremLanguage', lang);
  };

  const closePopup = () => {
    popup?.classList.remove('open');
    document.body.classList.remove('language-popup-open');
    sessionStorage.setItem('aycaKeremLanguagePromptSeen', 'true');
  };

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.language));
  });

  popupButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.popupLanguage);
      closePopup();
    });
  });

  // The site always opens in Turkish by default.
  applyLanguage('tr');

  // Ask once per browser session.
  if (!sessionStorage.getItem('aycaKeremLanguagePromptSeen')) {
    requestAnimationFrame(() => {
      popup?.classList.add('open');
      document.body.classList.add('language-popup-open');
    });
  }
})();


// Final interaction refinements
(() => {
  // Fade the hero video in when the browser has enough data to display it.
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    const revealHeroVideo = () => heroVideo.classList.remove('is-loading');
    if (heroVideo.readyState >= 2) {
      revealHeroVideo();
    } else {
      heroVideo.addEventListener('loadeddata', revealHeroVideo, { once: true });
      heroVideo.addEventListener('canplay', revealHeroVideo, { once: true });
    }
  }

  // Allow mouse and touch dragging on the continuously moving logo marquee.
  const marquee =
    document.querySelector('.brand-marquee') ||
    document.querySelector('.brands-marquee') ||
    document.querySelector('.marquee');

  if (!marquee) return;

  const track =
    marquee.querySelector('.brand-track') ||
    marquee.querySelector('.marquee-track') ||
    marquee.firstElementChild;

  if (!track) return;

  let dragging = false;
  let pointerStart = 0;
  let scrollStart = 0;
  let resumeTimer = null;

  // We use scrollLeft for direct interaction while preserving the existing CSS animation.
  marquee.style.overflowX = 'auto';
  marquee.style.scrollbarWidth = 'none';
  marquee.style.webkitOverflowScrolling = 'touch';

  const pauseTrack = () => {
    track.style.animationPlayState = 'paused';
  };

  const resumeTrack = () => {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      if (!dragging) track.style.animationPlayState = 'running';
    }, 900);
  };

  const startDrag = (event) => {
    dragging = true;
    pointerStart = event.clientX;
    scrollStart = marquee.scrollLeft;
    marquee.classList.add('is-dragging');
    pauseTrack();
    marquee.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    if (!dragging) return;
    const delta = event.clientX - pointerStart;
    marquee.scrollLeft = scrollStart - delta;
  };

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    marquee.classList.remove('is-dragging');
    marquee.releasePointerCapture?.(event.pointerId);
    resumeTrack();
  };

  marquee.addEventListener('pointerdown', startDrag);
  marquee.addEventListener('pointermove', moveDrag);
  marquee.addEventListener('pointerup', endDrag);
  marquee.addEventListener('pointercancel', endDrag);
  marquee.addEventListener('pointerleave', endDrag);

  marquee.addEventListener('mouseenter', pauseTrack);
  marquee.addEventListener('mouseleave', resumeTrack);
  marquee.addEventListener('touchstart', pauseTrack, { passive: true });
  marquee.addEventListener('touchend', resumeTrack, { passive: true });
})();
