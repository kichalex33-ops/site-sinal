// Galeria de cartazes: filtros (idioma + cor) e visualizacao ampliada em <dialog>.
const filters = document.querySelector("[data-poster-filters]");
const groups = document.querySelector("[data-poster-groups]");
if (filters && groups) {
  const state = { lang: "all", color: "all" };
  const apply = () => {
    groups.querySelectorAll(".poster-card").forEach((c) => {
      c.hidden = !((state.lang === "all" || c.dataset.lang === state.lang) && (state.color === "all" || c.dataset.color === state.color));
    });
    groups.querySelectorAll("[data-poster-group]").forEach((g) => {
      g.hidden = state.lang !== "all" && g.dataset.posterGroup !== state.lang;
    });
  };
  filters.querySelectorAll("[data-poster-filter]").forEach((b) => b.addEventListener("click", () => {
    const group = b.dataset.posterFilter;
    filters.querySelectorAll(`[data-poster-filter="${group}"]`).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    state[group] = b.dataset.filterValue;
    apply();
  }));
}

const dlg = document.querySelector("[data-poster-dialog]");
if (dlg && typeof dlg.showModal === "function") {
  const img = dlg.querySelector("[data-poster-img]");
  const name = dlg.querySelector("[data-poster-name]");
  const dl = dlg.querySelector("[data-poster-dl]");
  let opener = null;
  document.querySelectorAll("[data-poster-open]").forEach((b) => b.addEventListener("click", () => {
    opener = b;
    img.src = b.dataset.full;
    img.alt = b.dataset.alt;
    name.textContent = b.dataset.name;
    dl.href = b.dataset.full;
    dlg.showModal();
  }));
  dlg.querySelector("[data-poster-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { img.removeAttribute("src"); opener?.focus(); });
} else {
  // sem <dialog>: o botao abre o arquivo em tamanho real
  document.querySelectorAll("[data-poster-open]").forEach((b) => b.addEventListener("click", () => window.open(b.dataset.full, "_blank", "noopener")));
}
