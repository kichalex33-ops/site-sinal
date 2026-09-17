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
import "./home-comments.js";
import "./reading.js";
import "./comments.js";

// Mapa estelar 3D: só carrega three.js se a página tiver o container (evita peso nas outras).
const starmapRoot = document.querySelector("[data-starmap]");
if (starmapRoot) {
  const dataEl = document.getElementById("starmap-data");
  const points = dataEl ? JSON.parse(dataEl.textContent) : [];
  import("./starmap.js").then((m) => m.initStarmap(starmapRoot, points));
}

const solarRoot = document.querySelector("[data-solar-system]");
if (solarRoot) {
  import("./solarsystem.js").then((m) => m.initSolarSystem(solarRoot));
}

// Modelos 3D NASA (<model-viewer>): só carrega o custom element se a página tiver algum.
// reveal="manual" exige chamar dismissPoster() explicitamente — o clique no botão
// próprio (não o poster nativo) é o que efetivamente baixa o GLB.
if (document.querySelector("model-viewer")) {
  import("@google/model-viewer").then(() => {
    document.querySelectorAll("[data-nasa-reveal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const viewer = btn.closest("model-viewer");
        viewer?.dismissPoster();
      });
    });
  });
}

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
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        /* cancelado — cai no fallback */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      const original = btn.textContent;
      btn.textContent = "Link copiado";
      setTimeout(() => { btn.textContent = original; }, 2000);
    } catch {
      /* sem acesso à área de transferência */
    }
  });
});
