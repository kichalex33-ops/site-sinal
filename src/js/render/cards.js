import { editorialBadge, escapeHtml } from "./badges.js";

export function caseCard(c) {
  return `
    <a class="card" href="/casos/${c.slug}/" data-search-item data-title="${escapeHtml(c.title)}">
      <span class="card__meta">${escapeHtml(c.code)} · ${escapeHtml(c.date)}</span>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.resumo)}</p>
      <div class="card__badges">${editorialBadge(c.status, c.statusLabel)}</div>
    </a>`;
}

export function collectionCard(col) {
  return `
    <a class="card" href="/colecoes/${col.slug}/">
      <span class="card__meta">${escapeHtml(col.country)} · ${escapeHtml(col.period)}</span>
      <h3>${escapeHtml(col.name)}</h3>
      <p>${escapeHtml(col.institution)}</p>
      <p>${escapeHtml(col.description)}</p>
    </a>`;
}

export function mediaCard(m) {
  const thumb = m.tipo === "video"
    ? `<div class="media-card__thumb media-card__thumb--video">Vídeo ▶</div>`
    : `<img class="media-card__thumb" src="${escapeHtml(m.src)}" alt="${escapeHtml(m.titulo)}" loading="lazy" />`;
  return `
    <a class="card" style="padding:0;overflow:hidden" href="/midia/${m.slug}/" data-tipo="${m.tipo}">
      ${thumb}
      <div style="padding:16px">
        <span class="card__meta">${escapeHtml(m.tipo)}</span>
        <h3 style="font-size:14px">${escapeHtml(m.titulo)}</h3>
        <p>${escapeHtml(m.caseTitle)}</p>
      </div>
    </a>`;
}
