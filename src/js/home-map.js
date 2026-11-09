// Mapa dos Sinais na Home: reutiliza o mapa existente (signal-map.js, mesmos dados e popups),
// carregando-o só quando a seção chega perto da tela. Não altera o mapa nem seus dados.
const el = document.querySelector("[data-signal-map]");
if (el) {
  const go = () => import("./signal-map.js");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); go(); } }, { rootMargin: "300px" }).observe(el);
  } else go();
}
