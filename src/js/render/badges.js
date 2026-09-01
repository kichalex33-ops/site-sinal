const EDITORIAL_LABEL = {
  aberto: "Em investigação",
  revisado: "Revisado",
  controverso: "Controverso",
  "revisao-pendente": "Revisão pendente",
};

export function editorialBadge(status, label) {
  return `<span class="badge badge--editorial--${status}">${escapeHtml(label ?? EDITORIAL_LABEL[status] ?? status)}</span>`;
}

const MATURITY_LABEL = {
  registro: "Nível 1 · Registro",
  indexado: "Nível 2 · Caso indexado",
  dossie: "Nível 3 · Dossiê",
};

export function maturityBadge(maturidade) {
  return `<span class="badge badge--maturity--${maturidade}" title="Profundidade de documentação coletada — não indica se o caso já passou por auditoria editorial.">${escapeHtml(MATURITY_LABEL[maturidade] ?? maturidade)}</span>`;
}

export function provenanceBadge(text) {
  return `<span class="badge badge--provenance">${escapeHtml(text)}</span>`;
}

const INTEGRITY_CLASS = {
  Original: "original",
  Digitalização: "digitalizacao",
  Reprodução: "derived",
  Ilustração: "derived",
};

export function integrityBadge(versao) {
  const cls = INTEGRITY_CLASS[versao] ?? "uncertain";
  return `<span class="badge badge--integrity--${cls}">${escapeHtml(versao)}</span>`;
}

export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
