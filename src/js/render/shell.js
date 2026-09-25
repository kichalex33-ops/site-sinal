const NAV = [
  {
    href: "/livro/amostra/", label: "Ler", match: ["/livro/amostra/", "/livro/sample/"],
    children: [
      { href: "/livro/amostra/", label: "Amostra de SINAL/RUÍDO" },
      { href: "/livro/amostra/#capitulos", label: "Capítulos" },
    ],
  },
  {
    href: "/#livros", label: "Livros", match: ["/livros/", "/livro/"],
    children: [
      { href: "/livros/sinal-ruido/", label: "SINAL/RUÍDO — Origem" },
      { href: "/#cronicas", label: "Crônicas Cosmológicas I–X" },
    ],
  },
  {
    href: "/arquivo/", label: "Arquivo", match: ["/arquivo/", "/casos/", "/documentos/", "/colecoes/", "/midia/", "/metodo/"],
    children: [
      { href: "/casos/", label: "Casos reais" },
      { href: "/documentos/", label: "Documentos" },
      { href: "/midia/#videos", label: "Vídeos" },
      { href: "/midia/#imagens", label: "Imagens" },
      { href: "/colecoes/", label: "Coleções" },
      { href: "/metodo/", label: "Pesquisa" },
    ],
  },
  {
    href: "/contato/", label: "Contato", match: ["/contato/", "/imprensa/"],
    children: [
      { href: "/contato/#autor", label: "Autor" },
      { href: "/imprensa/", label: "Imprensa" },
      { href: "/contato/#profissional", label: "Contato profissional" },
    ],
  },
];

function isCurrent(item, currentPath) {
  return (item.match || [item.href]).some((m) => (m === "/livro/" ? currentPath === m : currentPath.startsWith(m)));
}

function navLink(item, currentPath, mobile = false) {
  const current = isCurrent(item, currentPath) ? ' aria-current="page"' : "";
  const parent = `<a href="${item.href}"${current}>${item.label}</a>`;
  if (!item.children) return parent;
  const subs = item.children.map((c) => `<a href="${c.href}">${c.label}</a>`).join("");
  return mobile
    ? `${parent}<div class="mobile-sub">${subs}</div>`
    : `<div class="nav-group">${parent}<div class="nav-sub">${subs}</div></div>`;
}

function escapeAttr(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

const SITE_URL = "https://sinalruido.com.br";

export function page({
  title,
  description,
  path,
  bodyHtml,
  extraHead = "",
  ogImage = "/og/arquivo.png",
  robots = "index,follow",
  lang = "pt-BR",
  ogLocale = "pt_BR",
  alternates = [],
  minimal = false,
}) {
  const fullTitle = title === "SINAL/RUÍDO" ? title : `${title} · SINAL/RUÍDO`;
  const safeTitle = escapeAttr(fullTitle);
  const safeDescription = escapeAttr(description);
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;
  const alternatesHtml = alternates.map((a) => `<link rel="alternate" hreflang="${escapeAttr(a.hreflang)}" href="${escapeAttr(a.href)}" />`).join("\n  ");
  const skipText = lang.startsWith("pt") ? "Pular para o conteúdo" : "Skip to content";
  const fullHeader = `  <header class="site-header">
    <div class="container site-header__row">
      <a href="/" class="brand">
        <span class="brand__mark">SINAL<b>/</b>RUÍDO</span>
        <span class="brand__sub">Romance de investigação · Alex Jr. Kich</span>
      </a>
      <nav class="main-nav" aria-label="Navegação principal">
        ${NAV.map((i) => navLink(i, path)).join("")}
      </nav>
      <div class="header-actions">
        <a href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener" class="social-icon-link" aria-label="SINAL/RUÍDO no Instagram">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
            <circle cx="12" cy="12" r="4.3" />
            <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <button type="button" class="search-trigger" data-cmdk-open aria-haspopup="dialog">
          Buscar no arquivo…
          <kbd>Ctrl K</kbd>
        </button>
        <button type="button" class="mobile-nav-toggle" data-mobile-nav-toggle aria-label="Abrir menu" aria-expanded="false">☰</button>
      </div>
    </div>
    <nav class="mobile-nav container" data-mobile-nav aria-label="Navegação (compacta)">
      ${NAV.map((i) => navLink(i, path, true)).join("")}
    </nav>
  </header>`;
  const fullFooter = `  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div>
        <span class="brand__mark">SINAL<b>/</b>RUÍDO</span>
        <p class="mono" style="margin-top:8px">SINAL/RUÍDO é o site oficial do romance de Alex Jr. Kich. Leia os primeiros capítulos, conheça a pesquisa que inspirou a história e decida se quer continuar.</p>
        <p class="mono" style="margin-top:8px">Um sinal chega de onde não deveria vir.</p>
      </div>
      <div class="mono footer-links">
        <a href="/livro/amostra/">Ler 3 capítulos</a>
        <a href="/livro/">O livro</a>
        <a href="/leitores/">Leitores</a>
        <a href="/imprensa/">Imprensa</a>
        <a href="/contato/">Contato</a>
        <a href="/privacidade/">Privacidade</a>
        <a href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Instagram</a>
        <span>Ainda não leu? Comece agora.</span>
      </div>
    </div>
  </footer>`;
  const cmdkHtml = `  <div class="cmdk-backdrop" data-cmdk-backdrop>
    <div class="cmdk" role="dialog" aria-modal="true" aria-label="Busca">
      <input type="text" placeholder="Buscar caso, documento, coleção, mídia, órgão, local…" data-cmdk-input autocomplete="off" />
      <ul data-cmdk-results></ul>
    </div>
  </div>`;
  const minimalHeader = `  <header class="site-header">
    <div class="container site-header__row">
      <a href="/" class="brand">
        <span class="brand__mark">SINAL<b>/</b>RUÍDO</span>
        <span class="brand__sub">SIGNAL/NOISE · Alex Jr. Kich</span>
      </a>
      <div class="header-actions">
        <a href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener" class="social-icon-link" aria-label="Instagram @sinal_ruido">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
            <circle cx="12" cy="12" r="4.3" />
            <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </div>
  </header>`;
  const minimalFooter = `  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div><span class="brand__mark">SINAL<b>/</b>RUÍDO</span></div>
      <div class="mono footer-links">
        <a href="/">Home</a>
        <a href="/privacidade/">Privacy</a>
        <a href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Instagram</a>
      </div>
    </div>
  </footer>`;

  return `<!doctype html>
<html lang="${escapeAttr(lang)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <meta name="robots" content="${escapeAttr(robots)}" />
  <meta name="theme-color" content="#0B0E14" />
  <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
  <link rel="canonical" href="${escapeAttr(canonicalUrl)}" />${alternatesHtml ? `
  ${alternatesHtml}` : ""}
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeAttr(canonicalUrl)}" />
  <meta property="og:site_name" content="SINAL/RUÍDO" />
  <meta property="og:locale" content="${escapeAttr(ogLocale)}" />
  <meta property="og:image" content="${escapeAttr(ogImageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${escapeAttr(ogImageUrl)}" />
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
  <a href="#conteudo" class="skip-link">${skipText}</a>

${minimal ? minimalHeader : fullHeader}

  <main id="conteudo">${bodyHtml}</main>

${minimal ? minimalFooter : fullFooter}

${minimal ? "" : cmdkHtml}

  <script type="module" src="/src/js/main.js"></script>
</body>
</html>`;
}
