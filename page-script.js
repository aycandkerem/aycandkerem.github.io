(() => {
  const lang = () => localStorage.getItem('aycaKeremLanguage') === 'tr' ? 'tr' : 'en';
  const applyLanguage = () => {
    const current = lang();
    document.documentElement.lang = current;
    document.querySelectorAll('[data-tr][data-en]').forEach(element => {
      const value = element.dataset[current];
      if (value) element.textContent = value;
    });
    document.querySelectorAll('[data-tr-placeholder][data-en-placeholder]').forEach(element => {
      element.placeholder = current === 'en' ? element.dataset.enPlaceholder : element.dataset.trPlaceholder;
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

  const videoGrid = document.querySelector('.portfolio-phone-grid');
  const portfolioFilters = document.querySelector('.portfolio-filters');
  portfolioFilters?.querySelector('[data-phone-filter="destination"]')?.remove();

  if (videoGrid) {
    const sourceUpdates = {
      'assets/videos/portfolio-1.mp4': 'assets/videos/mauritius-hilton-mauritius-resort-and-spa.mp4',
      'assets/videos/portfolio-4.mp4': 'assets/videos/mauritius-le-chateau-de-bel-ombre.mp4',
      'assets/videos/portfolio-6.mp4': 'assets/videos/mauritius-heritage-awali-signature-dinner.mp4'
    };
    videoGrid.querySelectorAll('video, [data-video]').forEach(element => {
      const attribute = element.matches('video') ? 'src' : 'data-video';
      const currentSource = element.getAttribute(attribute);
      if (sourceUpdates[currentSource]) element.setAttribute(attribute, sourceUpdates[currentSource]);
    });
    const heritageCard = [...videoGrid.querySelectorAll('.portfolio-item')]
      .find(item => item.querySelector('video')?.getAttribute('src') === 'assets/videos/mauritius-heritage-resorts.mp4');
    if (heritageCard) heritageCard.dataset.category = 'hotel';
    const lifestyleCard = [...videoGrid.querySelectorAll('.portfolio-item')]
      .find(item => item.querySelector('h3')?.textContent.trim() === 'Couple Lifestyle');
    lifestyleCard?.remove();

    const moreWrap = document.createElement('div');
    moreWrap.className = 'portfolio-more-wrap';
    const moreButton = document.createElement('button');
    moreButton.className = 'portfolio-more-button';
    moreButton.id = 'portfolioMoreButton';
    moreButton.type = 'button';
    moreButton.dataset.tr = 'Daha Fazla';
    moreButton.dataset.en = 'More';
    moreButton.textContent = lang() === 'en' ? 'More' : 'Daha Fazla';
    moreButton.setAttribute('aria-controls', 'portfolioVideoGrid');
    videoGrid.id = 'portfolioVideoGrid';
    moreWrap.appendChild(moreButton);
    videoGrid.after(moreWrap);
  }

  const plannedVideos = (window.PLANNED_VIDEO_DATA || []).filter(item => item.available);
  if (videoGrid && plannedVideos.length) {
    const current = lang();
    plannedVideos.forEach(item => {
      const article = document.createElement('article');
      article.className = 'portfolio-item';
      article.dataset.category = item.category;
      article.innerHTML = `<div class="phone-shell"><div class="phone-speaker"></div><video class="portfolio-video" muted loop playsinline preload="metadata"${item.poster ? ` poster="${item.poster}"` : ''} src="${item.video}"></video><button class="video-open case-play-large" data-video="${item.video}" aria-label="Open ${item.title} video"><span>${current === 'en' ? 'Watch' : 'İzle'}</span></button></div><div class="project-meta"><h3>${item.title}</h3><p>${current === 'en' ? item.subtitle_en : item.subtitle_tr}</p></div>`;
      videoGrid.appendChild(article);
    });
  }

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
  const updateHeader = () => {
    header?.classList.toggle('scrolled', scrollY > 30);
    const probeY = Math.min(innerHeight * .12, 105);
    const themedSection = [...document.querySelectorAll('[data-header-theme]')]
      .find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom > probeY;
      });
    header?.classList.toggle('theme-dark', themedSection?.dataset.headerTheme === 'dark');
  };
  addEventListener('scroll', updateHeader, { passive: true });
  addEventListener('resize', updateHeader, { passive: true });
  updateHeader();
  addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  document.querySelectorAll('[data-case-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-case-filter]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.caseFilter;
    document.querySelectorAll('.case-study-row').forEach(row => {
      row.hidden = filter !== 'all' && row.dataset.category !== filter;
    });
  }));

  const phoneFilterButtons = [...document.querySelectorAll('[data-phone-filter]')];
  const portfolioMoreButton = document.getElementById('portfolioMoreButton');
  const portfolioPageSize = () => matchMedia('(max-width: 820px)').matches ? 10 : 20;
  let activePhoneFilter = 'all';
  let visiblePortfolioItems = portfolioPageSize();
  let lastPortfolioPageSize = portfolioPageSize();

  const updatePortfolioItems = () => {
    const items = [...document.querySelectorAll('.portfolio-item')];
    const matchingItems = items.filter(item =>
      activePhoneFilter === 'all' || item.dataset.category === activePhoneFilter
    );
    items.forEach(item => {
      const matchingIndex = matchingItems.indexOf(item);
      item.hidden = matchingIndex < 0 || matchingIndex >= visiblePortfolioItems;
    });
    if (portfolioMoreButton) {
      portfolioMoreButton.hidden = matchingItems.length <= visiblePortfolioItems;
      portfolioMoreButton.setAttribute('aria-expanded', String(matchingItems.length <= visiblePortfolioItems));
    }
  };

  phoneFilterButtons.forEach(button => button.addEventListener('click', () => {
    phoneFilterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activePhoneFilter = button.dataset.phoneFilter;
    visiblePortfolioItems = portfolioPageSize();
    updatePortfolioItems();
  }));

  portfolioMoreButton?.addEventListener('click', () => {
    visiblePortfolioItems += portfolioPageSize();
    updatePortfolioItems();
  });

  addEventListener('resize', () => {
    const nextPageSize = portfolioPageSize();
    if (nextPageSize === lastPortfolioPageSize) return;
    lastPortfolioPageSize = nextPageSize;
    visiblePortfolioItems = nextPageSize;
    updatePortfolioItems();
  });
  updatePortfolioItems();

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

  const inquiryForm = document.getElementById('inquiryForm');
  const inquiryEmail = inquiryForm?.elements.email;
  const inquiryMessage = inquiryForm?.elements.message;
  const messageCount = document.getElementById('messageCount');
  const updateMessageCount = () => {
    if (messageCount && inquiryMessage) messageCount.textContent = String(inquiryMessage.value.length);
  };
  inquiryMessage?.addEventListener('input', updateMessageCount);
  updateMessageCount();

  const emailDomainCorrections = {
    'gamil.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com',
    'outlok.com': 'outlook.com',
    'outllok.com': 'outlook.com',
    'outlook.co': 'outlook.com',
    'hotmail.co': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'icloud.co': 'icloud.com',
    'yahoo.co': 'yahoo.com'
  };
  const commonEmailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'yahoo.com'];
  const editDistance = (left, right) => {
    const row = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      let diagonal = row[0];
      row[0] = leftIndex;
      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        const previous = row[rightIndex];
        row[rightIndex] = Math.min(
          row[rightIndex] + 1,
          row[rightIndex - 1] + 1,
          diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
        );
        diagonal = previous;
      }
    }
    return row[right.length];
  };
  const validateEmail = () => {
    if (!inquiryEmail) return true;
    const current = lang();
    const value = inquiryEmail.value.trim().toLowerCase();
    inquiryEmail.value = value;
    inquiryEmail.setCustomValidity('');
    const match = value.match(/^([^\s@]+)@([^\s@]+\.[a-z]{2,})$/i);
    if (!match) {
      inquiryEmail.setCustomValidity(current === 'en'
        ? 'Please enter a valid email address.'
        : 'Lütfen geçerli bir e-posta adresi girin.');
      return false;
    }
    const domain = match[2];
    const suggestion = emailDomainCorrections[domain]
      || commonEmailDomains.find(candidate => candidate !== domain && editDistance(domain, candidate) <= 1);
    if (suggestion) {
      inquiryEmail.setCustomValidity(current === 'en'
        ? `Did you mean ${match[1]}@${suggestion}?`
        : `${match[1]}@${suggestion} adresini mi demek istediniz?`);
      return false;
    }
    return true;
  };
  inquiryEmail?.addEventListener('input', () => inquiryEmail.setCustomValidity(''));
  inquiryEmail?.addEventListener('blur', validateEmail);

  inquiryForm?.addEventListener('submit', event => {
    event.preventDefault();
    validateEmail();
    if (!inquiryForm.checkValidity()) {
      inquiryForm.reportValidity();
      return;
    }
    const data = new FormData(inquiryForm);
    const current = lang();
    const subject = current === 'en'
      ? `Collaboration Inquiry | ${data.get('project')} | ${data.get('name')}`
      : `İş Birliği Talebi | ${data.get('project')} | ${data.get('name')}`;
    const body = current === 'en'
      ? `Hello Ayça & Kerem,\n\nI am reaching out on behalf of ${data.get('name')} to explore a potential collaboration.\n\nProject type: ${data.get('project')}\nDestination & dates: ${data.get('destination') || 'To be confirmed'}\nContact email: ${data.get('email')}\n\nOur goals and content needs:\n${data.get('message')}\n\nWe would be happy to hear your creative approach, recommended deliverables and collaboration terms.\n\nBest regards,\n${data.get('name')}`
      : `Merhaba Ayça & Kerem,\n\n${data.get('name')} adına olası bir iş birliği için sizinle iletişime geçiyorum.\n\nProje türü: ${data.get('project')}\nDestinasyon & tarih: ${data.get('destination') || 'Henüz netleşmedi'}\nİletişim e-postası: ${data.get('email')}\n\nProje hedefimiz ve ihtiyaç duyduğumuz içerikler:\n${data.get('message')}\n\nYaratıcı yaklaşımınız, önerdiğiniz teslim kapsamı ve çalışma koşulları hakkında bilgi paylaşabilirseniz memnun oluruz.\n\nTeşekkürler,\n${data.get('name')}`;
    location.href = `mailto:aycandkerem@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    const video = entry.target.querySelector?.('video');
    video?.play().catch(() => {});
    observer.unobserve(entry.target);
  }), { threshold: .12 });
  document.querySelectorAll('.reveal,.case-study-row,.portfolio-item').forEach(element => observer.observe(element));
})();
