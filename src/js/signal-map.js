import 'leaflet/dist/leaflet.css';
import {PUBLIC_SIGNAL_STATUSES, signalStatus} from './signal-status.js';
import {signalDetailsHtml} from './signal-details.js';
const el = document.querySelector('[data-signal-map]');
async function init() {
 const L=(await import('leaflet')).default;const lang=el.dataset.lang==='en'?'en':'pt';const en=lang==='en';const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const world=L.latLngBounds([-85,-180],[85,180]);const map=L.map(el,{center:[10,-25],zoom:2,minZoom:0,maxZoom:17,worldCopyJump:true,zoomAnimation:!reduce,fadeAnimation:!reduce,markerZoomAnimation:!reduce});
 const osm=()=>{el.classList.add('signal-map--osm');L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);};
 osm();
 let signals=[];try{const res=await fetch(el.dataset.src,{cache:'no-cache'});if(!res.ok)throw new Error('Map data unavailable');signals=(await res.json()).signals||[];}catch{return;} // Directory remains available if map data cannot load.
 const groups=new Map();
 for(const s of signals){if(!PUBLIC_SIGNAL_STATUSES.includes(s.status)||!Number.isFinite(s.latitude)||!Number.isFinite(s.longitude))continue;const key=`${s.latitude}|${s.longitude}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(s);}
 const markers=new Map();
 for(const group of groups.values()){
  const first=group[0];const status=signalStatus(first,lang);
  // Shared city coordinates group venues without inventing separate addresses.
  const icon=L.divIcon({className:`signal-marker signal-marker--${status.key}`,html:`<span>${group.length>1?group.length:''}</span>`,iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-14]});
  const box=document.createElement('div');box.className='signal-popup-group';const names=[];
  for(const s of group){const name=en?s.nome_en:s.nome;names.push(name);const place=[s.cidade,s.estado_sigla||s.estado,en?s.pais_en:s.pais].filter(Boolean).join(' — ');const item=document.createElement('div');item.className='signal-popup';
   const h=document.createElement('strong');h.textContent=name;const p=document.createElement('span');p.textContent=place;const st=document.createElement('em');const current=signalStatus(s,lang);st.textContent=current.label;st.className=`signal-status signal-status--${current.key}`;item.append(h,p,st);
   const details=document.createElement('div');details.className='signal-popup-details';details.innerHTML=signalDetailsHtml(s,lang,true);item.append(details);box.append(item);
  }
  const marker=L.marker([first.latitude,first.longitude],{icon,title:names.join(' / '),alt:names.join(' / '),keyboard:true}).addTo(map).bindPopup(box,{closeButton:true,autoPan:false,maxHeight:Math.max(200,Math.min(560,el.clientHeight-40)),maxWidth:Math.min(400,el.clientWidth-48),minWidth:Math.min(320,el.clientWidth-48),className:'signal-popup-card'});for(const s of group)markers.set(s.id,marker);
  const keepVisible=()=>{const popup=marker.getPopup().getElement();if(!marker.isPopupOpen()||!popup)return;const r=popup.getBoundingClientRect(),m=el.getBoundingClientRect();const dx=r.left<m.left+16?r.left-m.left-16:r.right>m.right-16?r.right-m.right+16:0;const dy=r.top<m.top+16?r.top-m.top-16:r.bottom>m.bottom-16?r.bottom-m.bottom+16:0;if(dx||dy)map.panBy([dx,dy],{animate:false});};
  marker.on('popupopen',()=>requestAnimationFrame(keepVisible));
  box.querySelectorAll('img').forEach(img=>img.addEventListener('load',()=>{if(marker.isPopupOpen()){marker.getPopup().update();requestAnimationFrame(keepVisible);}}));
  // Hover opens a persistent floating window so photos and links stay reachable.
  marker.on('mouseover',()=>marker.openPopup());
  marker.off('click',marker._openPopup,marker);marker.on('click',()=>marker.openPopup());
 }
 const regions={world:[null,'Mundo','World'],americas:[L.latLngBounds([-40,-130],[60,-34]),'Américas','Americas'],europe:[L.latLngBounds([34,-25],[72,45]),'Europa','Europe'],africa:[L.latLngBounds([-36,-20],[38,52]),'África','Africa'],asia:[L.latLngBounds([-10,25],[72,150]),'Ásia','Asia'],oceania:[L.latLngBounds([-48,110],[-5,180]),'Oceania','Oceania']};
 // Região inicial pelo fuso horário do navegador: nada é enviado nem guardado.
 let tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch{}
 const pre=tz.split('/')[0];const start=pre==='America'?'americas':pre==='Europe'?'europe':pre==='Africa'?'africa':pre==='Asia'?'asia':(pre==='Australia'||pre==='Pacific')?'oceania':'world';
 const showRegion=(key,animate)=>{if(key==='world'){const pts=[...markers.values()].map(m=>m.getLatLng());pts.length?map.fitBounds(L.latLngBounds(pts),{padding:[30,30],maxZoom:2,animate:false}):map.setView([10,-25],2,{animate:false});}else map.fitBounds(regions[key][0],{animate:!!animate&&!reduce,padding:[10,10]});document.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region===key)));};
 const fitWorld=()=>{map.invalidateSize();};
 let first=true;const ro=new ResizeObserver(()=>{fitWorld();if(first&&el.clientWidth){first=false;showRegion(start,false);}});ro.observe(el);fitWorld();showRegion(start,false);setTimeout(()=>{fitWorld();showRegion(start,false);},600);
 const bar=document.querySelector('[data-region-bar]');if(bar){bar.innerHTML=Object.entries(regions).map(([k,v])=>`<button type="button" class="buy-chip" data-region="${k}" aria-pressed="${k===start}">${en?v[2]:v[1]}</button>`).join('');bar.addEventListener('click',e=>{const b=e.target.closest('[data-region]');if(b)showRegion(b.dataset.region,true);});}
 document.querySelectorAll('[data-signal-focus]').forEach(button=>{const marker=markers.get(button.dataset.signalFocus);if(!marker)return;button.addEventListener('click',()=>{const s=signals.find(s=>s.id===button.dataset.signalFocus);map.setView(marker.getLatLng(),s.coord_precision==='area'?11:15,{animate:!reduce});el.scrollIntoView({behavior:reduce?'instant':'smooth',block:'center'});marker.fire('click');marker.getElement()?.focus({preventScroll:true});});});
 const box=document.querySelector('[data-signal-search]'),list=document.querySelector('#signal-search-list');
 if(box&&list){list.innerHTML=signals.map(s=>`<option value="${[en?s.nome_en:s.nome,s.cidade,en?s.pais_en:s.pais].filter(Boolean).join(' — ').replace(/"/g,'&quot;')}"></option>`).join('');
  const go=()=>{const q=box.value.trim().toLowerCase();if(!q)return;const s=signals.find(s=>[en?s.nome_en:s.nome,s.cidade,en?s.pais_en:s.pais].filter(Boolean).join(' — ').toLowerCase()===q)||signals.find(s=>[s.nome,s.nome_en,s.cidade,s.pais,s.pais_en].filter(Boolean).some(v=>v.toLowerCase().includes(q)));const m=s&&markers.get(s.id);if(m){map.setView(m.getLatLng(),s.coord_precision==='area'?9:12,{animate:!reduce});m.openPopup();}};
  box.addEventListener('change',go);box.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});}
}
if(el)init();

