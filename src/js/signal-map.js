// Mapa dos Sinais: Leaflet + tiles do OpenStreetMap (sem chave de API). Carregado so na pagina do mapa.
// Le /data/signals.public.json (somente sinais "confirmed", filtrados no build).
import "leaflet/dist/leaflet.css";

const el = document.querySelector("[data-signal-map]");

async function init() {
  const L = (await import("leaflet")).default;
  const lang = el.dataset.lang === "en" ? "en" : "pt";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const map = L.map(el, {
    center: [10, -25], zoom: 2, minZoom: 1, maxZoom: 17, worldCopyJump: true,
    zoomAnimation: !reduce, fadeAnimation: !reduce, markerZoomAnimation: !reduce,
    maxBounds: [[-85, -420], [85, 420]],
  });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(map);

  let signals = [];
  try {
    const res = await fetch(el.dataset.src, { cache: "no-cache" });
    signals = (await res.json()).signals || [];
  } catch { /* sem dados: mapa vazio; os cards do HTML continuam visiveis */ }

  const icon = L.divIcon({ className: "signal-marker", html: "<span></span>", iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -12] });
  for (const s of signals) {
    if (s.status !== "confirmed" || typeof s.latitude !== "number" || typeof s.longitude !== "number") continue;
    const en = lang === "en";
    const name = en ? s.nome_en : s.nome;
    const place = [s.cidade, s.estado_sigla || s.estado, en ? s.pais_en : s.pais].filter(Boolean).join(" — ");
    const box = document.createElement("div");
    box.className = "signal-popup";
    const h = document.createElement("strong"); h.textContent = name;
    const p = document.createElement("span"); p.textContent = place;
    const st = document.createElement("em"); st.textContent = el.dataset.confirmed;
    if (s.foto) {
      const img = document.createElement("img");
      img.src = s.foto; img.alt = `${el.dataset.photoAlt} ${name}`; img.loading = "lazy"; img.width = 200; img.height = 260;
      box.append(img);
    }
    box.append(h, p, st);
    const marker = L.marker([s.latitude, s.longitude], { icon, title: name, alt: `${name}, ${place}`, keyboard: true })
      .addTo(map).bindPopup(box, { closeButton: true });
    // mouse: abre ao passar e fecha ao sair, a menos que a pessoa tenha clicado (toque/teclado usam clique e foco)
    let pinned = false;
    marker.on("mouseover", () => marker.openPopup());
    marker.on("mouseout", () => { if (!pinned) marker.closePopup(); });
    // o clique padrão do Leaflet alterna (fecharia o popup aberto pelo hover): troca por "abrir e fixar"
    marker.off("click", marker._openPopup, marker);
    marker.on("click", () => { pinned = true; marker.openPopup(); });
    marker.on("popupclose", () => { pinned = false; });
  }
}

if (el) init();
