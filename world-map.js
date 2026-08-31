(() => {
  const countries = window.WORLD_MAP_DATA || [];
  const shell = document.querySelector('.country-card-shell');
  const panel = document.getElementById('countryPanel');
  if (!shell || !panel || !countries.length) return;

  const lang = () => localStorage.getItem('aycaKeremLanguage') === 'tr' ? 'tr' : 'en';
  const flags = {
    turkiye: '🇹🇷', mauritius: '🇲🇺', italy: '🇮🇹',
    georgia: '🇬🇪', austria: '🇦🇹', france: '🇫🇷',
    cyprus: '🇨🇾', belgium: '🇧🇪', netherlands: '🇳🇱', greece: '🇬🇷'
  };

  function openCountry(countryId) {
    const country = countries.find(item => item.id === countryId);
    if (!country) return;

    document.getElementById('countryFlag').textContent = flags[countryId];
    document.getElementById('countryName').textContent = lang() === 'en' ? country.name_en : country.name_tr;
    document.getElementById('countrySummary').textContent = lang() === 'en' ? country.summary_en : country.summary_tr;
    document.getElementById('projectCount').textContent = country.projects.length;
    document.getElementById('countryProjects').innerHTML = country.projects.map(project => `
      <article class="map-project">
        <h3>${project[0]}</h3>
        <p>${lang() === 'en' ? project[2] : project[1]}</p>
        <small>${project[3]}</small>
      </article>`).join('');

    document.querySelectorAll('[data-country-select]').forEach(button =>
      button.classList.toggle('active', button.dataset.countrySelect === countryId));
    panel.classList.toggle('has-overflow', country.projects.length > 4);
    panel.classList.add('open');
    shell.classList.add('detail-open');
  }

  function closeCountry() {
    panel.classList.remove('open');
    shell.classList.remove('detail-open');
    document.querySelectorAll('[data-country-select]').forEach(button => button.classList.remove('active'));
  }

  document.querySelectorAll('[data-country-select]').forEach(button =>
    button.addEventListener('click', () => openCountry(button.dataset.countrySelect)));
  document.getElementById('panelClose').addEventListener('click', closeCountry);
  addEventListener('keydown', event => { if (event.key === 'Escape') closeCountry(); });
  document.querySelector('[data-focus-map]')?.addEventListener('click', () => {
    shell.scrollIntoView({ behavior: 'smooth', block: 'center' });
    shell.classList.add('country-shell-emphasis');
    setTimeout(() => shell.classList.remove('country-shell-emphasis'), 900);
  });
})();
