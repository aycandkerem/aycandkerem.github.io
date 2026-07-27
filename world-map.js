(() => {
  const countries = window.WORLD_MAP_DATA || [];
  const land = window.WORLD_COUNTRIES;
  const canvas = document.getElementById('globeCanvas');
  const stage = document.getElementById('interactiveMap');
  const markersHost = document.getElementById('globeMarkers');
  const panel = document.getElementById('countryPanel');
  const shell = document.querySelector('.globe-shell');
  if (!canvas || !stage || !markersHost || !panel || !shell || !land) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = () => localStorage.getItem('aycaKeremLanguage') === 'en' ? 'en' : 'tr';
  const locations = {
    turkiye: [35.24, 38.96], mauritius: [57.55, -20.35], italy: [12.57, 41.87],
    georgia: [43.36, 42.32], austria: [14.55, 47.52], france: [2.21, 46.23]
  };
  let rotation = -18;
  let tilt = -8;
  let zoom = 1;
  let activeCountry = null;
  let dragging = false;
  let start = null;
  let lastTime = performance.now();
  let size = { width: 0, height: 0, radius: 0, cx: 0, cy: 0 };

  const toRad = value => value * Math.PI / 180;
  const project = ([lon, lat]) => {
    const lambda = toRad(lon + rotation);
    const phi = toRad(lat);
    const pitch = toRad(tilt);
    const x = Math.cos(phi) * Math.sin(lambda);
    const y0 = Math.sin(phi);
    const z0 = Math.cos(phi) * Math.cos(lambda);
    const y = y0 * Math.cos(pitch) - z0 * Math.sin(pitch);
    const z = y0 * Math.sin(pitch) + z0 * Math.cos(pitch);
    return { x: size.cx + x * size.radius * zoom, y: size.cy - y * size.radius * zoom, visible: z > 0, z };
  };

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size = {
      width: rect.width, height: rect.height,
      radius: Math.min(rect.width, rect.height) * (rect.width < 700 ? .36 : .4),
      cx: rect.width * (shell.classList.contains('country-active') && rect.width > 820 ? .36 : .5),
      cy: rect.height * .5
    };
  }

  function drawPolygon(coordinates) {
    coordinates.forEach(ring => {
      let drawing = false;
      ctx.beginPath();
      ring.forEach(point => {
        const p = project(point);
        if (!p.visible) { drawing = false; return; }
        if (!drawing) { ctx.moveTo(p.x, p.y); drawing = true; }
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }

  function render() {
    ctx.clearRect(0, 0, size.width, size.height);
    const gradient = ctx.createRadialGradient(
      size.cx - size.radius * .35, size.cy - size.radius * .35, 0,
      size.cx, size.cy, size.radius * zoom
    );
    gradient.addColorStop(0, '#1d5364');
    gradient.addColorStop(.52, '#0d2933');
    gradient.addColorStop(1, '#031016');
    ctx.beginPath();
    ctx.arc(size.cx, size.cy, size.radius * zoom, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(75,181,213,.28)';
    ctx.shadowBlur = 45;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.save();
    ctx.beginPath();
    ctx.arc(size.cx, size.cy, size.radius * zoom, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#58766f';
    ctx.strokeStyle = 'rgba(216,235,225,.28)';
    ctx.lineWidth = .7;
    land.features.forEach(feature => {
      const geometry = feature.geometry;
      if (geometry.type === 'Polygon') drawPolygon(geometry.coordinates);
      if (geometry.type === 'MultiPolygon') geometry.coordinates.forEach(drawPolygon);
    });
    const shade = ctx.createLinearGradient(size.cx - size.radius, 0, size.cx + size.radius, 0);
    shade.addColorStop(0, 'rgba(255,255,255,.11)');
    shade.addColorStop(.55, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,.62)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, size.width, size.height);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(size.cx, size.cy, size.radius * zoom, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(164,221,235,.25)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    updateMarkers();
  }

  function updateMarkers() {
    countries.forEach(country => {
      const marker = markersHost.querySelector(`[data-country="${country.id}"]`);
      const p = project(locations[country.id]);
      marker.hidden = !p.visible;
      marker.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      marker.style.zIndex = String(Math.round(p.z * 100) + 100);
      marker.classList.toggle('active', country.id === activeCountry);
    });
  }

  countries.forEach(country => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'globe-marker';
    button.dataset.country = country.id;
    button.setAttribute('aria-label', lang() === 'en' ? country.name_en : country.name_tr);
    button.innerHTML = `<span></span><b>${lang() === 'en' ? country.name_en : country.name_tr}</b>`;
    markersHost.appendChild(button);
  });

  function showCountry(countryId) {
    const country = countries.find(item => item.id === countryId);
    if (!country) return;
    activeCountry = countryId;
    const [lon, lat] = locations[countryId];
    rotation = -lon;
    tilt = -lat * .35;
    zoom = 1.18;
    shell.classList.add('country-active');
    resize();
    document.getElementById('countryName').textContent = lang() === 'en' ? country.name_en : country.name_tr;
    document.getElementById('countrySummary').textContent = lang() === 'en' ? country.summary_en : country.summary_tr;
    document.getElementById('projectCount').textContent = country.projects.length;
    document.getElementById('brandCount').textContent = new Set(country.projects.map(project => project[0])).size;
    document.getElementById('countryProjects').innerHTML = country.projects.map(project => `
      <article class="map-project"><h3>${project[0]}</h3>
      <p>${lang() === 'en' ? project[2] : project[1]}</p><small>${project[3]}</small></article>
    `).join('');
    panel.classList.add('open');
    panel.focus?.();
  }

  function reset() {
    activeCountry = null;
    rotation = -18; tilt = -8; zoom = 1;
    panel.classList.remove('open');
    shell.classList.remove('country-active');
    resize();
  }

  markersHost.addEventListener('click', event => {
    const marker = event.target.closest('.globe-marker');
    if (marker) showCountry(marker.dataset.country);
  });
  document.getElementById('resetMap').addEventListener('click', reset);
  document.getElementById('panelClose').addEventListener('click', reset);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') reset(); });

  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('.globe-marker')) return;
    dragging = true;
    start = { x: event.clientX, y: event.clientY, rotation, tilt };
    stage.classList.add('dragging');
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!dragging) return;
    rotation = start.rotation + (event.clientX - start.x) * .22;
    tilt = Math.max(-55, Math.min(55, start.tilt - (event.clientY - start.y) * .16));
    activeCountry = null;
  });
  const stopDrag = event => {
    dragging = false;
    stage.classList.remove('dragging');
    stage.releasePointerCapture?.(event.pointerId);
  };
  stage.addEventListener('pointerup', stopDrag);
  stage.addEventListener('pointercancel', stopDrag);
  stage.addEventListener('wheel', () => {}, { passive: true });
  window.addEventListener('resize', resize, { passive: true });

  function tick(now) {
    if (!dragging && !activeCountry && !reduceMotion) rotation += Math.min(now - lastTime, 32) * .0022;
    lastTime = now;
    render();
    requestAnimationFrame(tick);
  }
  resize();
  requestAnimationFrame(tick);
})();
