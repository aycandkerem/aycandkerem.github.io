(() => {
  const canvas = document.getElementById('flatMapCanvas');
  const stage = document.getElementById('interactiveMap');
  const markersHost = document.getElementById('mapMarkers');
  const panel = document.getElementById('countryPanel');
  const land = window.WORLD_COUNTRIES;
  const countries = window.WORLD_MAP_DATA || [];
  if (!canvas || !stage || !markersHost || !panel || !land) return;

  const ctx = canvas.getContext('2d');
  const lang = () => localStorage.getItem('aycaKeremLanguage') === 'en' ? 'en' : 'tr';
  const locations = {
    turkiye: [35.24, 38.96], mauritius: [57.55, -20.35], italy: [12.57, 41.87],
    georgia: [43.36, 42.32], austria: [14.55, 47.52], france: [2.21, 46.23]
  };
  let view = { scale: 1, centerLon: 10, centerLat: 15 };
  let target = { ...view };
  let selected = null;
  let dimensions = { width: 0, height: 0 };

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dimensions = { width: rect.width, height: rect.height };
  }

  function project([lon, lat]) {
    const baseScale = Math.min(dimensions.width / 360, dimensions.height / 170);
    return {
      x: dimensions.width / 2 + (lon - view.centerLon) * baseScale * view.scale,
      y: dimensions.height / 2 - (lat - view.centerLat) * baseScale * view.scale
    };
  }

  function drawRing(ring) {
    ctx.beginPath();
    ring.forEach((point, index) => {
      const p = project(point);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
    gradient.addColorStop(0, '#12252c');
    gradient.addColorStop(1, '#071115');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    ctx.save();
    ctx.fillStyle = '#657c76';
    ctx.strokeStyle = 'rgba(214,232,225,.28)';
    ctx.lineWidth = .65;
    land.features.forEach(feature => {
      const geometry = feature.geometry;
      if (geometry.type === 'Polygon') geometry.coordinates.forEach(drawRing);
      if (geometry.type === 'MultiPolygon') geometry.coordinates.forEach(poly => poly.forEach(drawRing));
    });
    ctx.restore();

    ctx.fillStyle = 'rgba(255,255,255,.025)';
    for (let lon = -180; lon <= 180; lon += 30) {
      const top = project([lon, 85]);
      const bottom = project([lon, -85]);
      ctx.fillRect(top.x, top.y, 1, bottom.y - top.y);
    }
    updateMarkers();
  }

  function updateMarkers() {
    countries.forEach(country => {
      const marker = markersHost.querySelector(`[data-country="${country.id}"]`);
      const p = project(locations[country.id]);
      marker.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      marker.classList.toggle('active', selected === country.id);
      marker.hidden = p.x < -40 || p.x > dimensions.width + 40 || p.y < -40 || p.y > dimensions.height + 40;
    });
  }

  countries.forEach(country => {
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'flat-map-marker';
    marker.dataset.country = country.id;
    marker.setAttribute('aria-label', lang() === 'en' ? country.name_en : country.name_tr);
    marker.innerHTML = `<span></span><b>${lang() === 'en' ? country.name_en : country.name_tr}</b>`;
    markersHost.appendChild(marker);
  });

  function openCountry(countryId) {
    const country = countries.find(item => item.id === countryId);
    if (!country) return;
    selected = countryId;
    const [lon, lat] = locations[countryId];
    target = { scale: dimensions.width < 700 ? 3.2 : 2.35, centerLon: lon, centerLat: lat };
    document.getElementById('countryName').textContent = lang() === 'en' ? country.name_en : country.name_tr;
    document.getElementById('countrySummary').textContent = lang() === 'en' ? country.summary_en : country.summary_tr;
    document.getElementById('projectCount').textContent = country.projects.length;
    document.getElementById('brandCount').textContent = new Set(country.projects.map(project => project[0])).size;
    document.getElementById('countryProjects').innerHTML = country.projects.map(project => `
      <article class="map-project">
        <h3>${project[0]}</h3>
        <p>${lang() === 'en' ? project[2] : project[1]}</p>
        <small>${project[3]}</small>
      </article>`).join('');
    panel.classList.add('open');
  }

  function reset() {
    selected = null;
    target = { scale: 1, centerLon: 10, centerLat: 15 };
    panel.classList.remove('open');
  }

  markersHost.addEventListener('click', event => {
    const marker = event.target.closest('.flat-map-marker');
    if (marker) openCountry(marker.dataset.country);
  });
  document.getElementById('resetMap').addEventListener('click', reset);
  document.getElementById('panelClose').addEventListener('click', reset);
  addEventListener('keydown', event => { if (event.key === 'Escape') reset(); });
  addEventListener('resize', resize, { passive: true });
  stage.addEventListener('wheel', () => {}, { passive: true });

  function animate() {
    view.scale += (target.scale - view.scale) * .085;
    view.centerLon += (target.centerLon - view.centerLon) * .085;
    view.centerLat += (target.centerLat - view.centerLat) * .085;
    draw();
    requestAnimationFrame(animate);
  }
  resize();
  requestAnimationFrame(animate);
})();
