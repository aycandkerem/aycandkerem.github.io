
const header=document.getElementById('siteHeader'),menuToggle=document.getElementById('menuToggle'),mainNav=document.getElementById('mainNav');window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});menuToggle?.addEventListener('click',()=>mainNav.classList.toggle('open'));mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>ro.observe(e));const vo=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.src&&v.dataset.src){v.src=v.dataset.src;v.load()}v.play().catch(()=>{})}else v.pause()}),{rootMargin:'250px 0px',threshold:.35});document.querySelectorAll('.portfolio-video').forEach(v=>vo.observe(v));document.querySelectorAll('.filter-button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter-button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.portfolio-item').forEach(i=>i.classList.toggle('hidden',!(b.dataset.filter==='all'||i.dataset.category===b.dataset.filter)))}));const modal=document.getElementById('videoModal'),mv=document.getElementById('modalVideo');document.querySelectorAll('.video-open').forEach(b=>b.addEventListener('click',()=>{mv.src=b.dataset.video;modal.classList.add('open');document.body.style.overflow='hidden';mv.play().catch(()=>{})}));document.querySelectorAll('[data-close-modal]').forEach(x=>x.addEventListener('click',()=>{modal.classList.remove('open');mv.pause();mv.removeAttribute('src');document.body.style.overflow=''}));const track=document.querySelector('.logo-track');if(track)[...track.children].forEach(i=>track.appendChild(i.cloneNode(true)));document.querySelectorAll('.brand-item img').forEach(i=>i.addEventListener('error',()=>i.style.display='none'));


// Language system
(() => {
  const translations = window.SITE_TRANSLATIONS || {};
  const popup = document.getElementById('languagePopup');
  const languageButtons = document.querySelectorAll('[data-language]');
  const popupButtons = document.querySelectorAll('[data-popup-language]');

  const getSavedLanguage = () => {
    const saved = localStorage.getItem('aycaKeremLanguage');
    return saved === 'en' ? 'en' : 'tr';
  };

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
      if (entry && entry[lang]) {
        element.setAttribute('aria-label', entry[lang]);
      }
    });

    document.querySelectorAll('[data-i18n-content]').forEach((element) => {
      const entry = translations[element.dataset.i18nContent];
      if (entry && entry[lang]) {
        element.setAttribute('content', entry[lang]);
      }
    });

    const titleEntry = translations['meta.title'];
    if (titleEntry && titleEntry[lang]) {
      document.title = titleEntry[lang];
    }

    languageButtons.forEach((button) => {
      const active = button.dataset.language === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const closePopup = () => {
    popup?.classList.remove('open');
    document.body.classList.remove('language-popup-open');
    sessionStorage.setItem('aycaKeremLanguagePromptSeen', 'true');
  };

  const selectLanguageAndReload = (language) => {
    const lang = language === 'en' ? 'en' : 'tr';
    const current = getSavedLanguage();

    localStorage.setItem('aycaKeremLanguage', lang);
    closePopup();

    // Reload only when the language is actually changing.
    if (lang !== current || document.documentElement.lang !== lang) {
      window.location.reload();
    } else {
      applyLanguage(lang);
    }
  };

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectLanguageAndReload(button.dataset.language);
    });
  });

  popupButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectLanguageAndReload(button.dataset.popupLanguage);
    });
  });

  // Turkish is the default until the visitor actively selects English.
  applyLanguage(getSavedLanguage());

  // Show the language prompt once per browser session.
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


// Logo marquee drag fix v2
(() => {
  const marquee = document.querySelector('.logo-marquee');
  const track = marquee?.querySelector('.logo-track');
  if (!marquee || !track) return;

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let resumeTimer;

  const pause = () => {
    clearTimeout(resumeTimer);
    track.style.animationPlayState = 'paused';
  };

  const resume = (delay = 750) => {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      if (!isDragging) track.style.animationPlayState = 'running';
    }, delay);
  };

  const begin = (event) => {
    isDragging = true;
    startX = event.clientX;
    startScrollLeft = marquee.scrollLeft;
    marquee.classList.add('is-dragging');
    pause();
    marquee.setPointerCapture?.(event.pointerId);
  };

  const move = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    marquee.scrollLeft = startScrollLeft - (event.clientX - startX);
  };

  const end = (event) => {
    if (!isDragging) return;
    isDragging = false;
    marquee.classList.remove('is-dragging');
    marquee.releasePointerCapture?.(event.pointerId);
    resume();
  };

  marquee.addEventListener('pointerdown', begin);
  marquee.addEventListener('pointermove', move);
  marquee.addEventListener('pointerup', end);
  marquee.addEventListener('pointercancel', end);

  marquee.addEventListener('mouseenter', pause);
  marquee.addEventListener('mouseleave', () => resume(500));

  marquee.addEventListener('touchstart', pause, { passive: true });
  marquee.addEventListener('touchend', () => resume(500), { passive: true });
})();


// Classic mobile menu controller
(() => {
  const toggle = document.getElementById('menuToggle') || document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  const openMenu = () => {
    toggle.classList.add('active');
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    toggle.classList.remove('active');
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };

  // Replace prior click handlers by cloning the toggle.
  const cleanToggle = toggle.cloneNode(true);
  toggle.replaceWith(cleanToggle);

  cleanToggle.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-hidden', 'true');

  cleanToggle.addEventListener('click', () => {
    const isOpen = cleanToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenuWith(cleanToggle) : openMenuWith(cleanToggle);
  });

  function openMenuWith(button) {
    button.classList.add('active');
    nav.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenuWith(button) {
    button.classList.remove('active');
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenuWith(cleanToggle));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenuWith(cleanToggle);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenuWith(cleanToggle);
  });
})();


// Video modal close safety
(() => {
  const modal =
    document.querySelector('.video-modal') ||
    document.querySelector('[data-video-modal]') ||
    document.querySelector('.modal-video-wrap');

  if (!modal) return;

  let closeButton =
    modal.querySelector('.video-modal-close') ||
    modal.querySelector('.modal-close');

  if (!closeButton) {
    closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'video-modal-close';
    closeButton.setAttribute('aria-label', 'Videoyu kapat');
    closeButton.innerHTML = '×';
    modal.appendChild(closeButton);
  }

  const closeModal = () => {
    modal.classList.remove('open', 'active', 'show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open', 'video-modal-open');

    const video = modal.querySelector('video');
    if (video) {
      video.pause();
      try { video.currentTime = 0; } catch (_) {}
    }
  };

  closeButton.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
})();


// Stable modal close normalization
(() => {
  const modal = document.getElementById('videoModal') || document.querySelector('.video-modal');
  if (!modal) return;

  const dialog = modal.querySelector('.modal-dialog');
  const closeButton =
    modal.querySelector('.video-modal-close') ||
    modal.querySelector('.modal-close');

  if (dialog && closeButton && closeButton.parentElement !== dialog) {
    dialog.appendChild(closeButton);
  }
})();


// Home cinematic reveal interactions
(() => {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
})();
