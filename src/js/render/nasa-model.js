import { escapeHtml } from "./badges.js";

// Bloco de modelo 3D NASA: <model-viewer> com poster, carregamento sob demanda
// (o GLB só baixa quando o visitante clica), crédito obrigatório e fallback
// textual completo para quando WebGL/JS não estiverem disponíveis.
// autoRotate é sempre falso por padrão — o visitante controla a rotação.
export function nasaModelViewer(m) {
  const posterAttr = m.poster ? `poster="${escapeHtml(m.poster)}"` : "";
  return `
    <div class="nasa-model" data-nasa-model>
      <model-viewer
        src="${escapeHtml(m.localPath)}"
        alt="${escapeHtml(m.title)} — modelo 3D, fonte ${escapeHtml(m.credit)}"
        ${posterAttr}
        loading="lazy"
        reveal="manual"
        camera-controls
        touch-action="pan-y"
        auto-rotate="false"
        interaction-prompt="none"
        class="nasa-model__viewer"
        data-nasa-model-el
      >
        <div slot="poster" class="nasa-model__poster">
          ${m.poster ? `<img src="${escapeHtml(m.poster)}" alt="" loading="lazy" class="nasa-model__poster-img" />` : ""}
          <button type="button" class="btn btn--primary nasa-model__reveal" data-nasa-reveal aria-label="Carregar modelo 3D de ${escapeHtml(m.title)}">Explorar em 3D →</button>
        </div>
        <div slot="progress-bar"></div>
      </model-viewer>
      <noscript>
        <p class="nasa-model__noscript">
          O visualizador 3D exige JavaScript. Consulte o modelo diretamente na
          <a href="${escapeHtml(m.sourcePage)}" target="_blank" rel="noopener">página oficial da NASA</a>.
        </p>
      </noscript>
      <div class="nasa-model__meta">
        <span class="mono nasa-model__question">${escapeHtml(m.question)}</span>
        <h3>${escapeHtml(m.title)}</h3>
        <p>${escapeHtml(m.description)}</p>
        <p class="mono nasa-model__credit">Fonte: ${escapeHtml(m.agency)} · Crédito: ${escapeHtml(m.credit)}
          <a href="${escapeHtml(m.sourcePage)}" target="_blank" rel="noopener">Ver fonte oficial ↗</a>
        </p>
      </div>
    </div>`;
}
