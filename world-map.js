
(() => {
  const data = window.WORLD_MAP_DATA || [];
  const map = document.getElementById('interactiveMap');
  const stage = document.getElementById('mapStage');
  const panel = document.getElementById('countryPanel');
  if(!map || !stage || !panel) return;

  let scale=1, x=0, y=0, dragging=false, sx=0, sy=0, ox=0, oy=0;
  const clampScale=v=>Math.min(4,Math.max(1,v));
  const render=()=>stage.style.transform=`translate(${x}px,${y}px) scale(${scale})`;
  const reset=()=>{scale=1;x=0;y=0;render();panel.classList.remove('open')};

  function zoomAt(next,cx=map.clientWidth/2,cy=map.clientHeight/2){
    next=clampScale(next);
    const ratio=next/scale;
    x=cx-(cx-x)*ratio; y=cy-(cy-y)*ratio; scale=next; render();
  }

  map.addEventListener('pointerdown',e=>{if(e.target.closest('.map-marker'))return;dragging=true;map.classList.add('dragging');sx=e.clientX;sy=e.clientY;ox=x;oy=y;map.setPointerCapture(e.pointerId)});
  map.addEventListener('pointermove',e=>{if(!dragging)return;x=ox+(e.clientX-sx);y=oy+(e.clientY-sy);render()});
  map.addEventListener('pointerup',()=>{dragging=false;map.classList.remove('dragging')});
  map.addEventListener('wheel',e=>{e.preventDefault();zoomAt(scale*(e.deltaY<0?1.15:.87),e.offsetX,e.offsetY)},{passive:false});
  document.getElementById('zoomIn').onclick=()=>zoomAt(scale*1.25);
  document.getElementById('zoomOut').onclick=()=>zoomAt(scale*.8);
  document.getElementById('resetMap').onclick=reset;
  document.getElementById('panelClose').onclick=()=>panel.classList.remove('open');

  const lang=()=>localStorage.getItem('aycaKeremLanguage')==='en'?'en':'tr';
  function openCountry(id){
    const c=data.find(item=>item.id===id); if(!c)return;
    const rect=map.getBoundingClientRect();
    scale=c.zoom;
    x=rect.width/2-(c.x/100*rect.width)*scale;
    y=rect.height/2-(c.y/100*rect.height)*scale;
    render();
    document.getElementById('countryName').textContent=lang()==='en'?c.name_en:c.name_tr;
    document.getElementById('countrySummary').textContent=lang()==='en'?c.summary_en:c.summary_tr;
    document.getElementById('projectCount').textContent=c.projects.length;
    document.getElementById('brandCount').textContent=c.projects.length;
    document.getElementById('countryProjects').innerHTML=c.projects.map(p=>`<article class="map-project"><h3>${p[0]}</h3><p>${lang()==='en'?p[2]:p[1]}</p><small>${p[3]}</small></article>`).join('');
    panel.classList.add('open');
  }
  document.querySelectorAll('.map-marker').forEach(m=>m.addEventListener('click',()=>openCountry(m.dataset.country)));
})();
