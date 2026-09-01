const backdrop = document.querySelector("[data-cmdk-backdrop]");
const input = document.querySelector("[data-cmdk-input]");
const results = document.querySelector("[data-cmdk-results]");

if (backdrop && input && results) {
  let index = [];
  let loaded = false;

  async function ensureIndex() {
    if (loaded) return;
    const res = await fetch("/search-index.json");
    index = await res.json();
    loaded = true;
  }

  function open() {
    backdrop.classList.add("is-open");
    ensureIndex().then(render);
    input.focus();
  }
  function close() {
    backdrop.classList.remove("is-open");
    input.value = "";
  }

  document.querySelectorAll("[data-cmdk-open]").forEach((btn) => btn.addEventListener("click", open));

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      backdrop.classList.contains("is-open") ? close() : open();
    }
    if (e.key === "Escape" && backdrop.classList.contains("is-open")) close();
  });

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  function render() {
    const q = input.value.trim().toLowerCase();
    const matches = q
      ? index.filter((item) =>
          item.title.toLowerCase().includes(q) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(q))
        ).slice(0, 20)
      : index.slice(0, 8);

    if (matches.length === 0) {
      results.innerHTML = `<li class="cmdk__empty">Nada encontrado para "${q}".</li>`;
      return;
    }

    results.innerHTML = matches
      .map(
        (item) => `
      <li>
        <a href="${item.url}">
          <span class="cmdk-type">${item.type}</span>
          <div>${item.title}</div>
        </a>
      </li>`
      )
      .join("");
  }

  input.addEventListener("input", render);
}
