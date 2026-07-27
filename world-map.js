
(() => {
  const data = window.WORLD_MAP_DATA || [];
  const map = document.getElementById('interactiveMap');
  const orbit = document.getElementById('mapStage');
  const markersHost = document.getElementById('globeMarkers');
  const panel = document.getElementById('countryPanel');
  const shell = document.querySelector('.globe-shell');

  if (!map || !orbit || !markersHost || !panel || !shell) return;

  const markerPositions = {
    turkiye: {x: 56, y: 41, tx: -140, ty: 40, scale: 1.55},
    mauritius: {x: 59, y: 68, tx: -130, ty: -145, scale: 1.75},
    italy: {x: 48, y: 39, tx: 20, ty: 60, scale: 1.7},
    georgia: {x: 59, y: 39, tx: -160, ty: 65, scale: 1.65},
    austria: {x: 50, y: 36, tx: 0, ty: 85, scale: 1.75},
    france: {x: 43, y: 40, tx: 85, ty: 55, scale: 1.65}
  };

  const lang = () => localStorage.getItem('aycaKeremLanguage') === 'en' ? 'en' : 'tr';

  data.forEach(country => {
    const p = markerPositions[country.id] || {x:50,y:50};
    const button = document.createElement('button');
    button.className = 'globe-marker';
    button.style.setProperty('--x', `${p.x}%`);
    button.style.setProperty('--y', `${p.y}%`);
    button.dataset.country = country.id;
    button.setAttribute('aria-label', lang() === 'en' ? country.name_en : country.name_tr);
    button.innerHTML = `<span></span><b>${lang() === 'en' ? country.name_en : country.name_tr}</b>`;
    markersHost.appendChild(button);
  });

  let activeCountry = null;

  function setCamera(countryId) {
    const p = markerPositions[countryId];
    if (!p) return;
    orbit.style.transform = `translate(${p.tx}px, ${p.ty}px) scale(${p.scale})`;
  }

  function resetCamera() {
    activeCountry = null;
    orbit.style.transform = 'translate(0, 0) scale(1)';
    panel.classList.remove('open');
    shell.classList.remove('country-active');
  }

  function openCountry(countryId) {
    const country = data.find(item => item.id === countryId);
    if (!country) return;

    activeCountry = countryId;
    shell.classList.add('country-active');
    setCamera(countryId);

    document.getElementById('countryName').textContent = lang() === 'en' ? country.name_en : country.name_tr;
    document.getElementById('countrySummary').textContent = lang() === 'en' ? country.summary_en : country.summary_tr;
    document.getElementById('projectCount').textContent = country.projects.length;
    document.getElementById('brandCount').textContent = country.projects.length;

    document.getElementById('countryProjects').innerHTML = country.projects.map(project => `
      <article class="map-project">
        <h3>${project[0]}</h3>
        <p>${lang() === 'en' ? project[2] : project[1]}</p>
        <small>${project[3]}</small>
      </article>
    `).join('');

    requestAnimationFrame(() => panel.classList.add('open'));
  }

  markersHost.addEventListener('click', event => {
    const marker = event.target.closest('.globe-marker');
    if (!marker) return;
    event.preventDefault();
    event.stopPropagation();
    openCountry(marker.dataset.country);
  });

  document.getElementById('resetMap').addEventListener('click', resetCamera);
  document.getElementById('panelClose').addEventListener('click', () => {
    panel.classList.remove('open');
    shell.classList.remove('country-active');
    activeCountry = null;
    orbit.style.transform = 'translate(0, 0) scale(1)';
  });

  // The page scroll always remains page scroll.
  // No mouse-wheel zoom is used, preventing accidental zoom conflicts.
  map.addEventListener('wheel', () => {}, { passive: true });

  // Subtle globe rotation only when no country is active.
  let angle = 0;
  function idleMotion() {
    if (!activeCountry) {
      angle += 0.025;
      orbit.style.rotate = `${Math.sin(angle) * 0.8}deg`;
    } else {
      orbit.style.rotate = '0deg';
    }
    requestAnimationFrame(idleMotion);
  }
  idleMotion();
})();
