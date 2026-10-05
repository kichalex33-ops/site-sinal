import 'leaflet/dist/leaflet.css';
const el=document.querySelector('[data-christchurch-map]');
if(el){
 const en=el.dataset.lang==='en',fallback=document.querySelector('[data-christchurch-fallback]');
 const init=async()=>{
  let map;
  try{
   const L=(await import('leaflet')).default;
   el.hidden=false;
   const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
   map=L.map(el,{scrollWheelZoom:false,minZoom:0,maxZoom:12,zoomAnimation:!reduce,fadeAnimation:!reduce,markerZoomAnimation:!reduce});
   const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
   // Draw the shorter symbolic connection across the Pacific on the adjacent world copy.
   const origin=[-29.7,-53],destination=[-43.530955,-187.3635657],bounds=L.latLngBounds([origin,destination]);
   const popup=(name,country,accepted=false)=>{const content=document.createElement('div'),title=document.createElement('strong'),p=document.createElement('p');title.textContent=name;p.textContent=country;content.append(title,p);if(accepted){const status=document.createElement('p');status.textContent=en?'📡 Signal accepted · awaiting installation/photo':'📡 Sinal aceito · aguardando instalação/foto';content.append(status);}return content;};
   L.circleMarker(origin,{radius:5,color:'#fff',weight:1,fillColor:'#e8541d',fillOpacity:1}).addTo(map).bindPopup(popup('Rio Grande do Sul',en?'Brazil':'Brasil'));
   L.circleMarker(destination,{radius:5,color:'#fff',weight:1,fillColor:'#e8541d',fillOpacity:1}).addTo(map).bindPopup(popup('Christchurch City Libraries',en?'New Zealand':'Nova Zelândia',true));
   L.polyline([origin,destination],{color:'#e8541d',weight:2,dashArray:'6 7',interactive:false}).addTo(map);
   const fit=()=>map.fitBounds(bounds,{padding:[34,34],maxZoom:3,animate:false});fit();
   fallback.hidden=true;
   let loaded=false;tiles.once('tileload',()=>{loaded=true;el.hidden=false;fallback.hidden=true;map.invalidateSize({pan:false});fit();});tiles.on('tileerror',()=>{if(!loaded){el.hidden=true;fallback.hidden=false;}});
   new ResizeObserver(()=>{if(!el.hidden){map.invalidateSize({pan:false});fit();}}).observe(el);
  }catch{map?.remove();el.hidden=true;fallback.hidden=false;}
 };
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();init();}},{rootMargin:'300px'});observer.observe(el.parentElement);
}
