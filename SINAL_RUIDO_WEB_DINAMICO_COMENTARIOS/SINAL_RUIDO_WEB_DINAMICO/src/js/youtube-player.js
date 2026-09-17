import { gridLoader } from "./grid-loader.js";

// Facade lite-embed: só carrega o iframe do YouTube (e seus cookies/scripts) após o clique.
document.querySelectorAll("[data-yt-frame]").forEach((frame) => {
  frame.addEventListener("click", () => {
    const id = frame.dataset.ytFrame;
    if (!id) return;

    const loader = gridLoader();
    frame.replaceChildren(loader);

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    iframe.title = frame.dataset.ytTitle || "Vídeo do YouTube";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.opacity = "0";
    iframe.style.transition = "opacity 0.2s ease";
    iframe.addEventListener("load", () => {
      loader.remove();
      iframe.style.opacity = "1";
    }, { once: true });

    frame.appendChild(iframe);
  }, { once: true });
});
