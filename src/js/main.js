import "./command-palette.js";
import "./popovers.js";
import "./filters.js";
import "./media-player.js";
import "./youtube-player.js";
import "./arquivo-search.js";
import "./reveal.js";
import "./ambience.js";
import "./intro.js";
import "./home-motion.js";
import "./hero-signal-line.js";
import "./reading.js";
import "./buy-router.js";
import "./book-dialog.js";
import "./poster-gallery.js";

// Mapa dos Sinais: Leaflet e formulário só carregam na própria página
if (document.querySelector("[data-signal-map]")) import("./signal-map.js");
if (document.querySelector("[data-signal-form]")) import("./signal-form.js");

// Menu mobile
const toggle = document.querySelector("[data-mobile-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
if (toggle && mobileNav) {
  toggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Botão de copiar código Pix
document.querySelectorAll("[data-copy-pix]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const code = document.querySelector("[data-pix-code]")?.textContent?.trim();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      const original = btn.textContent;
      btn.textContent = "Código copiado";
      setTimeout(() => { btn.textContent = original; }, 2000);
    } catch {
      /* sem acesso à área de transferência */
    }
  });
});

// Botão de compartilhar (Web Share API + fallback de copiar link)
document.querySelectorAll("[data-share]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const title = btn.dataset.shareTitle || document.title;
    const text = btn.dataset.shareText || "";
    const url = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      const original = btn.textContent;
      btn.textContent = "Link copiado";
      setTimeout(() => { btn.textContent = original; }, 2000);
    } catch {
      const status = document.querySelector("[data-share-status]");
      if (status) status.textContent = "Não foi possível copiar. Copie o endereço da página.";
    }
  });
});
import "./conversion.js";

