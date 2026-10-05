import 'leaflet/dist/leaflet.css';
import {PUBLIC_SIGNAL_STATUSES, signalStatus} from './signal-status.js';
import {signalDetailsHtml} from './signal-details.js';
const el = document.querySelector('[data-signal-map]');
async function init() {
 const L=(await import('leaflet')).default;const lang=el.dataset.lang==='en'?'en':'pt';const en=lang==='en';const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const map=L.map(el,{center:[10,-25],zoom:2,minZoom:0,maxZoom:17,worldCopyJump:true,zoomAnimation:!reduce,fadeAnimation:!reduce,markerZoomAnimation:!reduce});
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
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
  const marker=L.marker([first.latitude,first.longitude],{icon,title:names.join(' / '),alt:names.join(' / '),keyboard:true}).addTo(map).bindPopup(box,{closeButton:true,autoPan:false,maxHeight:Math.max(140,Math.min(380,el.clientHeight-80)),maxWidth:Math.min(300,el.clientWidth-48)});for(const s of group)markers.set(s.id,marker);
  const keepVisible=()=>{const popup=marker.getPopup().getElement();if(!marker.isPopupOpen()||!popup)return;const r=popup.getBoundingClientRect(),m=el.getBoundingClientRect();const dx=r.left<m.left+16?r.left-m.left-16:r.right>m.right-16?r.right-m.right+16:0;const dy=r.top<m.top+16?r.top-m.top-16:r.bottom>m.bottom-16?r.bottom-m.bottom+16:0;if(dx||dy)map.panBy([dx,dy],{animate:false});};
  marker.on('popupopen',()=>requestAnimationFrame(keepVisible));
  box.querySelectorAll('img').forEach(img=>img.addEventListener('load',()=>{if(marker.isPopupOpen()){marker.getPopup().update();requestAnimationFrame(keepVisible);}}));
  // Hover opens a persistent floating window so photos and links stay reachable.
  marker.on('mouseover',()=>marker.openPopup());
  marker.off('click',marker._openPopup,marker);marker.on('click',()=>marker.openPopup());
 }
 if(groups.size){const bounds=L.latLngBounds([...groups.values()].map(group=>[group[0].latitude,group[0].longitude]));map.fitBounds(bounds,{padding:[30,30],maxZoom:2,animate:false});}
 document.querySelectorAll('[data-signal-focus]').forEach(button=>{const marker=markers.get(button.dataset.signalFocus);if(!marker)return;button.addEventListener('click',()=>{const s=signals.find(s=>s.id===button.dataset.signalFocus);map.setView(marker.getLatLng(),s.coord_precision==='area'?11:15,{animate:!reduce});el.scrollIntoView({behavior:reduce?'instant':'smooth',block:'center'});marker.fire('click');marker.getElement()?.focus({preventScroll:true});});});
}
if(el)init();

