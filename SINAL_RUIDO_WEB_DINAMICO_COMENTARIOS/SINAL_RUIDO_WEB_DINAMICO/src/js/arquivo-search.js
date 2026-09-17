import { gridLoader } from "./grid-loader.js";

const input = document.querySelector("[data-arquivo-input]");
const results = document.querySelector("[data-arquivo-results]");
const filters = document.querySelector("[data-arquivo-filters]");
const categories = document.querySelector("[data-arquivo-categories]");

if (input && results) {
  let index = [];
  let loaded = false;
  let loading = null;
  let type = "all";

  function ensureIndex() {
    if (loaded) return Promise.resolve();
    if (!loading) {
      loading = fetch("/search-index.json")
        .then((res) => res.json())
        .then((data) => { index = data; loaded = true; });
    }
    return loading;
  }

  function renderMatches() {
    const q = input.value.trim().toLowerCase();
    const byType = (item) => type === "all" || item.type === type;
    const byQuery = (item) =>
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.tags || []).some((t) => (t || "").toLowerCase().includes(q));

    const matches = index.filter(byType).filter(byQuery).slice(0, 60);

    if (matches.length === 0) {
      results.innerHTML = `<li class="arquivo-results__empty">Nada encontrado${q ? ` para "${input.value.trim()}"` : ""}.</li>`;
      return;
    }

    results.innerHTML = matches
      .map((item) => `
        <li>
          <a href="${item.url}">
            <span class="arquivo-results__type">${item.type}</span>
            <span class="arquivo-results__title">${item.title}</span>
          </a>
        </li>`)
      .join("");
  }

  async function render() {
    const q = input.value.trim();
    if (!q && type === "all") {
      results.innerHTML = "";
      results.hidden = true;
      if (categories) categories.hidden = false;
      return;
    }
    if (categories) categories.hidden = true;
    results.hidden = false;

    if (!loaded) {
      const li = document.createElement("li");
      li.className = "arquivo-results__loading";
      li.appendChild(gridLoader());
      results.replaceChildren(li);
      await ensureIndex();
    }
    renderMatches();
  }

  render();
  input.addEventListener("input", render);

  filters?.querySelectorAll("[data-filter-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.querySelectorAll("[data-filter-value]").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      type = btn.dataset.filterValue;
      render();
    });
  });
}
