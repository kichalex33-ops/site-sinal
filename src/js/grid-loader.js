// Indicador de carregamento reutilizável — grade 3x3, CSS puro.
export function gridLoader() {
  const el = document.createElement("div");
  el.className = "grid-loader";
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "Carregando");
  for (let i = 0; i < 9; i++) el.appendChild(document.createElement("span"));
  return el;
}
