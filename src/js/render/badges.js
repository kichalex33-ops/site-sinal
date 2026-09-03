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
  dossie: "Nível 3 · Dossiê revisado",
};

const MATURITY_TITLE = {
  registro: "Ficha mínima: pouca ou nenhuma fonte rastreável ainda.",
  indexado: "Documentado e com fontes rastreáveis, mas ainda sem auditoria factual web formal.",
  dossie: "Passou por auditoria factual web documentada — não é atribuído automaticamente por completude de cadastro.",
};

export function maturityBadge(maturidade) {
  return `<span class="badge badge--maturity--${maturidade}" title="${escapeHtml(MATURITY_TITLE[maturidade] ?? "")}">${escapeHtml(MATURITY_LABEL[maturidade] ?? maturidade)}</span>`;
}

export function provenanceBadge(text) {
  return `<span class="badge badge--provenance">${escapeHtml(text)}</span>`;
}

// Sete categorias de integridade de arquivo. "Digitalização" nunca é tratada
// como "Original" — são coisas diferentes mesmo quando a digitalização é a
// cópia institucional de referência.
const INTEGRITY_CLASS = {
  "Original digital": "original-digital",
  "Digitalização institucional": "digitalizacao-institucional",
  "Cópia preservada": "copia-preservada",
  "Reprodução": "reproducao",
  "Derivado de análise": "derivado-de-analise",
  "Ilustração": "ilustracao",
  "Origem incerta": "origem-incerta",
};

export function integrityBadge(versao) {
  const cls = INTEGRITY_CLASS[versao] ?? "origem-incerta";
  return `<span class="badge badge--integrity--${cls}">${escapeHtml(versao)}</span>`;
}

export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
