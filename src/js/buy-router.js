// Roteador de compra (/buy/). A pagina funciona sem JavaScript (todos os mercados listados).
// Aqui so se destaca o mercado sugerido: ?market=xx na URL ou a regiao do idioma do navegador.
// Nada e gravado nem enviado.
const root = document.querySelector("[data-buy-router]");
if (root) {
  const known = new Map([...root.querySelectorAll("[data-market]")].map((el) => [el.dataset.market, el]));
  const alias = { GB: "UK", NZ: "AU" };
  const fromUrl = new URLSearchParams(location.search).get("market");
  const fromLang = (navigator.languages || [navigator.language || ""]).map((l) => (l.split("-")[1] || "").toUpperCase()).find(Boolean);
  const pick = [fromUrl, fromLang].filter(Boolean).map((c) => alias[c.toUpperCase()] || c.toUpperCase()).find((c) => known.has(c));
  if (pick) {
    const section = known.get(pick);
    section.classList.add("is-suggested");
    const chip = root.querySelector(`[data-market-chip="${pick}"]`);
    if (chip) chip.classList.add("is-suggested");
    const badge = section.querySelector("[data-suggested-label]");
    if (badge) badge.hidden = false;
  }
}
