
(() => {
  const getLang = () => localStorage.getItem('aycaKeremLanguage') === 'en' ? 'en' : 'tr';
  const apply = () => {
    const lang = getLang();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-tr][data-en]').forEach(el => {
      const value = el.dataset[lang];
      if (value) el.textContent = value;
    });
    document.querySelectorAll('[data-page-language]').forEach(btn => btn.classList.toggle('active', btn.dataset.pageLanguage === lang));
  };
  document.querySelectorAll('[data-page-language]').forEach(btn => btn.addEventListener('click', () => {
    localStorage.setItem('aycaKeremLanguage', btn.dataset.pageLanguage);
    window.location.reload();
  }));
  apply();

  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if(toggle && nav){
    toggle.addEventListener('click',()=>{
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('active',open);
      toggle.setAttribute('aria-expanded',String(open));
      document.body.classList.toggle('menu-open',open);
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));
  }

  document.querySelectorAll('[data-case-filter]').forEach(btn => btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-case-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter=btn.dataset.caseFilter;
    document.querySelectorAll('.case-card').forEach(card=>card.style.display=(filter==='all'||card.dataset.category===filter)?'block':'none');
  }));

  const modal=document.getElementById('pageVideoModal');
  if(modal){
    const video=modal.querySelector('video');
    document.querySelectorAll('.case-play').forEach(btn=>btn.addEventListener('click',()=>{
      video.src=btn.dataset.video; modal.classList.add('open'); video.play();
    }));
    const close=()=>{video.pause();video.removeAttribute('src');modal.classList.remove('open')};
    modal.querySelector('.page-video-close').addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }
})();


// Cinematic reveal interactions
(() => {
  const elements = document.querySelectorAll('.reveal, .case-study-row');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const video = entry.target.querySelector('video[muted]');
        if (video) video.play().catch(() => {});
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  elements.forEach(el => observer.observe(el));
})();
