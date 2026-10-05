// Revelação suave ao rolar. Progressive enhancement: só esconde elementos
// depois de marcar <html>, então se este script falhar, nada some da página.
const targets = document.querySelectorAll(
  ".card, .yt-card, .paper:not(.reading-paper), .update-row, .timeline__item, .contradiction, .knowns__panel"
);

if (targets.length && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const groups = new Map();
  targets.forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) ?? 0;
    el.style.setProperty("--reveal-delay", `${Math.min(i, 8) * 60}ms`);
    groups.set(parent, i + 1);
    el.setAttribute("data-reveal-init", "");
  });

  document.documentElement.classList.add("js-reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 }
  );

  targets.forEach((el) => observer.observe(el));
}
