// Abre a janela de sinopse e dados do livro (dialog) ao clicar no livro na vitrine da home.
// Sem suporte a <dialog> ou com clique modificado (ctrl/cmd/shift), o link normal leva à página do livro.
const openers = document.querySelectorAll("[data-book-open]");
if (openers.length && typeof HTMLDialogElement !== "undefined") {
  const byId = (slug) => document.getElementById("livro-" + slug);
  const open = (slug, remember = true) => {
    const d = byId(slug);
    if (!d || d.open || typeof d.showModal !== "function") return false;
    d.showModal();
    if (remember) history.replaceState(null, "", "#livro-" + slug);
    return true;
  };
  openers.forEach((a) => {
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (open(a.dataset.bookOpen)) e.preventDefault();
    });
  });
  document.querySelectorAll("dialog.book-dialog").forEach((d) => {
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
    d.addEventListener("close", () => {
      if (location.hash.startsWith("#livro-")) history.replaceState(null, "", location.pathname + location.search);
    });
  });
  if (location.hash.startsWith("#livro-")) open(location.hash.slice(7), false);
}
