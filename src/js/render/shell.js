const NAV = [
  { href: "/arquivo/", label: "Arquivo" },
  { href: "/colecoes/", label: "Coleções" },
  { href: "/midia/", label: "Mídia" },
  { href: "/noticias/", label: "Notícias" },
  { href: "/livro/", label: "Livro" },
  { href: "/leitores/", label: "Leitores" },
  { href: "/contato/", label: "Contato" },
];

function navLink(item, currentPath) {
  const current = currentPath === item.href ? ' aria-current="page"' : "";
  return `<a href="${item.href}"${current}>${item.label}</a>`;
}

function escapeAttr(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

const SITE_URL = "https://sinalruido.com.br";

export function page({ title, description, path, bodyHtml, extraHead = "" }) {
  const fullTitle = title === "SINAL/RUÍDO" ? title : `${title} · SINAL/RUÍDO`;
  const safeTitle = escapeAttr(fullTitle);
  const safeDescription = escapeAttr(description);
  const canonicalUrl = `${SITE_URL}${path}`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <meta name="theme-color" content="#0B0E14" />
  <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
  <link rel="canonical" href="${escapeAttr(canonicalUrl)}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeAttr(canonicalUrl)}" />
  <meta property="og:site_name" content="SINAL/RUÍDO" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:image" content="${SITE_URL}/livro/capa.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&display=swap" />
  <link rel="stylesheet" href="/src/css/tokens.css" />
  <link rel="stylesheet" href="/src/css/reset.css" />
  <link rel="stylesheet" href="/src/css/base.css" />
  <link rel="stylesheet" href="/src/css/layout.css" />
  <link rel="stylesheet" href="/src/css/components.css" />
  ${extraHead}
</head>
<body>
  <a href="#conteudo" class="skip-link">Pular para o conteúdo</a>

  <header class="site-header">
    <div class="container site-header__row">
      <a href="/" class="brand">
        <span class="brand__mark">SINAL<b>/</b>RUÍDO</span>
        <span class="brand__sub">Arquivo instrumental brasileiro</span>
      </a>
      <nav class="main-nav" aria-label="Navegação principal">
        ${NAV.map((i) => navLink(i, path)).join("")}
      </nav>
      <div class="header-actions">
        <button type="button" class="search-trigger" data-cmdk-open aria-haspopup="dialog">
          Buscar caso, coleção, mídia…
          <kbd>Ctrl K</kbd>
        </button>
        <button type="button" class="mobile-nav-toggle" data-mobile-nav-toggle aria-label="Abrir menu" aria-expanded="false">☰</button>
      </div>
    </div>
    <nav class="mobile-nav container" data-mobile-nav aria-label="Navegação (compacta)">
      ${NAV.map((i) => navLink(i, path)).join("")}
    </nav>
  </header>

  <main id="conteudo">${bodyHtml}</main>

  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div>
        <span class="brand__mark">SINAL<b>/</b>RUÍDO</span>
        <p class="mono" style="margin-top:8px">Arquivo instrumental brasileiro, de escopo internacional, dedicado a organizar evidências, testemunhos e hipóteses com proveniência, contradição e revisão explícitas.</p>
      </div>
      <div class="mono" style="display:flex;flex-direction:column;gap:6px">
        <a href="/contato/">Enviar relato, sugestão ou mensagem</a>
        <span>Não identificado não significa extraterrestre.</span>
      </div>
    </div>
  </footer>

  <div class="cmdk-backdrop" data-cmdk-backdrop>
    <div class="cmdk" role="dialog" aria-modal="true" aria-label="Busca">
      <input type="text" placeholder="Buscar caso, coleção, mídia, órgão, local…" data-cmdk-input autocomplete="off" />
      <ul data-cmdk-results></ul>
    </div>
  </div>

  <script type="module" src="/src/js/main.js"></script>
</body>
</html>`;
}
