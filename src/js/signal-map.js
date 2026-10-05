import 'leaflet/dist/leaflet.css';
import {PUBLIC_SIGNAL_STATUSES, signalStatus} from './signal-status.js';
const el = document.querySelector('[data-signal-map]');
async function init() {
 const L=(await import('leaflet')).default;const lang=el.dataset.lang==='en'?'en':'pt';const en=lang==='en';const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const map=L.map(el,{center:[10,-25],zoom:2,minZoom:1,maxZoom:17,worldCopyJump:true,zoomAnimation:!reduce,fadeAnimation:!reduce,markerZoomAnimation:!reduce,maxBounds:[[-85,-420],[85,420]]});
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
   if(s.coord_precision==='area'){const note=document.createElement('small');note.textContent=en?'Approximate city location; venue address not yet provided.':'Localização aproximada na cidade; endereço do local ainda não informado.';item.append(note);}
   if(s.foto){const img=document.createElement('img');img.src=s.foto;img.alt=`${el.dataset.photoAlt} ${name}`;img.loading='lazy';img.width=200;img.height=260;item.append(img);}box.append(item);
  }
  const marker=L.marker([first.latitude,first.longitude],{icon,title:names.join(' / '),alt:names.join(' / '),keyboard:true}).addTo(map).bindPopup(box,{closeButton:true,maxHeight:380});for(const s of group)markers.set(s.id,marker);
  let pinned=false;marker.on('mouseover',()=>marker.openPopup());marker.on('mouseout',()=>{if(!pinned)marker.closePopup();});marker.off('click',marker._openPopup,marker);marker.on('click',()=>{pinned=true;marker.openPopup();});marker.on('popupclose',()=>{pinned=false;});
 }
 document.querySelectorAll('[data-signal-focus]').forEach(button=>{const marker=markers.get(button.dataset.signalFocus);if(!marker)return;button.addEventListener('click',()=>{const s=signals.find(s=>s.id===button.dataset.signalFocus);map.setView(marker.getLatLng(),s.coord_precision==='area'?11:15,{animate:!reduce});el.scrollIntoView({behavior:reduce?'instant':'smooth',block:'center'});marker.fire('click');marker.getElement()?.focus({preventScroll:true});});});
}
if(el)init();
