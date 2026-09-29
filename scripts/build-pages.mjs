import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { page } from "../src/js/render/shell.js";
import { caseCard, collectionCard, mediaCard } from "../src/js/render/cards.js";
import { editorialBadge, maturityBadge, provenanceBadge, integrityBadge, escapeHtml } from "../src/js/render/badges.js";
import { marketList, buyLinks, buyData, validateI18n } from "./i18n.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dataDir = join(root, "src/data");

const capasDir = join(root, "public/capas");

const cases = JSON.parse(readFileSync(join(dataDir, "cases.json"), "utf-8")).map((c) => ({
  ...c,
  coverSrc: existsSync(join(capasDir, `${c.slug}.png`)) ? `/capas/${c.slug}.png` : null,
}));
// Casos com traducao para o ingles (so os ligados ao romance por enquanto; ver /en/archive/).
// Traducao com fidelidade as fontes, feita a mao — nao e geracao mecanica.
const casesEn = JSON.parse(readFileSync(join(dataDir, "cases-en.json"), "utf-8")).map((c) => ({
  ...c,
  coverSrc: existsSync(join(capasDir, `${c.slug}.png`)) ? `/capas/${c.slug}.png` : null,
}));
const collections = JSON.parse(readFileSync(join(dataDir, "collections.json"), "utf-8"));
const media = JSON.parse(readFileSync(join(dataDir, "media.json"), "utf-8"));
const corrections = JSON.parse(readFileSync(join(dataDir, "corrections.json"), "utf-8"));
const updates = JSON.parse(readFileSync(join(dataDir, "updates.json"), "utf-8"));
const noticias = JSON.parse(readFileSync(join(dataDir, "noticias.json"), "utf-8"));
const books = JSON.parse(readFileSync(join(dataDir, "books.json"), "utf-8"));

const documents = cases.flatMap((c) =>
  (c.documentos || []).map((d, index) => ({
    ...d,
    slug: `${c.slug}-${String(index + 1).padStart(2, "0")}`,
    caseSlug: c.slug,
    caseTitle: c.title,
    caseCode: c.code,
  }))
);

const bookSheets = JSON.parse(readFileSync(join(dataDir, "book-sheets.json"), "utf-8"));
const bookSheetsEn = JSON.parse(readFileSync(join(dataDir, "book-sheets-en.json"), "utf-8"));
const sampleChaptersData = JSON.parse(readFileSync(join(dataDir, "sample-chapters.json"), "utf-8"));
const SAMPLE_CHAPTERS = sampleChaptersData.map((c) => ({
  id: `chapter-${c.n}`,
  n: c.n,
  title: c.title,
  paragraphs: c.paragraphs,
}));

const sampleChaptersDataEn = JSON.parse(readFileSync(join(dataDir, "sample-chapters-en.json"), "utf-8"));
const SAMPLE_CHAPTERS_EN = sampleChaptersDataEn.map((c) => ({
  id: `chapter-${c.n}-en`,
  n: c.n,
  title: c.title,
  paragraphs: c.paragraphs,
}));

const SITE_URL = "https://sinalruido.com.br";
const routes = [];

function write(routePath, html) {
  const dir = routePath === "/" ? root : join(root, routePath.replace(/^\//, ""));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  routes.push(routePath === "/" ? "/" : `/${routePath.replace(/^\/|\/$/g, "")}/`);
}

function writeStatic(routePath, content) {
  // written into public/ (not root) so `vite build` copies it verbatim into dist/
  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(join(root, "public", routePath), content);
}

function clean(routePath) {
  const dir = join(root, routePath.replace(/^\//, ""));
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}

// ---------------------------------------------------------------------
// HOME
// ---------------------------------------------------------------------
// Painel "onde comprar": agrupa lojas por edição (PT / EN) com formato + loja + seta.
// Botão de compra: ícone da loja (Amazon) e preço opcional. Preço só aparece se informado nos dados
// (books.json: `prices` por campo de link, ou `purchasePrice`); nunca é inventado.
const AMAZON_ICON = `<svg class="buy-link__icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z"/></svg>`;
function buyLinkHtml(url, format, store, price) {
  if (!url) return "";
  const icon = /^Amazon/.test(store) ? AMAZON_ICON : "";
  return `<a class="buy-link" href="${escapeHtml(url)}" target="_blank" rel="noopener"><span class="buy-link__format">${format}</span><span class="buy-link__store">${icon}<span>${store}</span>${price ? `<em class="buy-link__price">${escapeHtml(price)}</em>` : ""}</span><span class="buy-link__arrow" aria-hidden="true">↗</span></a>`;
}

function buyPanel(book, { hideEnBr = false, hidePt = false } = {}) {
  const link = buyLinkHtml;
  const pr = (k) => (book.prices || {})[k];
  const pt = [
    link(book.purchaseUrl, "Ebook", "Amazon Kindle", pr("purchaseUrl")),
    link(book.purchaseUrlUiclap, "Impresso", "UICLAP", pr("purchaseUrlUiclap")),
  ].join("");
  const en = [
    link(book.purchaseUrlEn, "Ebook", "Amazon US", pr("purchaseUrlEn")),
    hideEnBr ? "" : link(book.purchaseUrlEnBr, "Ebook", "Amazon BR", pr("purchaseUrlEnBr")),
    link(book.purchaseUrlEnUk, "Paperback", "Amazon UK", pr("purchaseUrlEnUk")),
  ].join("");
  const es = [
    link(book.purchaseUrlEs, "Ebook", "Amazon ES", pr("purchaseUrlEs")),
  ].join("");
  return `<div class="buy-panel">
    ${hidePt ? "" : pt ? `<div class="buy-group"><span class="buy-group__title">Português</span><div class="buy-group__links">${pt}</div></div>` : `<span class="btn btn--disabled" aria-disabled="true">Comprar · EM BREVE</span>`}
    ${en ? `<div class="buy-group"><span class="buy-group__title">English edition</span><div class="buy-group__links">${en}<a class="buy-link buy-link--sample" href="/livro/sample/"><span class="buy-link__format">Free</span><span class="buy-link__store">Read sample</span><span class="buy-link__arrow" aria-hidden="true">→</span></a><a class="buy-link" href="/buy/"><span class="buy-link__format">More</span><span class="buy-link__store">Other countries</span><span class="buy-link__arrow" aria-hidden="true">→</span></a></div></div>` : ""}
    ${es ? `<div class="buy-group"><span class="buy-group__title">Edición en español</span><div class="buy-group__links">${es}</div></div>` : ""}
  </div>`;
}

// Vitrine da página inicial: destaque para os livros à venda e catálogo completo (substitui a antiga /livros/).
const isOnSale = (b) => Boolean(b.purchaseUrl || b.purchaseUrlEn || b.purchaseUrlUiclap);

// Janela com sinopse e dados do livro (só PT, sem as seções ocultas). Abre ao clicar no livro na vitrine;
// sem JavaScript o clique segue para a página completa do livro.
function bookDialogHtml(b) {
  const sh = bookSheets[b.slug] || {};
  const isOrigin = b.slug === "sinal-ruido";
  const paras = (t) => String(t || "").split(/\n\s*\n/).filter(Boolean).map((x) => `<p>${escapeHtml(x)}</p>`).join("");
  const href = `/livros/${b.slug}/`;
  const onSale = isOnSale(b);
  const rows = [
    ...(isOrigin ? [["Tipo", "Obra de origem, fora da numeração das Crônicas Cosmológicas"]] : [["Série", "Crônicas Cosmológicas"], ["Volume", b.numeral]]),
    ["Autor", b.author],
    ["Status", onSale ? "À venda" : b.status],
  ].filter((r) => r[1]);
  const buy = isOrigin
    ? [buyLinkHtml(b.purchaseUrl, "Ebook", "Amazon Kindle", (b.prices || {}).purchaseUrl), buyLinkHtml(b.purchaseUrlUiclap, "Impresso", "UICLAP", (b.prices || {}).purchaseUrlUiclap)].join("")
    : buyLinkHtml(b.purchaseUrl, "Comprar", "Amazon BR", b.purchasePrice);
  const chars = (sh.personagens || []).map((c) => `<div class="card" style="cursor:default"><h3>${escapeHtml(c.nome)}</h3><p style="margin-top:6px">${escapeHtml(c.descricao || "")}</p></div>`).join("");
  return `
    <dialog class="book-dialog" id="livro-${b.slug}" aria-labelledby="livro-${b.slug}-t">
      <div class="book-dialog__inner">
        <form method="dialog" class="book-dialog__bar"><button class="book-dialog__close" aria-label="Fechar">×</button></form>
        <div class="book-dialog__hero">
          <img src="${escapeHtml(b.cover)}" alt="Capa de ${escapeHtml(b.title)}" width="300" height="480" loading="lazy" />
          <div>
            <span class="badge badge--sale">${isOrigin ? "OBRA DE ORIGEM" : escapeHtml(b.numeral) + " · " + (onSale ? "À VENDA" : escapeHtml(b.status))}</span>
            <h2 id="livro-${b.slug}-t" style="margin-top:10px">${escapeHtml(b.title)}</h2>
            ${sh.tagline ? `<p class="vitrine-card__tagline" style="margin-top:8px">${escapeHtml(sh.tagline)}</p>` : ""}
            <div class="book-dialog__text">${paras(sh.synopsis || b.description)}</div>
            ${buy ? `<div class="buy-group__links" style="margin-top:14px">${buy}</div>` : ""}
          </div>
        </div>
        <div class="book-dialog__data">
          <section class="paper book-sheet__box"><span class="kicker">Ficha</span><dl class="book-sheet__dl">${rows.map((r) => `<div><dt>${escapeHtml(r[0])}</dt><dd>${escapeHtml(r[1])}</dd></div>`).join("")}</dl></section>
          ${(sh.ambientacao || {}).texto ? `<section class="paper book-sheet__box"><span class="kicker">Onde se ambienta</span>${paras(sh.ambientacao.texto)}</section>` : ""}
        </div>
        ${chars ? `<section style="margin-top:22px"><span class="kicker">Personagens</span><div class="grid grid--3" style="margin-top:12px">${chars}</div></section>` : ""}
        <p class="book-dialog__more"><a class="btn btn--primary" href="${href}">Ver página completa →</a></p>
      </div>
    </dialog>`;
}

function homeShowcase() {
  const origin = books.find((b) => b.slug === "sinal-ruido");
  const gods = books.find((b) => b.slug === "os-deuses-nao-tem-filhos");
  const chronicles = books.filter((b) => b.kind === "Crônicas Cosmológicas");
  const others = books.filter((b) => !b.featured && b.kind !== "Crônicas Cosmológicas");
  const firstPara = (t) => String(t || "").split(/\n\s*\n/)[0];
  const sheet = (b) => bookSheets[b.slug] || {};
  const price = (b, k) => (b.prices || {})[k];

  const originBuy = [
    buyLinkHtml(origin.purchaseUrl, "Ebook", "Amazon Kindle", price(origin, "purchaseUrl")),
    buyLinkHtml(origin.purchaseUrlUiclap, "Impresso", "UICLAP", price(origin, "purchaseUrlUiclap")),
  ].join("");
  const godsBuy = buyLinkHtml(gods.purchaseUrl, "Comprar", "Amazon BR", gods.purchasePrice);

  const highlight = (b, kicker, href, buy, extra = "") => `
        <article class="vitrine-card">
          <a class="vitrine-card__cover" href="${href}" data-book-open="${b.slug}"><img src="${escapeHtml(b.cover)}" alt="Capa de ${escapeHtml(b.title)}" width="300" height="480" loading="lazy" /></a>
          <div class="vitrine-card__body">
            <span class="badge badge--sale">À VENDA</span>
            <span class="mono vitrine-card__kicker">${escapeHtml(kicker)}</span>
            <h3><a href="${href}" data-book-open="${b.slug}">${escapeHtml(b.title)}</a></h3>
            ${sheet(b).tagline ? `<p class="vitrine-card__tagline">${escapeHtml(sheet(b).tagline)}</p>` : ""}
            <p>${escapeHtml(firstPara(sheet(b).synopsis || b.synopsis || b.description))}</p>
            <div class="buy-group__links">${buy}</div>
            <p class="vitrine-card__actions">${extra}<a class="btn" href="${href}">Ver ficha completa →</a></p>
          </div>
        </article>`;

  const catalogCard = (b, href, label) => {
    const inner = `<img src="${escapeHtml(b.cover)}" alt="Capa de ${escapeHtml(b.title)}" loading="lazy" /><span class="mono">${label}</span><h3>${escapeHtml(b.title)}</h3>${b.description ? `<p>${escapeHtml(b.description)}</p>` : ""}`;
    return href
      ? `<a class="book-card book-card--cover" href="${href}" data-book-open="${b.slug}">${inner}<span class="book-card__more mono">Sinopse e ficha →</span></a>`
      : `<article class="book-card book-card--cover">${inner}</article>`;
  };
  const stateLabel = (b) => (isOnSale(b) ? `${escapeHtml(b.numeral || "ORIGEM")} · À VENDA` : `${escapeHtml(b.numeral)} · ${escapeHtml(b.status)}`);

  return `
    <section class="section home-vitrine" id="livros">
      <div class="container">
        <span class="kicker">Livros</span>
        <h2 style="margin-top:10px">Já à venda</h2>
        <p style="margin-top:8px;color:var(--muted);max-width:760px">O romance que abre o universo e o primeiro volume das Crônicas Cosmológicas. Tudo aqui é ficção e permanece separado do arquivo factual.</p>
        <div class="vitrine-grid">
          ${highlight(origin, "Romance · Obra de origem", "/livros/sinal-ruido/", originBuy, `<a class="btn btn--primary" href="/livro/amostra/">Ler 3 capítulos</a>`)}
          ${highlight(gods, "Crônicas Cosmológicas · Volume I", "/livros/os-deuses-nao-tem-filhos/", godsBuy)}
        </div>
      </div>
    </section>

    <section class="section section--divider home-catalog" id="cronicas">
      <div class="container">
        <span class="kicker">Crônicas Cosmológicas · I–X</span>
        <h2 style="margin-top:10px">Toda a coleção</h2>
        <p class="mono" style="margin-top:8px"><a href="/en/chronicles/" hreflang="en" style="color:var(--muted)">English version →</a></p>
        <div class="books-grid books-grid--covers" style="margin-top:20px">
          ${catalogCard(origin, "/livros/sinal-ruido/", "ORIGEM · À VENDA")}
          ${chronicles.map((b) => catalogCard(b, (bookSheets[b.slug] || {}).synopsis ? `/livros/${b.slug}/` : "", stateLabel(b))).join("")}
        </div>
        ${others.length ? `<div style="margin-top:36px"><span class="kicker">Outro projeto literário</span><div class="books-grid" style="margin-top:14px">${others.map((b) => `<article class="book-card"><span class="mono">${escapeHtml(b.status)}</span><h3>${escapeHtml(b.title)}</h3>${b.description ? `<p>${escapeHtml(b.description)}</p>` : ""}</article>`).join("")}</div></div>` : ""}
      </div>
    </section>
    ${[origin, ...chronicles.filter((b) => (bookSheets[b.slug] || {}).synopsis)].map(bookDialogHtml).join("")}`;
}

function homePage() {
  const featuredBook = books.find((b) => b.featured) || books[0];
  const purchaseUrlUiclap = featuredBook.purchaseUrlUiclap;
  const purchaseUrl = featuredBook.purchaseUrl; // não inventar — undefined até existir link real
  const purchaseUrlEn = featuredBook.purchaseUrlEn; // edição em inglês, opcional
  const purchaseUrlEnBr = featuredBook.purchaseUrlEnBr;
  const purchaseUrlEnUk = featuredBook.purchaseUrlEnUk; // edição em inglês, Amazon UK, opcional

  const body = `
    <section class="home-hero-book grid-texture" data-book-hero>
      <div class="container home-hero-book__grid">
        <div class="home-hero-book__copy" data-book-hero-copy>
          <span class="kicker">Romance · Ficção científica de investigação</span>
          <h1 class="home-hero-book__title">${escapeHtml(featuredBook.title).replace("/", `<span class="title-slash">/</span>`)}</h1>
          <p class="mono home-hero-book__author">${escapeHtml(featuredBook.author)}</p>
          <p class="home-hero-book__pitch">Um sinal chega de onde não deveria vir — e alguém decide que é mais seguro chamá-lo de ruído.</p>
          <div class="home-hero-book__actions">
            <a class="btn btn--primary" href="/livro/amostra/">Ler 3 capítulos</a>
            <a class="btn" href="/livro/">Conhecer o livro</a>
          </div>
          ${buyPanel(featuredBook)}
        </div>
        <div class="home-hero-book__cover" data-book-hero-cover>
          <img src="${escapeHtml(featuredBook.cover)}" alt="Capa de ${escapeHtml(featuredBook.title)}" width="400" height="600" />
        </div>
      </div>
    </section>

    ${homeShowcase()}

    <section class="section container--narrow home-about-book">
      <span class="kicker">Sobre o romance</span>
      <h2 style="margin-top:10px">${escapeHtml(featuredBook.title)}</h2>
      <p class="mono home-about-book__meta">${escapeHtml(featuredBook.kind)} · ${escapeHtml(featuredBook.status)}</p>
      <p class="home-about-book__lead" style="margin-top:14px">${escapeHtml(featuredBook.description)}</p>
      ${featuredBook.synopsis ? `<p class="home-about-book__synopsis" style="margin-top:12px;color:var(--muted)">${escapeHtml(featuredBook.synopsis)}</p>` : ""}
    </section>

    <section class="home-bridge-question" aria-label="Ponte entre o romance e o arquivo factual">
      <div class="container">
        <p class="mono home-bridge-question__cue">↓</p>
        <p class="home-bridge-question__line">O que sabemos.</p>
        <p class="home-bridge-question__line">O que não sabemos.</p>
        <p class="home-bridge-question__line home-bridge-question__line--accent">O que ainda falta encontrar.</p>
      </div>
    </section>

    <section class="section section--divider home-sample">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">Leia antes de decidir</span><h2>Leia gratuitamente os três primeiros capítulos.</h2></div></div>
        <div class="home-sample__grid" data-motion-group>
          ${SAMPLE_CHAPTERS.map((c) => `
            <a class="home-sample__chapter card" href="/livro/amostra/" data-motion-reveal>
              <span class="mono">CAPÍTULO ${c.n}</span>
              <h3>${escapeHtml(c.title)}</h3>
            </a>`).join("")}
        </div>
        <div style="margin-top:20px"><a class="btn btn--primary" href="/livro/amostra/">Começar a leitura</a></div>
      </div>
    </section>

    <section class="section section--divider home-comments-support">
      <div class="container home-comments-support__inner">
        <p>Se o romance valeu a leitura, considere apoiar o projeto — isso ajuda a manter a pesquisa, o arquivo público e a publicação independentes.</p>
        <div class="support-home__qr"><img src="/apoio/pix-qr.jpg" alt="QR Code Pix para apoio ao projeto SINAL/RUÍDO" loading="lazy" /><div><span class="mono">PIX · APOIAR O PROJETO</span><button type="button" class="btn btn--primary" data-copy-pix>Copiar código Pix</button><span class="visually-hidden" data-pix-code>00020126330014br.gov.bcb.pix0111026387420665204000053039865802BR5916Alex Junior Kich6009Sao Paulo62290525REC6A982558C600D1848319096304DD3C</span></div></div>
      </div>
    </section>`;

  write("/", page({
    title: "SINAL/RUÍDO",
    description: `${featuredBook.title} — romance de ${featuredBook.author}. Leia os primeiros capítulos gratuitamente e conheça o arquivo factual que inspirou a investigação.`,
    path: "/",
    bodyHtml: body,
    ogImage: featuredBook.cover,
    alternates: ptEnAlternates("/", "/en/"),
    langSwitch: "/en/",
  }));
}

// ---------------------------------------------------------------------
// /arquivo — busca geral (redireciona conceitualmente para /casos por ora)
// ---------------------------------------------------------------------
function arquivoPage() {
  const body = `
    <section class="section">
      <div class="container">
        <span class="kicker">Arquivo</span>
        <h1 style="margin-top:12px">Busca geral no acervo.</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:640px">O arquivo reúne casos, documentos, coleções institucionais e biblioteca de mídia. Busque abaixo por nome, órgão ou local, ou navegue pelas três áreas.</p>

        <div class="arquivo-search" style="margin-top:24px" data-arquivo-search-wrap>
          <span class="arquivo-search__icon" aria-hidden="true">⌕</span>
          <input type="search" class="arquivo-search__input" placeholder="Buscar caso, coleção, documento, órgão, local…" autocomplete="off" data-arquivo-input />
        </div>

        <div class="filter-row" style="margin-top:14px" data-filter-group="tipo" data-arquivo-filters>
          <button type="button" class="filter-btn" aria-pressed="true" data-filter-value="all">Todos</button>
          <button type="button" class="filter-btn" data-filter-value="caso">Casos</button>
          <button type="button" class="filter-btn" data-filter-value="documento">Documentos</button>
          <button type="button" class="filter-btn" data-filter-value="coleção">Coleções</button>
        </div>

        <ul class="arquivo-results" style="margin-top:20px" data-arquivo-results></ul>

        <div class="grid grid--4" style="margin-top:36px" data-arquivo-categories>
          <a class="card" href="/casos/"><span class="card__meta">${cases.length} casos</span><h3>Casos</h3><p>Dossiês e registros com cronologia, documentos, testemunhos e hipóteses.</p></a>
          <a class="card" href="/documentos/"><span class="card__meta">${documents.length} documentos</span><h3>Documentos</h3><p>Registros documentais relacionados aos casos, com origem e vínculo explícitos.</p></a>
          <a class="card" href="/colecoes/"><span class="card__meta">${collections.length} coleções</span><h3>Coleções</h3><p>Acervos institucionais de origem, nacionais e internacionais.</p></a>
          <a class="card" href="/midia/"><span class="card__meta">${media.length} itens</span><h3>Vídeos e imagens</h3><p>Imagens, documentos e vídeos com origem, autoria e licença registradas.</p></a>
        </div>

        <div class="section-heading" style="margin-top:44px"><div><span class="kicker">Todos os casos</span><h2 style="margin-top:8px">Abra qualquer caso direto daqui.</h2></div></div>
        <div class="grid grid--3" style="margin-top:20px">
          ${cases.map((c) => caseCard(c)).join("")}
        </div>
      </div>
    </section>`;
  write("/arquivo", page({
    title: "Arquivo",
    description: "Busca geral no acervo do SINAL/RUÍDO.",
    path: "/arquivo/",
    bodyHtml: body,
    alternates: ptEnAlternates("/arquivo/", "/en/archive/"),
    langSwitch: "/en/archive/",
  }));
}

// /en/archive — English shell for the factual archive. The case/document/collection/media
// items themselves are still Portuguese-only (they need source-faithful translation, not
// mechanical translation), so this links out to the Portuguese catalogs with a clear note.
function enArquivoPage() {
  const body = `
    <section class="section">
      <div class="container">
        <span class="kicker">Archive</span>
        <h1 style="margin-top:12px">The factual archive.</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:640px">The archive brings together real, documented cases, source documents, institutional collections and a media library related to the Wow! signal and UAP history. The catalogs below are currently published in Portuguese only; an English translation is in progress.</p>

        <div class="grid grid--4" style="margin-top:36px">
          <a class="card" href="/casos/" hreflang="pt-BR"><span class="card__meta">${cases.length} cases · PT</span><h3>Cases</h3><p>Dossiers with chronology, documents, testimony and competing hypotheses.</p></a>
          <a class="card" href="/documentos/" hreflang="pt-BR"><span class="card__meta">${documents.length} documents · PT</span><h3>Documents</h3><p>Documentary records tied to the cases, with explicit origin and provenance.</p></a>
          <a class="card" href="/colecoes/" hreflang="pt-BR"><span class="card__meta">${collections.length} collections · PT</span><h3>Collections</h3><p>National and international institutional archives.</p></a>
          <a class="card" href="/midia/" hreflang="pt-BR"><span class="card__meta">${media.length} items · PT</span><h3>Videos and images</h3><p>Images, documents and videos with recorded origin, authorship and license.</p></a>
        </div>

        ${casesEn.length ? `
        <section style="margin-top:44px">
          <span class="kicker">Translated so far</span>
          <h2 style="margin-top:8px">Cases tied directly to the novel.</h2>
          <div class="grid grid--3" style="margin-top:16px">${casesEn.map(enCaseCard).join("")}</div>
        </section>` : ""}

        <p class="mono" style="margin-top:32px;color:var(--muted)">Reading in Portuguese already? See the <a href="/arquivo/" hreflang="pt-BR">full archive</a>.</p>
      </div>
    </section>`;
  write("/en/archive", page({
    title: "Archive",
    description: "The SINAL/RUÍDO factual archive: real documented cases, source documents, institutional collections and media, related to the Wow! signal and UAP history.",
    path: "/en/archive/",
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/arquivo/", "/en/archive/"),
    langSwitch: "/arquivo/",
  }));
}

// ---------------------------------------------------------------------
// /casos — catálogo com filtro por estado editorial
// ---------------------------------------------------------------------
function casosPage() {
  const body = `
    <section class="section">
      <div class="container">
        <span class="kicker">Catálogo de casos</span>
        <h1 style="margin-top:12px">Casos em leitura pública.</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:70ch">Abra cada caso para consultar documentos, testemunhos, cronologia, hipóteses concorrentes e contradições. A presença nesta lista não representa validação de origem extraordinária.</p>

        <div class="filter-row" style="margin-top:24px" data-filter-group="status" data-filter-target="[data-case-card]">
          <button type="button" class="filter-btn" aria-pressed="true" data-filter-value="all">Todos</button>
          <button type="button" class="filter-btn" data-filter-value="aberto">Em investigação</button>
          <button type="button" class="filter-btn" data-filter-value="revisado">Revisados</button>
          <button type="button" class="filter-btn" data-filter-value="controverso">Controversos</button>
          <button type="button" class="filter-btn" data-filter-value="revisao-pendente">Revisão pendente</button>
        </div>

        <div class="grid grid--3" style="margin-top:20px">
          ${cases.map((c) => `<div data-case-card data-status="${c.status}">${caseCard(c)}</div>`).join("")}
        </div>
      </div>
    </section>`;
  write("/casos", page({
    title: "Casos",
    description: "Catálogo completo de casos documentados pelo SINAL/RUÍDO.",
    path: "/casos/",
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------
// /casos/[slug] — dossiê completo
// ---------------------------------------------------------------------
function documentoItem(doc) {
  return `
    <div class="card" style="cursor:default">
      <span class="card__meta">${escapeHtml(doc.tipo)}</span>
      <h3>${escapeHtml(doc.titulo)}</h3>
      <p>${escapeHtml(doc.descricao)}</p>
      <p class="mono" style="margin-top:8px;font-size:11px;color:var(--muted)">
        ${doc.data ? `Data: ${escapeHtml(doc.data)} · ` : ""}Origem: ${escapeHtml(doc.origem)}
      </p>
      ${doc.linkExterno ? `<a class="mono" style="font-size:11px" href="${escapeHtml(doc.linkExterno)}" target="_blank" rel="noopener noreferrer">Não hospedado aqui por direitos autorais — ver fonte original →</a>` : ""}
    </div>`;
}

function testemunhoItem(t) {
  return `
    <div class="card" style="cursor:default">
      <h3>${escapeHtml(t.quem)}</h3>
      <dl style="margin-top:8px;font-size:13px;display:grid;gap:6px">
        <div><dt class="mono" style="font-size:10px;color:var(--muted)">QUANDO DECLAROU</dt><dd>${escapeHtml(t.quandoDeclarou)}</dd></div>
        <div><dt class="mono" style="font-size:10px;color:var(--muted)">TEMPO APÓS O EVENTO</dt><dd>${escapeHtml(t.tempoAposEvento)}</dd></div>
        <div><dt class="mono" style="font-size:10px;color:var(--muted)">VERSÕES EXISTENTES</dt><dd>${escapeHtml(t.versoes)}</dd></div>
        <div><dt class="mono" style="font-size:10px;color:var(--muted)">OUTRAS TESTEMUNHAS</dt><dd>${escapeHtml(t.outrasTestemunhas)}</dd></div>
        ${t.possivelContaminacao ? `<div><dt class="mono" style="font-size:10px;color:var(--muted)">POSSÍVEL CONTAMINAÇÃO POSTERIOR</dt><dd>${escapeHtml(t.possivelContaminacao)}</dd></div>` : ""}
      </dl>
    </div>`;
}

function caseImageBlock(img) {
  return `
    <figure class="card" style="padding:0;overflow:hidden;cursor:default">
      <div style="position:relative">
        <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover" />
        ${img.ilustrativa ? `<span class="illustration-flag" style="position:absolute;left:10px;top:10px">Ilustração — não é registro original</span>` : ""}
      </div>
      <figcaption style="padding:14px;font-size:12px;color:var(--muted)">
        <div style="color:var(--text)">${escapeHtml(img.contexto)}</div>
        <div style="margin-top:6px">Origem: ${escapeHtml(img.origem)}${img.data ? " · " + escapeHtml(img.data) : ""}</div>
        <div>Autoria: ${escapeHtml(img.autoria)} · ${integrityBadge(img.versao)}</div>
        <div>Licença: ${escapeHtml(img.license)} — <a href="${escapeHtml(img.sourceUrl)}" target="_blank" rel="noopener noreferrer">página de origem</a></div>
      </figcaption>
    </figure>`;
}

function youtubeCard(v) {
  return `
    <div class="yt-card">
      <div class="yt-card__frame" data-yt-frame="${escapeHtml(v.youtubeId)}" data-yt-title="${escapeHtml(v.titulo)}">
        <img src="https://i.ytimg.com/vi/${escapeHtml(v.youtubeId)}/hqdefault.jpg" alt="" loading="lazy" />
        <span class="yt-card__play">▶</span>
      </div>
      <div class="yt-card__body">
        <span class="yt-card__meta">${escapeHtml(v.canal)}</span>
        <h3>${escapeHtml(v.titulo)}</h3>
        ${v.contexto ? `<p class="yt-card__context">${escapeHtml(v.contexto)}</p>` : ""}
        <a class="yt-card__source" href="https://www.youtube.com/watch?v=${escapeHtml(v.youtubeId)}" target="_blank" rel="noopener noreferrer">Ver no YouTube ↗</a>
      </div>
    </div>`;
}

function caseCoverHero(item) {
  // arte pronta (capa estilizada, texto ja embutido na imagem) tem prioridade — so composicao
  // HTML por cima quando nao existe capa pronta pro caso.
  if (item.coverSrc) {
    return `
      <header class="case-cover case-cover--art">
        <img src="${item.coverSrc}" alt="Capa — ${escapeHtml(item.title)}" loading="eager" />
      </header>`;
  }

  const img = (item.imagens || [])[0];
  const bg = img && img.src ? `<img class="case-cover__bg" src="${escapeHtml(img.src)}" alt="" loading="eager" />` : "";
  return `
    <header class="case-cover grid-texture${img ? "" : " case-cover--noimage"}">
      ${bg}
      <div class="case-cover__scrim"></div>
      <div class="container case-cover__inner">
        <div class="case-cover__top">
          <span class="kicker case-cover__kicker">SINAL/RUÍDO — Dossiê</span>
          <div class="case-cover__tag mono">
            <div>${escapeHtml(item.location)}</div>
            <div>${escapeHtml(item.date)}</div>
            <div>${escapeHtml(item.code)}</div>
            <div class="case-cover__redacted"></div>
          </div>
        </div>
        <div class="case-cover__bottom">
          <h1 class="case-cover__title">${escapeHtml(item.title)}</h1>
          <div class="case-cover__rule"></div>
          <div class="case-cover__meta mono">
            <span>${escapeHtml(item.date)}</span><span class="case-cover__dot">•</span><span>${escapeHtml(item.location)}</span>
          </div>
          <div class="case-cover__badges">
            ${editorialBadge(item.status, item.statusLabel)}
            ${maturityBadge(item.maturidade)}
          </div>
        </div>
      </div>
    </header>`;
}

function caseDossierPage(item) {
  const relatedCorrections = corrections.filter((c) => c.caseSlug === item.slug);
  const caseMedia = media.filter((m) => m.caseSlug === item.slug);
  const body = `
    ${caseCoverHero(item)}
    <article class="section container--medium">
      <a href="/casos/" class="mono" style="color:var(--muted)">← Voltar ao catálogo</a>

      <section style="margin-top:32px">
        <span class="kicker">Resumo</span>
        <p style="margin-top:10px;font-size:18px;color:var(--muted);max-width:640px">${escapeHtml(item.resumo)}</p>
        <p class="mono" style="margin-top:6px;font-size:11px;color:var(--muted)">O que aconteceu em poucas linhas, sem interpretação embutida.</p>
      </section>

      ${item.documentos.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Documento</span>
        <div class="grid" style="margin-top:16px">${item.documentos.map(documentoItem).join("")}</div>
      </section>` : ""}

      ${item.testemunhos.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Testemunhos</span>
        <div class="grid" style="margin-top:16px">${item.testemunhos.map(testemunhoItem).join("")}</div>
      </section>` : ""}

      ${item.cronologia.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Cronologia</span>
        <div class="paper" style="margin-top:16px;padding:24px">
          <ol class="timeline">
            ${item.cronologia.map((e) => `
              <li class="timeline__item">
                <span class="timeline__when">${escapeHtml(e.quando)}</span>
                <p>${escapeHtml(e.evento)}</p>
              </li>`).join("")}
          </ol>
        </div>
      </section>` : ""}

      ${item.hipoteses.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Hipóteses</span>
        <p class="mono" style="margin-top:6px;font-size:11px;color:var(--muted)">Todas no mesmo campo de avaliação. Nenhuma vence por padrão.</p>
        <div class="grid" style="margin-top:16px">
          ${item.hipoteses.map((h) => `
            <div class="card" style="cursor:default">
              <span class="mono" style="font-size:10px;text-transform:uppercase;color:var(--especulacao)">${escapeHtml(h.tipo)}</span>
              <p style="margin-top:6px">${escapeHtml(h.avaliacao)}</p>
            </div>`).join("")}
        </div>
      </section>` : ""}

      ${item.contradicoes.length ? `
      <section style="margin-top:36px">
        <div class="contradiction">
          <span class="contradiction__label">Contradições</span>
          <ul style="margin-top:10px;padding-left:18px;list-style:disc;display:grid;gap:8px;font-size:14px">
            ${item.contradicoes.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
          </ul>
        </div>
      </section>` : ""}

      <section style="margin-top:36px">
        <div class="paper knowns" style="padding:20px">
          <div class="knowns__panel knowns__panel--know">
            <span class="knowns__title">O que sabemos</span>
            <ul>${item.oQueSabemos.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
          </div>
          <div class="knowns__panel knowns__panel--unknown">
            <span class="knowns__title" style="color:var(--paper-muted)">O que não sabemos</span>
            <ul>${item.oQueNaoSabemos.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
          </div>
          <div class="knowns__panel knowns__panel--need">
            <span class="knowns__title">O que precisaríamos saber</span>
            <ul>${item.paraSaberMais.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
          </div>
        </div>
      </section>

      ${item.imagens.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Imagens e documentos</span>
        <div class="grid grid--2" style="margin-top:16px">${item.imagens.map(caseImageBlock).join("")}</div>
      </section>` : ""}

      ${caseMedia.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Mídia do caso</span>
        <div class="media-masonry" style="margin-top:16px">${caseMedia.map((m) => `<div data-media-card data-tipo="${m.tipo}">${mediaCard(m)}</div>`).join("")}</div>
      </section>` : ""}

      ${(item.videosYoutube || []).length ? `
      <section style="margin-top:36px">
        <span class="kicker">Vídeos</span>
        <p class="mono" style="margin-top:6px;font-size:11px;color:var(--muted)">Documentários, entrevistas e cobertura sobre o caso. Vídeo de terceiro não é evidência do caso — é material de contexto.</p>
        <div class="grid grid--2" style="margin-top:16px">${item.videosYoutube.map(youtubeCard).join("")}</div>
      </section>` : ""}

      ${item.fontes.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Fontes</span>
        <ul style="margin-top:14px;display:grid;gap:10px">
          ${item.fontes.map((f) => `
            <li style="display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;font-size:14px">
              ${provenanceBadge(f.qualidade)}
              ${f.url ? `<a href="${escapeHtml(f.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(f.label)}</a>` : `<span>${escapeHtml(f.label)}</span>`}
            </li>`).join("")}
        </ul>
        <p class="mono" style="margin-top:10px;font-size:11px;color:var(--muted)">Entrevista ou podcast entra aqui como caminho para uma alegação, nunca como prova da alegação.</p>
      </section>` : ""}

      ${relatedCorrections.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Histórico de revisão</span>
        <div class="grid" style="margin-top:16px">
          ${relatedCorrections.map((c) => `
            <div class="card" style="cursor:default">
              <span class="card__meta">${escapeHtml(c.date)}</span>
              <h3 style="font-size:14px">${escapeHtml(c.change)}</h3>
              <p>Motivo: ${escapeHtml(c.reason)}</p>
            </div>`).join("")}
        </div>
      </section>` : ""}

      ${item.bookNote ? `
      <section style="margin-top:36px">
        <div class="card" style="cursor:default;border-color:color-mix(in srgb, var(--signal) 45%, transparent)">
          <span class="mono" style="font-size:11px;text-transform:uppercase;color:var(--signal)">SINAL/RUÍDO — o romance</span>
          <p style="margin-top:8px">${escapeHtml(item.bookNote)}</p>
          <a href="/livro/" class="mono" style="display:inline-block;margin-top:8px">Ver a página do livro →</a>
        </div>
      </section>` : ""}

      <div style="margin-top:40px;padding-top:24px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:16px;align-items:center">
        <button type="button" class="btn" data-share data-share-title="${escapeHtml(item.title)}" data-share-text="${escapeHtml(item.resumo)}">Compartilhar</button>
      </div>
    </article>`;

  const enTwin = casesEn.find((e) => e.slug === item.slug);
  write(`/casos/${item.slug}`, page({
    title: item.title,
    description: item.resumo,
    path: `/casos/${item.slug}/`,
    bodyHtml: body,
    ...(enTwin ? { alternates: ptEnAlternates(`/casos/${item.slug}/`, `/en/archive/cases/${item.slug}/`), langSwitch: `/en/archive/cases/${item.slug}/` } : {}),
  }));
}

// ---------------------------------------------------------------------
// /en/archive/cases/[slug] — English case dossier. Only for cases translated in
// cases-en.json (see casesEn above). Reuses the same CSS classes as the PT dossier.
// ---------------------------------------------------------------------
function enMaturityBadge(maturidade) {
  const LABEL = { registro: "Level 1 · Record", indexado: "Level 2 · Indexed case", dossie: "Level 3 · Reviewed dossier" };
  const TITLE = {
    registro: "Minimal entry: little to no traceable source yet.",
    indexado: "Documented with traceable sources, but not yet through a formal web factual audit.",
    dossie: "Went through a documented web factual audit — not assigned automatically by record completeness.",
  };
  return `<span class="badge badge--maturity--${maturidade}" title="${escapeHtml(TITLE[maturidade] ?? "")}">${escapeHtml(LABEL[maturidade] ?? maturidade)}</span>`;
}

function enIntegrityBadge(versaoPt) {
  const CLASS = { "Original digital": "original-digital", "Digitalização institucional": "digitalizacao-institucional", "Cópia preservada": "copia-preservada", "Reprodução": "reproducao", "Derivado de análise": "derivado-de-analise", "Ilustração": "ilustracao", "Origem incerta": "origem-incerta" };
  const LABEL = { "Original digital": "Digital original", "Digitalização institucional": "Institutional digitization", "Cópia preservada": "Preserved copy", "Reprodução": "Reproduction", "Derivado de análise": "Derived from analysis", "Ilustração": "Illustration", "Origem incerta": "Uncertain origin" };
  const cls = CLASS[versaoPt] ?? "origem-incerta";
  return `<span class="badge badge--integrity--${cls}">${escapeHtml(LABEL[versaoPt] ?? versaoPt)}</span>`;
}

function enCaseCard(c) {
  const thumb = c.coverSrc ? `<img class="card__thumb" src="${escapeHtml(c.coverSrc)}" alt="" loading="lazy" />` : "";
  return `
    <a class="card${c.coverSrc ? " card--cover" : ""}" href="/en/archive/cases/${c.slug}/">
      ${thumb}
      <div class="card__body">
        <span class="card__meta">${escapeHtml(c.code)} · ${escapeHtml(c.date)}</span>
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.resumo)}</p>
        <div class="card__badges">${editorialBadge(c.status, c.statusLabel)}${enMaturityBadge(c.maturidade)}</div>
      </div>
    </a>`;
}

function enDocumentoItem(doc) {
  return `
    <div class="card" style="cursor:default">
      <span class="card__meta">${escapeHtml(doc.tipo)}</span>
      <h3>${escapeHtml(doc.titulo)}</h3>
      <p>${escapeHtml(doc.descricao)}</p>
      <p class="mono" style="margin-top:8px;font-size:11px;color:var(--muted)">
        ${doc.data ? `Date: ${escapeHtml(doc.data)} · ` : ""}Origin: ${escapeHtml(doc.origem)}
      </p>
      ${doc.linkExterno ? `<a class="mono" style="font-size:11px" href="${escapeHtml(doc.linkExterno)}" target="_blank" rel="noopener noreferrer">Not hosted here due to copyright — see original source →</a>` : ""}
    </div>`;
}

function enTestemunhoItem(t) {
  return `
    <div class="card" style="cursor:default">
      <h3>${escapeHtml(t.quem)}</h3>
      <dl style="margin-top:8px;font-size:13px;display:grid;gap:6px">
        <div><dt class="mono" style="font-size:10px;color:var(--muted)">WHEN STATED</dt><dd>${escapeHtml(t.quandoDeclarou)}</dd></div>
        <div><dt class="mono" style="font-size:10px;color:var(--muted)">TIME AFTER THE EVENT</dt><dd>${escapeHtml(t.tempoAposEvento)}</dd></div>
        <div><dt class="mono" style="font-size:10px;color:var(--muted)">EXISTING VERSIONS</dt><dd>${escapeHtml(t.versoes)}</dd></div>
        <div><dt class="mono" style="font-size:10px;color:var(--muted)">OTHER WITNESSES</dt><dd>${escapeHtml(t.outrasTestemunhas)}</dd></div>
        ${t.possivelContaminacao ? `<div><dt class="mono" style="font-size:10px;color:var(--muted)">POSSIBLE LATER CONTAMINATION</dt><dd>${escapeHtml(t.possivelContaminacao)}</dd></div>` : ""}
      </dl>
    </div>`;
}

function enCaseImageBlock(img) {
  return `
    <figure class="card" style="padding:0;overflow:hidden;cursor:default">
      <div style="position:relative">
        <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover" />
        ${img.ilustrativa ? `<span class="illustration-flag" style="position:absolute;left:10px;top:10px">Illustration — not an original record</span>` : ""}
      </div>
      <figcaption style="padding:14px;font-size:12px;color:var(--muted)">
        <div style="color:var(--text)">${escapeHtml(img.contexto)}</div>
        <div style="margin-top:6px">Origin: ${escapeHtml(img.origem)}${img.data ? " · " + escapeHtml(img.data) : ""}</div>
        <div>Credit: ${escapeHtml(img.autoria)} · ${enIntegrityBadge(img.versao)}</div>
        <div>License: ${escapeHtml(img.license)} — <a href="${escapeHtml(img.sourceUrl)}" target="_blank" rel="noopener noreferrer">source page</a></div>
      </figcaption>
    </figure>`;
}

function enYoutubeCard(v) {
  return `
    <div class="yt-card">
      <div class="yt-card__frame" data-yt-frame="${escapeHtml(v.youtubeId)}" data-yt-title="${escapeHtml(v.titulo)}">
        <img src="https://i.ytimg.com/vi/${escapeHtml(v.youtubeId)}/hqdefault.jpg" alt="" loading="lazy" />
        <span class="yt-card__play">▶</span>
      </div>
      <div class="yt-card__body">
        <span class="yt-card__meta">${escapeHtml(v.canal)}</span>
        <h3>${escapeHtml(v.titulo)}</h3>
        ${v.contexto ? `<p class="yt-card__context">${escapeHtml(v.contexto)}</p>` : ""}
        <a class="yt-card__source" href="https://www.youtube.com/watch?v=${escapeHtml(v.youtubeId)}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
      </div>
    </div>`;
}

function enCaseCoverHero(item) {
  if (item.coverSrc) {
    return `
      <header class="case-cover case-cover--art">
        <img src="${item.coverSrc}" alt="Cover — ${escapeHtml(item.title)}" loading="eager" />
      </header>`;
  }
  const img = (item.imagens || [])[0];
  const bg = img && img.src ? `<img class="case-cover__bg" src="${escapeHtml(img.src)}" alt="" loading="eager" />` : "";
  return `
    <header class="case-cover grid-texture${img ? "" : " case-cover--noimage"}">
      ${bg}
      <div class="case-cover__scrim"></div>
      <div class="container case-cover__inner">
        <div class="case-cover__top">
          <span class="kicker case-cover__kicker">SIGNAL/NOISE — Dossier</span>
          <div class="case-cover__tag mono">
            <div>${escapeHtml(item.location)}</div>
            <div>${escapeHtml(item.date)}</div>
            <div>${escapeHtml(item.code)}</div>
            <div class="case-cover__redacted"></div>
          </div>
        </div>
        <div class="case-cover__bottom">
          <h1 class="case-cover__title">${escapeHtml(item.title)}</h1>
          <div class="case-cover__rule"></div>
          <div class="case-cover__meta mono">
            <span>${escapeHtml(item.date)}</span><span class="case-cover__dot">•</span><span>${escapeHtml(item.location)}</span>
          </div>
          <div class="case-cover__badges">
            ${editorialBadge(item.status, item.statusLabel)}
            ${enMaturityBadge(item.maturidade)}
          </div>
        </div>
      </div>
    </header>`;
}

function enCaseDossierPage(item) {
  const relatedCorrections = corrections.filter((c) => c.caseSlug === item.slug);
  const caseMedia = media.filter((m) => m.caseSlug === item.slug);
  const body = `
    ${enCaseCoverHero(item)}
    <article class="section container--medium">
      <a href="/en/archive/" class="mono" style="color:var(--muted)">← Back to the archive</a>

      <section style="margin-top:32px">
        <span class="kicker">Summary</span>
        <p style="margin-top:10px;font-size:18px;color:var(--muted);max-width:640px">${escapeHtml(item.resumo)}</p>
        <p class="mono" style="margin-top:6px;font-size:11px;color:var(--muted)">What happened, in a few lines, with no interpretation built in.</p>
      </section>

      ${item.documentos.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Document</span>
        <div class="grid" style="margin-top:16px">${item.documentos.map(enDocumentoItem).join("")}</div>
      </section>` : ""}

      ${item.testemunhos.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Testimony</span>
        <div class="grid" style="margin-top:16px">${item.testemunhos.map(enTestemunhoItem).join("")}</div>
      </section>` : ""}

      ${item.cronologia.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Timeline</span>
        <div class="paper" style="margin-top:16px;padding:24px">
          <ol class="timeline">
            ${item.cronologia.map((e) => `
              <li class="timeline__item">
                <span class="timeline__when">${escapeHtml(e.quando)}</span>
                <p>${escapeHtml(e.evento)}</p>
              </li>`).join("")}
          </ol>
        </div>
      </section>` : ""}

      ${item.hipoteses.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Hypotheses</span>
        <p class="mono" style="margin-top:6px;font-size:11px;color:var(--muted)">All in the same field of evaluation. None wins by default.</p>
        <div class="grid" style="margin-top:16px">
          ${item.hipoteses.map((h) => `
            <div class="card" style="cursor:default">
              <span class="mono" style="font-size:10px;text-transform:uppercase;color:var(--especulacao)">${escapeHtml(h.tipo)}</span>
              <p style="margin-top:6px">${escapeHtml(h.avaliacao)}</p>
            </div>`).join("")}
        </div>
      </section>` : ""}

      ${item.contradicoes.length ? `
      <section style="margin-top:36px">
        <div class="contradiction">
          <span class="contradiction__label">Contradictions</span>
          <ul style="margin-top:10px;padding-left:18px;list-style:disc;display:grid;gap:8px;font-size:14px">
            ${item.contradicoes.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
          </ul>
        </div>
      </section>` : ""}

      <section style="margin-top:36px">
        <div class="paper knowns" style="padding:20px">
          <div class="knowns__panel knowns__panel--know">
            <span class="knowns__title">What we know</span>
            <ul>${item.oQueSabemos.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
          </div>
          <div class="knowns__panel knowns__panel--unknown">
            <span class="knowns__title" style="color:var(--paper-muted)">What we don't know</span>
            <ul>${item.oQueNaoSabemos.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
          </div>
          <div class="knowns__panel knowns__panel--need">
            <span class="knowns__title">What we'd need to know</span>
            <ul>${item.paraSaberMais.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
          </div>
        </div>
      </section>

      ${item.imagens.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Images and documents</span>
        <div class="grid grid--2" style="margin-top:16px">${item.imagens.map(enCaseImageBlock).join("")}</div>
      </section>` : ""}

      ${caseMedia.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Case media</span>
        <p class="mono" style="margin-top:6px;font-size:11px;color:var(--muted)">This section is currently listed in Portuguese only.</p>
        <div class="media-masonry" style="margin-top:16px">${caseMedia.map((m) => `<div data-media-card data-tipo="${m.tipo}">${mediaCard(m)}</div>`).join("")}</div>
      </section>` : ""}

      ${(item.videosYoutube || []).length ? `
      <section style="margin-top:36px">
        <span class="kicker">Videos</span>
        <p class="mono" style="margin-top:6px;font-size:11px;color:var(--muted)">Documentaries, interviews and coverage about the case. A third-party video is not evidence of the case — it's context material.</p>
        <div class="grid grid--2" style="margin-top:16px">${item.videosYoutube.map(enYoutubeCard).join("")}</div>
      </section>` : ""}

      ${item.fontes.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Sources</span>
        <ul style="margin-top:14px;display:grid;gap:10px">
          ${item.fontes.map((f) => `
            <li style="display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;font-size:14px">
              ${provenanceBadge(f.qualidade)}
              ${f.url ? `<a href="${escapeHtml(f.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(f.label)}</a>` : `<span>${escapeHtml(f.label)}</span>`}
            </li>`).join("")}
        </ul>
        <p class="mono" style="margin-top:10px;font-size:11px;color:var(--muted)">An interview or podcast is listed here as a path to a claim, never as proof of the claim.</p>
      </section>` : ""}

      ${relatedCorrections.length ? `
      <section style="margin-top:36px">
        <span class="kicker">Review history</span>
        <p class="mono" style="margin-top:6px;font-size:11px;color:var(--muted)">Listed in Portuguese only. See <a href="/correcoes/" hreflang="pt-BR">/correcoes</a>.</p>
      </section>` : ""}

      ${item.bookNote ? `
      <section style="margin-top:36px">
        <div class="card" style="cursor:default;border-color:color-mix(in srgb, var(--signal) 45%, transparent)">
          <span class="mono" style="font-size:11px;text-transform:uppercase;color:var(--signal)">SIGNAL/NOISE — the novel</span>
          <p style="margin-top:8px">${escapeHtml(item.bookNote)}</p>
          <a href="/en/signal-noise/" class="mono" style="display:inline-block;margin-top:8px">See the book page →</a>
        </div>
      </section>` : ""}
    </article>`;

  write(`/en/archive/cases/${item.slug}`, page({
    title: item.title,
    description: item.resumo,
    path: `/en/archive/cases/${item.slug}/`,
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates(`/casos/${item.slug}/`, `/en/archive/cases/${item.slug}/`),
    langSwitch: `/casos/${item.slug}/`,
  }));
}

// ---------------------------------------------------------------------
// /colecoes
// ---------------------------------------------------------------------
function colecoesPage() {
  const body = `
    <section class="section">
      <div class="container">
        <span class="kicker">Acervos oficiais</span>
        <h1 style="margin-top:12px">Coleções.</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:640px">Cada dossiê deste arquivo se apoia em documentos de origem verificável. Aqui estão as coleções institucionais de onde eles vêm — brasileiras e internacionais.</p>
        <div class="grid grid--2" style="margin-top:28px">${collections.map(collectionCard).join("")}</div>
      </div>
    </section>`;
  write("/colecoes", page({ title: "Coleções", description: "Coleções e acervos oficiais que sustentam os dossiês do arquivo.", path: "/colecoes/", bodyHtml: body }));
}

function colecaoDetailPage(col) {
  const relatedCases = col.caseSlugs.map((s) => cases.find((c) => c.slug === s)).filter(Boolean);
  const isPursue = col.slug === "pursue";
  const body = `
    <section class="section container--medium">
      <a href="/colecoes/" class="mono" style="color:var(--muted)">← Voltar a coleções</a>
      <span class="mono" style="display:block;margin-top:20px;font-size:12px;color:var(--muted)">${escapeHtml(col.country)} · ${escapeHtml(col.period)}</span>
      <h1 style="margin-top:8px">${escapeHtml(col.publicLabel || col.name)}</h1>
      ${col.publicLabel ? `<p class="mono" style="margin-top:6px;color:var(--muted)">${escapeHtml(col.name)}</p>` : ""}
      <p style="margin-top:4px;color:var(--muted)">${escapeHtml(col.institution)}</p>
      <p style="margin-top:16px;max-width:700px">${escapeHtml(col.description)}</p>
      ${col.note ? `<p class="collection-note">${escapeHtml(col.note)}</p>` : ""}
      ${col.url ? `<a href="${escapeHtml(col.url)}" target="_blank" rel="noopener noreferrer" class="btn" style="margin-top:16px">Acessar fonte oficial ↗</a>` : ""}

      ${isPursue && col.releases?.length ? `<section class="pursue-releases"><div class="section-heading"><div><span class="kicker">Liberações oficiais</span><h2>Releases indexados</h2></div></div><div class="release-grid">${col.releases.map((r) => `<div class="release-card"><span class="mono">${escapeHtml(r.date)}</span><strong>${escapeHtml(r.label)}</strong><p>Documentos e mídia publicados no portal oficial. A ingestão local é progressiva.</p></div>`).join("")}</div><p class="mono release-disclaimer">O SINAL/RUÍDO não espelha automaticamente todo o material. Cada item deve ter origem, direitos e integridade verificados antes de entrar no acervo local.</p></section>` : ""}

      <section style="margin-top:40px">
        <span class="kicker">Casos no arquivo com documentos desta coleção</span>
        <div class="grid" style="margin-top:16px">${relatedCases.map(caseCard).join("")}</div>
      </section>
    </section>`;
  write(`/colecoes/${col.slug}`, page({ title: col.publicLabel || col.name, description: col.description, path: `/colecoes/${col.slug}/`, bodyHtml: body }));
}

// ---------------------------------------------------------------------
// /midia
// ---------------------------------------------------------------------
const PODCAST_CHANNELS = [
  { nome: "Podcast UFO", host: "Martin Willis", url: "https://www.youtube.com/@PodcastUFO", contexto: "Entrevistas com testemunhas, pesquisadores e militares sobre casos de UAP desde 2011." },
  { nome: "The Micah Hanks Program", host: "Micah Hanks", url: "https://www.youtube.com/@micahhanks", contexto: "Abordagem cética e científica sobre UAP, SETI e mistérios correlatos." },
  { nome: "That UFO Podcast", host: "—", url: "https://www.youtube.com/@ThatUFOPodcast", contexto: "Discussão semanal de casos e notícias do campo ufológico em inglês." },
  { nome: "Revista UFO Oficial", host: "—", url: "https://www.youtube.com/@revistaufo.oficial", contexto: "Canal brasileiro dedicado à cobertura de casos e notícias de ufologia." },
];

function midiaPage() {
  const videos = media.filter((m) => m.tipo === "video");
  const featured = videos[0] || media[0];
  const related = media.filter((m) => m.slug !== featured.slug).slice(0, 5);
  const caseVideos = cases.flatMap((c) => (c.videosYoutube || []).map((v) => ({ ...v, caseSlug: c.slug, caseTitle: c.title })));
  const body = `
    <section class="section media-library">
      <div class="container">
        <span class="kicker">Biblioteca audiovisual</span>
        <h1 style="margin-top:12px">Vídeos e imagens.</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:760px">Vídeos, imagens, documentos e registros instrumentais com origem, autoria, contexto e versão identificados. A experiência lembra uma plataforma de vídeo; a lógica editorial não usa views, likes ou recomendação por engajamento.</p>

        <div class="media-library__feature" style="margin-top:28px">
          <a class="media-library__screen" href="/midia/${featured.slug}/">
            ${featured.tipo === "video" ? `<video src="${escapeHtml(featured.src)}" muted preload="metadata" playsinline></video><span class="media-library__play">▶</span>` : `<img src="${escapeHtml(featured.src)}" alt="${escapeHtml(featured.titulo)}" />`}
          </a>
          <div class="media-library__queue">
            <span class="mono media-library__queue-title">ARQUIVOS RELACIONADOS</span>
            ${related.map((m) => `<a href="/midia/${m.slug}/" class="media-queue-item"><span class="media-queue-item__type">${escapeHtml(m.tipo)}</span><strong>${escapeHtml(m.titulo)}</strong><small>${escapeHtml(m.origem)}</small></a>`).join("")}
          </div>
        </div>

        <div class="media-library__headline"><div><span class="badge badge--provenance">${escapeHtml(featured.origem)}</span><h2>${escapeHtml(featured.titulo)}</h2><p>${escapeHtml(featured.contexto)}</p></div><a class="btn btn--primary" href="/midia/${featured.slug}/">Abrir no player</a></div>

        <div class="filter-row" style="margin-top:36px" data-filter-group="tipo" data-filter-target="[data-media-card]">
          <button type="button" class="filter-btn" aria-pressed="true" data-filter-value="all">Todos</button>
          <button type="button" class="filter-btn" data-filter-value="video">Vídeos</button>
          <button type="button" class="filter-btn" data-filter-value="imagem">Imagens</button>
          <button type="button" class="filter-btn" data-filter-value="documento">Documentos / scans</button>
        </div>
        <p class="mono media-library__future">Estrutura preparada para áudio, radar e outros registros instrumentais quando houver itens auditados.</p>
        
        <div class="media-masonry" id="imagens" style="margin-top:20px">
          ${media.map((m) => `<div data-media-card data-tipo="${m.tipo}">${mediaCard(m)}</div>`).join("")}
        </div>

        ${caseVideos.length ? `
        <section id="videos" style="margin-top:48px">
          <span class="kicker">Documentários e entrevistas</span>
          <h2 style="margin-top:10px">Vídeos em destaque, por caso</h2>
          <p style="margin-top:8px;color:var(--muted);max-width:760px">Documentários, entrevistas e cobertura de terceiros sobre casos do arquivo. Vídeo de terceiro não é evidência — é material de contexto, e cada card leva ao dossiê completo.</p>
          <div class="grid grid--2" style="margin-top:20px">
            ${caseVideos.slice(0, 12).map((v) => `<div>${youtubeCard(v)}<a href="/casos/${v.caseSlug}/" class="mono" style="display:block;margin-top:8px;color:var(--muted)">Ver dossiê — ${escapeHtml(v.caseTitle)} →</a></div>`).join("")}
          </div>
        </section>` : ""}

        <section style="margin-top:48px">
          <span class="kicker">Canais e podcasts</span>
          <h2 style="margin-top:10px">Para acompanhar fora do arquivo</h2>
          <p style="margin-top:8px;color:var(--muted);max-width:760px">Canais e podcasts no YouTube que cobrem UAP com rigor variável. Listar aqui não é endosso do conteúdo — é apenas um ponto de partida para quem quer ouvir mais vozes sobre o tema.</p>
          <div class="grid grid--2" style="margin-top:20px">
            ${PODCAST_CHANNELS.map((p) => `
            <a class="card" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">
              <span class="card__meta">PODCAST · YOUTUBE</span>
              <h3 style="margin-top:4px">${escapeHtml(p.nome)}</h3>
              ${p.host !== "—" ? `<p class="mono" style="margin-top:2px;font-size:12px;color:var(--muted)">${escapeHtml(p.host)}</p>` : ""}
              <p style="margin-top:6px;font-size:13px">${escapeHtml(p.contexto)}</p>
              <span class="mono" style="font-size:11px;margin-top:8px;display:inline-block">Abrir canal ↗</span>
            </a>`).join("")}
          </div>
        </section>
      </div>
    </section>`;
  write("/midia", page({ title: "Vídeos e imagens", description: "Biblioteca audiovisual do SINAL/RUÍDO, com vídeos, imagens e documentos contextualizados por fonte e proveniência.", path: "/midia/", bodyHtml: body }));
}

function midiaDetailPage(m) {
  const body = `
    <article class="section container--medium">
      <a href="/casos/${m.caseSlug}/" class="mono" style="color:var(--muted)">← Voltar ao caso</a>

      ${m.tipo === "video" ? `
      <div class="media-player" style="margin-top:20px" data-media-player>
        <video ${m.src ? `` : ""} playsinline>
          <source src="${escapeHtml(m.src)}" type="video/webm" />
        </video>
        <div class="media-player__controls">
          <button type="button" class="media-player__btn" data-mp-play>Reproduzir</button>
          <div class="media-player__bar" data-mp-bar><div class="media-player__bar-fill" data-mp-bar-fill></div></div>
          <span data-mp-time>0:00 / 0:00</span>
          <button type="button" class="media-player__btn" data-mp-speed>1x</button>
          <button type="button" class="media-player__btn" data-mp-fullscreen>⛶</button>
        </div>
      </div>` : `
      <div style="margin-top:20px;position:relative">
        <img src="${escapeHtml(m.src)}" alt="${escapeHtml(m.titulo)}" style="width:100%;border-radius:var(--radius-md)" />
        ${m.ilustrativa ? `<span class="illustration-flag" style="position:absolute;left:12px;top:12px">Ilustração — não é registro original</span>` : ""}
      </div>`}

      <div class="media-tabs" style="margin-top:24px" data-media-tabs>
        <button type="button" data-tab="metadados" aria-selected="true">Metadados</button>
        <button type="button" data-tab="fonte" aria-selected="false">Fonte</button>
      </div>
      <div class="media-tab-panel" data-tab-panel="metadados">
        <h1 style="font-size:22px">${escapeHtml(m.titulo)}</h1>
        <p style="margin-top:8px;color:var(--muted)">${escapeHtml(m.contexto)}</p>
        <dl style="margin-top:20px;display:grid;grid-template-columns:repeat(2,1fr);gap:14px;font-size:13px">
          <div><dt class="mono" style="font-size:10px;color:var(--muted)">ORIGEM</dt><dd>${escapeHtml(m.origem)}</dd></div>
          ${m.data ? `<div><dt class="mono" style="font-size:10px;color:var(--muted)">DATA</dt><dd>${escapeHtml(m.data)}</dd></div>` : ""}
          <div><dt class="mono" style="font-size:10px;color:var(--muted)">AUTORIA</dt><dd>${escapeHtml(m.autoria)}</dd></div>
          <div><dt class="mono" style="font-size:10px;color:var(--muted)">VERSÃO</dt><dd>${integrityBadge(m.versao)}</dd></div>
          <div><dt class="mono" style="font-size:10px;color:var(--muted)">LICENÇA</dt><dd>${escapeHtml(m.license)}</dd></div>
        </dl>
      </div>
      <div class="media-tab-panel" data-tab-panel="fonte" hidden>
        <a href="${escapeHtml(m.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="mono">Página de origem ↗</a>
      </div>

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid var(--border)">
        <a href="/casos/${m.caseSlug}/" class="mono" style="color:var(--muted)">Ver o dossiê completo — ${escapeHtml(m.caseTitle)} →</a>
      </div>
    </article>`;
  write(`/midia/${m.slug}`, page({ title: m.titulo, description: m.contexto, path: `/midia/${m.slug}/`, bodyHtml: body }));
}

// ---------------------------------------------------------------------
// /noticias — atualizações institucionais rastreáveis
// ---------------------------------------------------------------------
function noticiasPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Radar documental</span>
      <h1 style="margin-top:12px">Atualizações institucionais.</h1>
      <p style="margin-top:8px;color:var(--muted)">Mudanças em acervos, relatórios, normas e liberações documentais. Esta seção registra a ocorrência e aponta a fonte; não transforma anúncio institucional, cobertura jornalística ou análise externa em evidência de origem extraordinária.</p>
      <div class="grid" style="margin-top:28px;gap:16px">
        ${noticias.map((n) => `
          <div class="card" style="cursor:default">
            <span class="card__meta">${escapeHtml(n.date)}</span>
            <h3 style="margin-top:4px;font-size:16px">${escapeHtml(n.title)}</h3>
            <p style="margin-top:6px;font-size:14px">${escapeHtml(n.summary)}</p>
            <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;font-size:12px">
              ${n.tags.map((t) => provenanceBadge(t)).join("")}
              <a href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(n.source)} →</a>
            </div>
          </div>`).join("")}
      </div>
    </section>`;
  write("/noticias", page({
    title: "Atualizações institucionais",
    description: "Atualizações institucionais sobre acervos, relatórios e liberações documentais relacionadas a UAP.",
    path: "/noticias/",
    bodyHtml: body,
    alternates: ptEnAlternates("/noticias/", "/en/news/"),
    langSwitch: "/en/news/",
  }));
}

// /en/news — English shell. The news items themselves are still Portuguese-only.
function enNoticiasPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Documentary radar</span>
      <h1 style="margin-top:12px">Institutional updates.</h1>
      <p style="margin-top:8px;color:var(--muted)">Changes in archives, reports, regulations and documentary releases. This section records that something happened and points to the source; it does not turn an institutional announcement, news coverage or outside analysis into evidence of extraordinary origin.</p>
      <p class="mono" style="margin-top:20px;color:var(--muted)">This section is currently published in Portuguese only. See the <a href="/noticias/" hreflang="pt-BR">Portuguese updates</a>.</p>
    </section>`;
  write("/en/news", page({
    title: "Institutional updates",
    description: "Institutional updates on archives, reports and documentary releases related to UAP.",
    path: "/en/news/",
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/noticias/", "/en/news/"),
    langSwitch: "/noticias/",
  }));
}

// ---------------------------------------------------------------------
// /livro
// ---------------------------------------------------------------------
function livroPage() {
  const bookCases = cases.filter((c) => c.bookNote);
  const bookData = books.find((b) => b.slug === "sinal-ruido") || books[0];
  const purchaseUrl = bookData.purchaseUrl;
  const purchaseUrlUiclap = bookData.purchaseUrlUiclap;
  const purchaseUrlEn = bookData.purchaseUrlEn;
  const purchaseUrlEnBr = bookData.purchaseUrlEnBr;
  const purchaseUrlEnUk = bookData.purchaseUrlEnUk;
  const body = `
    <section class="section container--narrow">
      <div class="book-hero">
        <div class="book-hero__cover-col"><img class="book-hero__cover" src="/livro/capa.jpg" alt="Capa do romance SINAL/RUÍDO" width="400" height="600" /></div>
        <div class="book-hero__text">
          <span class="badge" style="border-color:var(--signal);color:var(--signal)">FICÇÃO</span>
          <p class="mono" style="margin-top:14px;color:var(--muted)">NEM TODO SINAL QUER SER OUVIDO.</p>
          <h1 style="margin-top:10px">SINAL<span class="title-slash">/</span>RUÍDO — o romance.</h1>
          <p class="mono" style="margin-top:8px;color:var(--signal)">Alex Jr. Kich</p>
          ${bookData.synopsis ? `<p class="book-synopsis" style="margin-top:14px;font-size:17px;line-height:1.6">${escapeHtml(bookData.synopsis)}</p>` : ""}
          <p style="margin-top:12px;font-size:17px;color:var(--muted)">Personagens, organizações, eventos e diálogos pertencem ao romance. O livro utiliza pesquisa real e método de investigação como matéria narrativa, mas sua trama e seus desfechos não integram o arquivo factual.</p>
          <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="/livro/amostra/">Ler até 3 capítulos</a><a class="btn" href="/livros/sinal-ruido/">Ficha do livro</a></div>
          ${buyPanel(bookData)}
        </div>
      </div>

      <section style="margin-top:36px"><span class="kicker">Do livro para o arquivo</span><h2 style="margin-top:10px">Casos reais relacionados</h2><div class="grid" style="margin-top:16px">${bookCases.slice(0,4).map(caseCard).join("")}</div></section>

      <section class="paper support-book" style="margin-top:36px;padding:28px">
        <div><span class="kicker">Apoio à obra</span><h2 style="margin-top:10px">Ajude a manter a pesquisa e a publicação independentes.</h2><p style="margin-top:8px;color:var(--paper-muted)">Contribuição opcional. O acesso ao arquivo factual e à amostra não depende de pagamento.</p><div class="pix-card__code mono" data-pix-code>00020126330014br.gov.bcb.pix0111026387420665204000053039865802BR5916Alex Junior Kich6009Sao Paulo62290525REC6A982558C600D1848319096304DD3C</div><button type="button" class="btn btn--primary" style="margin-top:12px" data-copy-pix>Copiar código Pix</button></div>
        <img src="/apoio/pix-qr.jpg" alt="QR Code Pix para apoiar SINAL/RUÍDO" width="698" height="576" />
      </section>

      <div style="margin-top:36px;padding-top:20px;border-top:1px solid var(--border);display:flex;gap:12px;flex-wrap:wrap"><a href="/leitores/" class="btn">Área de leitores</a><button type="button" class="btn" data-share data-share-title="SINAL/RUÍDO — o romance" data-share-text="Um romance de investigação. Ficção apoiada por pesquisa factual separada.">Compartilhar</button></div>
    </section>`;
  write("/livro", page({ title: "O livro", description: "SINAL/RUÍDO, o romance — ficção científica de investigação com pesquisa factual separada do arquivo público.", path: "/livro/", bodyHtml: body, ogImage: "/livro/capa.jpg" }));
}

function livroAmostraPage() {
  const chapters = SAMPLE_CHAPTERS;
  const body = `
    <article class="section reading-shell" data-reading-sample>
      <header class="reading-meta">
        <div><span class="badge" style="border-color:var(--signal);color:var(--signal)">FICÇÃO · AMOSTRA GRATUITA</span><p class="mono">SINAL/RUÍDO · Alex Jr. Kich</p></div>
        <div class="reading-tools" aria-label="Opções de leitura"><button type="button" data-reading-size="down" aria-label="Diminuir fonte">A−</button><button type="button" data-reading-size="up" aria-label="Aumentar fonte">A+</button><button type="button" data-reading-theme aria-label="Alternar modo de leitura">◐</button></div>
      </header>

      <nav class="chapter-nav" id="capitulos" aria-label="Capítulos da amostra">
        ${chapters.map((c, i) => `<button type="button" data-chapter-tab="${c.id}" aria-selected="${i === 0 ? "true" : "false"}"><span>${c.n}</span>${escapeHtml(c.title)}</button>`).join("")}
      </nav>

      ${chapters.map((c, i) => `<section class="paper reading-paper" data-chapter-panel="${c.id}" ${i ? "hidden" : ""}>
        <p class="mono reading-progress">CAPÍTULO ${c.n} DE 3</p>
        <h1>${c.n}. ${escapeHtml(c.title)}</h1>
        <div class="reading-body">
          ${c.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n          ")}
        </div>
        <div class="chapter-end"><span>Fim do capítulo ${c.n}</span>${i < chapters.length - 1 ? `<button class="btn btn--primary" type="button" data-next-chapter="${chapters[i+1].id}">Capítulo seguinte →</button>` : `<a class="btn btn--primary" href="/livro/">Conhecer o livro →</a>`}</div>
      </section>`).join("")}

      <div class="reading-actions"><a class="btn" href="/livro/">← Voltar ao livro</a><a class="btn" href="/casos/">Explorar os casos reais →</a></div>
    </article>`;
  write("/livro/amostra", page({
    title: "Amostra do romance",
    description: "Leia uma amostra de até três capítulos do romance SINAL/RUÍDO.",
    path: "/livro/amostra/",
    bodyHtml: body,
    ogImage: "/livro/capa.jpg",
    robots: "noindex,follow",
  }));
}

function livroSampleEnPage() {
  const chapters = SAMPLE_CHAPTERS_EN;
  const body = `
    <article class="section reading-shell" data-reading-sample>
      <header class="reading-meta">
        <div><span class="badge" style="border-color:var(--signal);color:var(--signal)">FICTION · FREE SAMPLE</span><p class="mono">SIGNAL/NOISE · Alex Jr. Kich</p></div>
        <div class="reading-tools" aria-label="Reading options"><button type="button" data-reading-size="down" aria-label="Decrease font size">A−</button><button type="button" data-reading-size="up" aria-label="Increase font size">A+</button><button type="button" data-reading-theme aria-label="Toggle reading mode">◐</button></div>
      </header>

      <nav class="chapter-nav" aria-label="Sample chapters">
        ${chapters.map((c, i) => `<button type="button" data-chapter-tab="${c.id}" aria-selected="${i === 0 ? "true" : "false"}"><span>${c.n}</span>${escapeHtml(c.title)}</button>`).join("")}
      </nav>

      ${chapters.map((c, i) => `<section class="paper reading-paper" data-chapter-panel="${c.id}" ${i ? "hidden" : ""}>
        <p class="mono reading-progress">CHAPTER ${c.n} OF 3</p>
        <h1>${c.n}. ${escapeHtml(c.title)}</h1>
        <div class="reading-body">
          ${c.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n          ")}
        </div>
        <div class="chapter-end"><span>End of chapter ${c.n}</span>${i < chapters.length - 1 ? `<button class="btn btn--primary" type="button" data-next-chapter="${chapters[i+1].id}">Next chapter →</button>` : `<a class="btn btn--primary" href="${escapeHtml((books.find((b) => b.slug === "sinal-ruido") || books[0]).purchaseUrlEn || "/livro/")}">Buy the book →</a>`}</div>
      </section>`).join("")}

      <div class="reading-actions"><a class="btn" href="/livro/">Read in Portuguese →</a><a class="btn" href="/casos/">Explore the real cases →</a></div>
    </article>`;
  write("/livro/sample", page({
    title: "SIGNAL/NOISE: free sample chapters",
    description: "Read a free sample of the first three chapters of SIGNAL/NOISE, a novel by Alex Jr. Kich.",
    path: "/livro/sample/",
    bodyHtml: body,
    ogImage: "/livro/capa-en.jpg",
    lang: "en",
    ogLocale: "en_US",
    minimal: true,
  }));
}

// ---------------------------------------------------------------------
// /livros
// ---------------------------------------------------------------------
// /livros: a antiga página de livros foi unida à página inicial (vitrine). Fica só como redirecionamento.
function livrosPage() {
  const body = `
    <section class="section container--narrow">
      <p>Os livros agora ficam na página inicial. <a href="/#livros">Ir para os livros →</a></p>
    </section>`;
  write("/livros", page({ title: "Livros", description: "Os livros de SINAL/RUÍDO estão na página inicial.", path: "/", bodyHtml: body, robots: "noindex,follow", extraHead: `<meta http-equiv="refresh" content="0; url=/#livros" />` }));
}

// ---------------------------------------------------------------------
// /privacidade
// ---------------------------------------------------------------------
// /livros/<slug> — pagina de cada livro das Cronicas: sinopse + ficha (dados em src/data/book-sheets.json)
// Seções da ficha que ficam nos dados mas não são exibidas: revelam ligações entre os livros
// (spoiler). Para exibir, remova o título da lista.
const HIDDEN_SECTIONS = new Set(["A face do Arquivo", "Lugar dentro da coleção", "Lugar dentro do universo"]);

// Textos de interface das fichas de livro, por idioma.
const SHEET_UI = {
  pt: {
    lang: "pt-BR", ogLocale: "pt_BR", back: "← Crônicas Cosmológicas", series: "Crônicas Cosmológicas", seriesLabel: "Série",
    volume: "Volume", author: "Autor", status: "Status", epoch: "Época", place: "Local",
    sheet: "Ficha", where: "Onde se ambienta", characters: "Personagens", themes: "Temas",
    soon: "Em breve.", synopsisSoon: "Sinopse em breve.", other: "Outros volumes",
    switchLabel: "English version →", chapterTitle: "Crônicas Cosmológicas", statusMap: {},
  },
  en: {
    lang: "en", ogLocale: "en_US", back: "← The Cosmological Chronicles", series: "Cosmological Chronicles", seriesLabel: "Series",
    volume: "Volume", author: "Author", status: "Status", epoch: "Period", place: "Place",
    sheet: "Details", where: "Where the story is set", characters: "Main characters", themes: "Themes",
    soon: "Coming soon.", synopsisSoon: "Synopsis coming soon.", other: "Other volumes",
    switchLabel: "← Versão em português", chapterTitle: "Cosmological Chronicles",
    statusMap: { "Em desenvolvimento": "In development", "Edição editorial": "Editorial edition" },
  },
};

const SINAL_RUIDO_ORIGIN = { slug: "sinal-ruido", title: "SIGNAL/NOISE", author: "Alex Jr. Kich", numeral: "Origin", status: "Origin work", cover: "/livro/capa-en.jpg" };

// /livros/<slug> (pt) e /en/chronicles/<slug> (en): ficha do livro com sinopse, personagens e seções.
// Dados em src/data/book-sheets.json (pt) e book-sheets-en.json (en). Páginas em inglês ficam noindex
// e fora do sitemap até o autor revisar a tradução.
// Alternativas de idioma (hreflang) entre a página em português e a sua versão em inglês.
function ptEnAlternates(ptPath, enPath) {
  return [{ hreflang: "pt-BR", href: `${SITE_URL}${ptPath}` }, { hreflang: "en", href: `${SITE_URL}${enPath}` }, { hreflang: "x-default", href: `${SITE_URL}${ptPath}` }];
}

function bookSheetPage(b, list, lang) {
  const ui = SHEET_UI[lang];
  const en = lang === "en";
  const tt = (x) => (en && x.titleEn) || x.title;
  const cv = (x) => (en && x.coverEn) || x.cover;
  const isOrigin = b.slug === "sinal-ruido";
  const sh = (en ? bookSheetsEn : bookSheets)[b.slug] || {};
  const otherSheet = (en ? bookSheets : bookSheetsEn)[b.slug];
  const amb = sh.ambientacao || {};
  const paras = (t) => String(t || "").split(/\n\s*\n/).filter(Boolean).map((x) => `<p>${escapeHtml(x)}</p>`).join("");
  const synopsis = sh.synopsis || b.synopsis || "";
  const status = ui.statusMap[b.status] || b.status;
  const rows = [
    ...(isOrigin ? [en ? ["Type", "Origin work, outside the numbering of the Cosmological Chronicles"] : ["Tipo", "Obra de origem, fora da numeração das Crônicas Cosmológicas"]] : [[ui.seriesLabel, ui.series], [ui.volume, b.numeral]]),
    ...(en && b.titleEn ? [["Original title", b.title]] : []),
    [ui.author, b.author],
    [ui.status, status],
    ...(amb.epoca ? [[ui.epoch, amb.epoca]] : []),
    ...(amb.local ? [[ui.place, amb.local]] : []),
    ...(sh.ficha || []).map((f) => [f.label, f.value]),
  ].filter((r) => r[1]);
  const idx = list.findIndex((x) => x.slug === b.slug);
  const prev = list[idx - 1], next = isOrigin ? list[0] : list[idx + 1];
  const base = en ? "/en/chronicles/" : "/livros/";
  const path = isOrigin ? (en ? "/en/signal-noise/" : "/livros/sinal-ruido/") : `${base}${b.slug}/`;
  const ptPath = isOrigin ? "/livros/sinal-ruido/" : `/livros/${b.slug}/`;
  const enPath = isOrigin ? "/en/signal-noise/" : `/en/chronicles/${b.slug}/`;
  const backHref = en ? "/en/chronicles/" : "/#livros";
  const sections = (sh.secoes || []).filter((s) => !HIDDEN_SECTIONS.has(s.titulo));
  const badge = isOrigin ? (en ? "ORIGIN" : "OBRA DE ORIGEM") : `${b.numeral} · ${status}`;
  const switchHref = en ? ptPath : enPath;
  const showSwitch = en || Boolean(otherSheet && (otherSheet.synopsis));
  const navLabel = (x) => (en && x.slug === "sinal-ruido" ? "SIGNAL/NOISE" : tt(x));
  const body = `
    <section class="section book-sheet" data-verso="/livros/${b.slug}-verso.jpg" style="--book-art:url(/livros/${b.slug}-verso.jpg)">
      <div class="container">
        <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <a href="${backHref}" class="mono" style="color:var(--muted)">${ui.back}</a>
          ${showSwitch ? `<a href="${switchHref}" class="mono" style="color:var(--muted)" hreflang="${en ? "pt-BR" : "en"}">${ui.switchLabel}</a>` : ""}
        </div>
        <div class="book-sheet__hero">
          <img class="book-sheet__cover" src="${escapeHtml(cv(b))}" alt="${en ? "Cover of" : "Capa de"} ${escapeHtml(tt(b))}" width="450" height="720" />
          <div>
            <span class="badge" style="border-color:var(--signal);color:var(--signal)">${escapeHtml(badge)}</span>
            <h1 style="margin-top:12px">${escapeHtml(tt(b))}</h1>
            <p class="mono" style="margin-top:8px;color:var(--signal)">${escapeHtml(b.author)}</p>
            ${sh.tagline ? `<p class="book-sheet__tagline" style="margin-top:14px;font-style:italic;color:var(--muted)">${escapeHtml(sh.tagline)}</p>` : ""}
            <div class="book-sheet__synopsis">${synopsis ? paras(synopsis) : `<p class="book-sheet__pending">${ui.synopsisSoon}</p>`}</div>
            ${isOrigin && en ? `<p style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="/livro/sample/">Read the sample</a><a class="btn" href="/buy/">Get the book</a></p>` : ""}${isOrigin && !en ? `<p style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="/livro/amostra/">Ler 3 capítulos</a><a class="btn" href="/livro/">Sobre o livro e casos reais</a></p>${buyPanel(b)}` : ""}${!en && !isOrigin && b.purchaseUrl ? `<div class="buy-panel" style="margin-top:18px"><div class="buy-group"><span class="buy-group__title">Onde comprar</span><div class="buy-group__links">${buyLinkHtml(b.purchaseUrl, "Comprar", "Amazon BR", b.purchasePrice)}</div></div></div>` : ""}
          </div>
        </div>

        <div class="book-sheet__grid">
          <section class="paper book-sheet__box">
            <span class="kicker">${ui.sheet}</span>
            <dl class="book-sheet__dl">${rows.map((r) => `<div><dt>${escapeHtml(r[0])}</dt><dd>${escapeHtml(r[1])}</dd></div>`).join("")}</dl>
          </section>
          <section class="paper book-sheet__box">
            <span class="kicker">${ui.where}</span>
            ${amb.texto ? paras(amb.texto) : `<p class="book-sheet__pending">${ui.soon}</p>`}
          </section>
        </div>

        <section style="margin-top:32px">
          <span class="kicker">${ui.characters}</span>
          ${(sh.personagens || []).length ? `<div class="grid grid--3" style="margin-top:14px">${sh.personagens.map((c) => `<div class="card" style="cursor:default"><h3>${escapeHtml(c.nome)}</h3>${c.papel ? `<span class="mono" style="color:var(--signal)">${escapeHtml(c.papel)}</span>` : ""}<p style="margin-top:8px">${escapeHtml(c.descricao || "")}</p></div>`).join("")}</div>` : `<p class="book-sheet__pending" style="margin-top:14px">${ui.soon}</p>`}
        </section>

        ${sections.map((s) => `<section style="margin-top:32px"><span class="kicker">${escapeHtml(s.titulo)}</span><div class="book-sheet__synopsis">${paras(s.texto)}</div></section>`).join("")}

        ${(sh.temas || []).length ? `<section style="margin-top:32px"><span class="kicker">${ui.themes}</span><div class="book-sheet__tags">${sh.temas.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join("")}</div></section>` : ""}

        <nav class="book-sheet__nav" aria-label="${ui.other}">
          ${prev ? `<a href="${base}${prev.slug}/"><span class="mono">← ${escapeHtml(prev.numeral)}</span><strong>${escapeHtml(tt(prev))}</strong></a>` : "<span></span>"}
          ${next ? `<a href="${base}${next.slug}/" style="text-align:right"><span class="mono">${escapeHtml(next.numeral)} →</span><strong>${escapeHtml(navLabel(next))}</strong></a>` : "<span></span>"}
        </nav>
      </div>
    </section>`;
  const descr = synopsis ? synopsis.slice(0, 200) : en ? `${tt(b)}, volume ${b.numeral} of the Cosmological Chronicles, by ${b.author}.` : `${b.title}, volume ${b.numeral} das Crônicas Cosmológicas, de ${b.author}.`;
  const title = isOrigin ? (en ? "SIGNAL/NOISE · Origin" : "SINAL/RUÍDO · Obra de origem") : `${tt(b)} · ${ui.chapterTitle}`;
  write(path.replace(/\/$/, ""), page({
    title, description: descr, path, bodyHtml: body, ogImage: cv(b),
    ...(en ? { lang: ui.lang, ogLocale: ui.ogLocale, minimal: true } : {}),
    ...(showSwitch ? { alternates: ptEnAlternates(ptPath, enPath), langSwitch: switchHref } : {}),
  }));
}

// /en/chronicles — índice em inglês: obra de origem + Crônicas I–X (noindex até revisão da tradução)
function chroniclesEnPage(list) {
  const withEn = list.filter((b) => (bookSheetsEn[b.slug] || {}).synopsis);
  const origin = bookSheetsEn["sinal-ruido"] || {};
  const status = (s) => SHEET_UI.en.statusMap[s] || s;
  const body = `
    <section class="section books-page">
      <div class="container">
        <span class="kicker">Book series</span>
        <h1 style="margin-top:12px">The Cosmological Chronicles</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:760px">Ten stories. Different people. Different places. Different times. One universe that never reveals itself completely.</p>
        <p class="mono" style="margin-top:8px"><a href="/#cronicas" hreflang="pt-BR" style="color:var(--muted)">← Versão em português</a></p>

        <section class="books-future" style="margin-top:32px">
          <span class="kicker">Origin</span>
          <div class="books-featured" style="margin-top:16px">
            <img src="/livro/capa-en.jpg" alt="Cover of SIGNAL/NOISE" />
            <div>
              <span class="badge" style="border-color:var(--signal);color:var(--signal)">ORIGIN</span>
              <h2>SIGNAL/NOISE</h2>
              <p class="mono">Alex Jr. Kich · Not numbered as part of the Cosmological Chronicles</p>
              ${origin.tagline ? `<p style="margin-top:10px;font-style:italic;color:var(--muted)">${escapeHtml(origin.tagline)}</p>` : ""}
              <p style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="/en/signal-noise/">Discover SIGNAL/NOISE</a><a class="btn" href="/livro/sample/">Read the sample</a></p>
            </div>
          </div>
        </section>

        <section class="books-future" id="chronicles">
          <span class="kicker">Cosmological Chronicles · I–X</span>
          <div class="books-grid books-grid--covers" style="margin-top:16px">${withEn.map((b) => `<a class="book-card book-card--cover" href="/en/chronicles/${b.slug}/"><img src="${escapeHtml(b.coverEn || b.cover)}" alt="Cover of ${escapeHtml(b.titleEn || b.title)}" loading="lazy" /><span class="mono">${escapeHtml(b.numeral)} · ${escapeHtml(status(b.status))}</span><h3>${escapeHtml(b.titleEn || b.title)}</h3>${(bookSheetsEn[b.slug] || {}).tagline ? `<p>${escapeHtml(bookSheetsEn[b.slug].tagline)}</p>` : ""}<span class="book-card__more mono">Synopsis and details →</span></a>`).join("")}</div>
        </section>
      </div>
    </section>`;
  write("/en/chronicles", page({
    title: "The Cosmological Chronicles",
    description: "Ten stories, different people, different places, different times. One universe that never reveals itself completely.",
    path: "/en/chronicles/",
    bodyHtml: body,
    ogImage: "/livro/capa-en.jpg",
    lang: "en", ogLocale: "en_US", minimal: true, langSwitch: "/#cronicas",
  }));
}

// /en — English home. Hub for the global site: SIGNAL/NOISE, the Cosmological Chronicles and the author.
function enHomePage(list) {
  const featuredBook = books.find((b) => b.slug === "sinal-ruido");
  const origin = bookSheetsEn["sinal-ruido"] || {};
  const withEn = list.filter((b) => (bookSheetsEn[b.slug] || {}).synopsis);
  const status = (s) => SHEET_UI.en.statusMap[s] || s;

  const body = `
    <section class="home-hero-book grid-texture" data-book-hero>
      <div class="container home-hero-book__grid">
        <div class="home-hero-book__copy" data-book-hero-copy>
          <span class="kicker">Novel · Science fiction investigation</span>
          <h1 class="home-hero-book__title">SIGNAL<span class="title-slash">/</span>NOISE</h1>
          <p class="mono home-hero-book__author">${escapeHtml(featuredBook.author)}</p>
          <p class="home-hero-book__pitch">A signal arrives from where it shouldn't — and someone decides it's safer to call it noise.</p>
          <div class="home-hero-book__actions">
            <a class="btn btn--primary" href="/livro/sample/">Read the sample</a>
            <a class="btn" href="/en/signal-noise/">Discover SIGNAL/NOISE</a>
          </div>
          ${buyPanel(featuredBook, { hideEnBr: true, hidePt: true })}
        </div>
        <div class="home-hero-book__cover" data-book-hero-cover>
          <img src="/livro/capa-en.jpg" alt="Cover of SIGNAL/NOISE" width="400" height="600" />
        </div>
      </div>
    </section>

    <section class="section container--narrow home-about-book">
      <span class="kicker">About the novel</span>
      <h2 style="margin-top:10px">SIGNAL/NOISE</h2>
      ${origin.tagline ? `<p class="home-about-book__lead" style="margin-top:14px;font-style:italic">${escapeHtml(origin.tagline)}</p>` : ""}
      <p class="home-about-book__lead" style="margin-top:14px">On August 15, 1977, the Big Ear radio telescope picked up, for 72 seconds, a signal too strong to be noise. It never repeated. SIGNAL/NOISE begins with that real event and follows three people whose lives it never should have touched.</p>
    </section>

    <section class="section section--divider" id="chronicles">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">Cosmological Chronicles · I–X</span><h2>Ten stories. One Archive. No complete answer.</h2></div></div>
        <div class="books-grid books-grid--covers" style="margin-top:16px">${withEn.map((b) => `<a class="book-card book-card--cover" href="/en/chronicles/${b.slug}/"><img src="${escapeHtml(b.coverEn || b.cover)}" alt="Cover of ${escapeHtml(b.titleEn || b.title)}" loading="lazy" /><span class="mono">${escapeHtml(b.numeral)} · ${escapeHtml(status(b.status))}</span><h3>${escapeHtml(b.titleEn || b.title)}</h3>${(bookSheetsEn[b.slug] || {}).tagline ? `<p>${escapeHtml(bookSheetsEn[b.slug].tagline)}</p>` : ""}</a>`).join("")}</div>
        <div style="margin-top:20px"><a class="btn btn--primary" href="/en/chronicles/">Explore the Chronicles</a></div>
      </div>
    </section>

    <section class="section section--divider">
      <div class="container" style="display:flex;gap:24px;flex-wrap:wrap;align-items:center;justify-content:space-between">
        <div>
          <span class="kicker">The author</span>
          <h2 style="margin-top:10px">Alex Jr. Kich</h2>
          <p style="margin-top:8px;color:var(--muted);max-width:56ch">Writer, artist and worldbuilder, based in Rio Grande do Sul, Brazil. Author of SIGNAL/NOISE, the Cosmological Chronicles and VALANDOR.</p>
        </div>
        <a class="btn" href="/en/author/">Meet the author</a>
      </div>
    </section>`;

  write("/en", page({
    title: "SIGNAL/NOISE",
    description: "SIGNAL/NOISE, a novel by Alex Jr. Kich. A real signal captured in 1977, and a question that never went away. Read the first chapters for free.",
    path: "/en/",
    bodyHtml: body,
    ogImage: "/livro/capa-en.jpg",
    lang: "en", ogLocale: "en_US", minimal: true, langSwitch: "/",
    alternates: ptEnAlternates("/", "/en/"),
  }));
}


// /cortesia/<token> — páginas não listadas de cortesia (uma em português, outra em inglês): só acessa quem tem o
// link (noindex, fora do menu, do sitemap e da busca). O EPUB fica sob o mesmo endereço secreto.
// A página em inglês só é gerada quando o EPUB em inglês existir em public/cortesia/<token>/.
const CORTESIA = {
  pt: {
    token: "55okhxeexdf9m1",
    file: "SINAL_RUIDO_cortesia.epub",
    lang: "pt-BR", ogLocale: "pt_BR",
    title: "Cortesia",
    description: "Uma cópia de cortesia de SINAL/RUÍDO, de Alex Jr. Kich, oferecida pelo autor.",
    cover: "/livro/capa.jpg", coverAlt: "Capa de SINAL/RUÍDO",
    kicker: "Cortesia do SINAL/RUÍDO",
    h1: "Este exemplar é seu.",
    lead: "Você recebeu este link porque alguém quis que você conhecesse <strong>SINAL/RUÍDO</strong>. Esta é uma cópia de cortesia, oferecida para você ler e avaliar o projeto. Baixe o ebook abaixo, sem custo. Esta página não é pública: ela não aparece no menu nem nas buscas.",
    fileLabel: "EBOOK · EPUB", btn: "Baixar EPUB",
    notice: "Cópia de cortesia para leitura e avaliação. Todos os direitos reservados: o arquivo não deve ser republicado nem redistribuído.",
    helpKicker: "Como ler",
    help: [
      "<strong>Celular ou tablet:</strong> abra o arquivo no Apple Livros (iPhone e iPad), Google Play Livros ou em outro leitor de EPUB.",
      "<strong>Kindle:</strong> envie o arquivo pelo serviço Send to Kindle da Amazon.",
      "<strong>Computador:</strong> use um leitor como o Calibre ou o próprio navegador, com uma extensão de EPUB.",
    ],
    shareKicker: "Ajude a divulgar",
    share: "Se a leitura valer a pena, você pode ajudar de outras formas: comente ou resenhe o livro, indique <a href=\"/livro/\">a página do livro</a> e siga <a href=\"https://www.instagram.com/sinal_ruido/\" target=\"_blank\" rel=\"noopener\">@sinal_ruido</a> no Instagram. Para proteger os direitos do autor, pedimos apenas que este link e o arquivo não sejam divulgados publicamente.",
    shell: {},
  },
  en: {
    token: "hfrrz5lid8ketj",
    file: "SIGNAL_NOISE_courtesy.epub",
    lang: "en", ogLocale: "en_US",
    title: "Courtesy copy",
    description: "A courtesy copy of SIGNAL/NOISE by Alex Jr. Kich, offered by the author.",
    cover: "/livro/capa-en.jpg", coverAlt: "Cover of SIGNAL/NOISE",
    kicker: "Courtesy copy of SIGNAL/NOISE",
    h1: "This copy is yours.",
    lead: "You received this link because someone wanted you to discover <strong>SIGNAL/NOISE</strong>. This is a courtesy copy, offered so you can read and evaluate the project. Download the ebook below, free of charge. This page is not public: it does not appear in menus or search results.",
    fileLabel: "EBOOK · EPUB", btn: "Download EPUB",
    notice: "Courtesy copy for reading and evaluation. All rights reserved: the file must not be republished or redistributed.",
    helpKicker: "How to read",
    help: [
      "<strong>Phone or tablet:</strong> open the file in Apple Books (iPhone and iPad), Google Play Books or any other EPUB reader.",
      "<strong>Kindle:</strong> send the file with Amazon’s Send to Kindle service.",
      "<strong>Computer:</strong> use a reader such as Calibre, or your browser with an EPUB extension.",
    ],
    shareKicker: "Help spread the word",
    share: "If the reading is worth it, you can help in other ways: review or comment on the book, point people to <a href=\"/en/signal-noise/\">the book page</a> and follow <a href=\"https://www.instagram.com/sinal_ruido/\" target=\"_blank\" rel=\"noopener\">@sinal_ruido</a> on Instagram. To protect the author’s rights, we only ask that this link and the file are not shared publicly.",
    shell: { lang: "en", ogLocale: "en_US", minimal: true },
  },
};

function cortesiaPage() {
  for (const c of Object.values(CORTESIA)) {
    const filePath = join(root, `public/cortesia/${c.token}/${c.file}`);
    if (!existsSync(filePath)) {
      console.log(`Cortesia (${c.lang}): EPUB ausente em public/cortesia/${c.token}/${c.file}; página não gerada.`);
      continue;
    }
    const epubHref = `/cortesia/${c.token}/${c.file}`;
    const epubKb = Math.round(readFileSync(filePath).length / 1024);
    const body = `
    <section class="section container--narrow courtesy">
      <span class="kicker">${c.kicker}</span>
      <h1 style="margin-top:12px">${c.h1}</h1>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">${c.lead}</p>

      <div class="courtesy__card">
        <img src="${c.cover}" alt="${c.coverAlt}" width="300" height="432" />
        <div>
          <span class="mono">${c.fileLabel} · ${epubKb} KB</span>
          <h2>${c.lang === "en" ? "SIGNAL/NOISE" : "SINAL/RUÍDO"}</h2>
          <p class="mono" style="color:var(--signal)">Alex Jr. Kich</p>
          <a class="btn btn--primary" href="${epubHref}" download="${c.file}" rel="noopener">${c.btn}</a>
          <p class="mono" style="margin-top:14px;color:var(--muted);max-width:44ch">${c.notice}</p>
        </div>
      </div>

      <section class="courtesy__help">
        <span class="kicker">${c.helpKicker}</span>
        <ul>
          ${c.help.map((h) => `<li>${h}</li>`).join("\n          ")}
        </ul>
      </section>

      <section class="courtesy__help">
        <span class="kicker">${c.shareKicker}</span>
        <p style="margin-top:8px;color:var(--muted);max-width:60ch">${c.share}</p>
      </section>
    </section>`;
    write(`/cortesia/${c.token}`, page({ title: c.title, description: c.description, path: `/cortesia/${c.token}/`, bodyHtml: body, robots: "noindex,nofollow,noarchive", ogImage: c.cover, ...c.shell }));
  }
}


function privacidadePage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Privacidade</span>
      <h1 style="margin-top:12px">Poucos dados. Finalidade explícita.</h1>
      <p style="margin-top:10px;color:var(--muted)">O arquivo factual pode ser consultado sem conta. O site não tem formulários, contas nem comentários. O site não coleta dados pessoais de visitantes. O perfil @sinal_ruido no Instagram é publicado por meio da API oficial da Meta. A infraestrutura de entrega e segurança (Cloudflare) pode processar dados técnicos de conexão conforme sua própria operação. Responsável pelo site e pelo perfil: Alex Jr. Kich.</p>
      <div class="paper method-block" id="instagram" style="margin-top:28px"><h2>Publicação no Instagram (@sinal_ruido)</h2>
        <p>O SINAL/RUÍDO usa a API do Instagram (Meta) apenas para publicar conteúdo no perfil <a href="https://www.instagram.com/sinal_ruido/" rel="noopener">@sinal_ruido</a>. O acesso usa um token da conta profissional autorizada pelo titular, guardado em banco Cloudflare D1 e nunca exposto publicamente.</p>
        <p><strong>Dados de terceiros:</strong> o site não recebe, lê nem armazena comentários, mensagens, identificadores ou listas de seguidores de outras pessoas. Não há resposta automática.</p>
        <p><strong>Compartilhamento:</strong> os dados não são vendidos, não são usados para publicidade e não são repassados a terceiros. O processamento passa pela Meta (Instagram) e pela Cloudflare, que operam a infraestrutura.</p>
      </div>
      <div class="paper method-block" id="exclusao-de-dados" style="margin-top:16px"><h2>Exclusão de dados e contato</h2>
        <p>Como o site não guarda dados de visitantes nem de quem interage no Instagram, não há dados a excluir. Se você acredita que exista algum registro ligado a você, envie uma mensagem direta para <a href="https://www.instagram.com/sinal_ruido/" rel="noopener">@sinal_ruido</a> (mais detalhes em <a href="/contato/">/contato</a>), informando o seu nome de usuário no Instagram e o que deseja verificar. O resultado será confirmado a você.</p>
      </div>
      <p class="mono" style="margin-top:20px;color:var(--muted)">Última atualização: 25 de setembro de 2026.</p>
    </section>`;
  write("/privacidade", page({
    title: "Privacidade",
    description: "Política de privacidade do SINAL/RUÍDO: o site não coleta dados pessoais; publicação no Instagram pela API da Meta.",
    path: "/privacidade/",
    bodyHtml: body,
    alternates: ptEnAlternates("/privacidade/", "/en/privacy/"),
    langSwitch: "/en/privacy/",
  }));
}

function enPrivacidadePage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Privacy</span>
      <h1 style="margin-top:12px">Little data. Explicit purpose.</h1>
      <p style="margin-top:10px;color:var(--muted)">The factual archive can be browsed without an account. The site has no forms, accounts or comments. The site does not collect visitors' personal data. The @sinal_ruido Instagram profile is published through Meta's official API. Delivery and security infrastructure (Cloudflare) may process technical connection data as part of its own operation. Responsible for the site and the profile: Alex Jr. Kich.</p>
      <div class="paper method-block" id="instagram" style="margin-top:28px"><h2>Publishing on Instagram (@sinal_ruido)</h2>
        <p>SINAL/RUÍDO uses the Instagram API (Meta) only to publish content on the <a href="https://www.instagram.com/sinal_ruido/" rel="noopener">@sinal_ruido</a> profile. Access uses a token from the professional account authorized by its owner, stored in a Cloudflare D1 database and never exposed publicly.</p>
        <p><strong>Third-party data:</strong> the site does not receive, read or store comments, messages, identifiers or follower lists from other people. There is no automatic reply.</p>
        <p><strong>Sharing:</strong> data is not sold, not used for advertising and not passed on to third parties. Processing runs through Meta (Instagram) and Cloudflare, which operate the infrastructure.</p>
      </div>
      <div class="paper method-block" id="exclusao-de-dados" style="margin-top:16px"><h2>Data deletion and contact</h2>
        <p>Since the site does not keep data on visitors or on anyone who interacts on Instagram, there is no data to delete. If you believe a record exists that is linked to you, send a direct message to <a href="https://www.instagram.com/sinal_ruido/" rel="noopener">@sinal_ruido</a> (more details at <a href="/en/contact/">/en/contact</a>), stating your Instagram username and what you want verified. The result will be confirmed to you.</p>
      </div>
      <p class="mono" style="margin-top:20px;color:var(--muted)">Last updated: September 25, 2026.</p>
    </section>`;
  write("/en/privacy", page({
    title: "Privacy",
    description: "SINAL/RUÍDO privacy policy: the site does not collect personal data; Instagram publishing through the Meta API.",
    path: "/en/privacy/",
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/privacidade/", "/en/privacy/"),
    langSwitch: "/privacidade/",
  }));
}

// ---------------------------------------------------------------------
// /contato
// ---------------------------------------------------------------------
function contatoPage() {
  const body = `
    <section class="section container--narrow" id="autor">
      <span class="kicker">Autor</span>
      <h2 style="margin-top:10px">Alex Jr. Kich</h2>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">Autor de SINAL/RUÍDO. Acompanhe o livro e o arquivo no <a href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Instagram @sinal_ruido</a>. Imprensa e materiais de divulgação estão em <a href="/imprensa/">Imprensa</a>.</p>
    </section>

    <section class="section container--narrow" id="profissional">
      <span class="kicker">Contato</span>
      <h1 style="margin-top:12px">Fale com o projeto.</h1>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">Este site não coleta mensagens. Para falar com o autor, envie uma mensagem direta pelo Instagram. Para imprensa, podcasts e parcerias editoriais, veja a página de Imprensa.</p>
      <div class="grid grid--2" style="margin-top:24px">
        <div class="paper" style="padding:24px"><span class="kicker">Instagram</span><h2 style="margin-top:10px">@sinal_ruido</h2><p style="margin-top:8px">Mensagens diretas, relatos e sugestões de caso.</p><p style="margin-top:12px"><a class="btn btn--primary" href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Abrir o Instagram</a></p></div>
        <div class="paper" style="padding:24px"><span class="kicker">Imprensa</span><h2 style="margin-top:10px">Press kit e parcerias</h2><p style="margin-top:8px">Materiais públicos do projeto, para imprensa, podcasts e parceiros editoriais.</p><p style="margin-top:12px"><a class="btn" href="/imprensa/">Ir para Imprensa</a></p></div>
      </div>
    </section>`;
  write("/contato", page({
    title: "Contato",
    description: "Como falar com o autor e o projeto SINAL/RUÍDO: Instagram e página de imprensa.",
    path: "/contato/",
    bodyHtml: body,
    alternates: ptEnAlternates("/contato/", "/en/contact/"),
    langSwitch: "/en/contact/",
  }));
}

function enContatoPage() {
  const body = `
    <section class="section container--narrow" id="autor">
      <span class="kicker">Author</span>
      <h2 style="margin-top:10px">Alex Jr. Kich</h2>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">Author of SIGNAL/NOISE. Follow the book and the archive on <a href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Instagram @sinal_ruido</a>. Press and media materials are at <a href="/en/press/">Press</a>.</p>
    </section>

    <section class="section container--narrow" id="profissional">
      <span class="kicker">Contact</span>
      <h1 style="margin-top:12px">Get in touch with the project.</h1>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">This site does not collect messages. To reach the author, send a direct message on Instagram. For press, podcasts and editorial partnerships, see the Press page.</p>
      <div class="grid grid--2" style="margin-top:24px">
        <div class="paper" style="padding:24px"><span class="kicker">Instagram</span><h2 style="margin-top:10px">@sinal_ruido</h2><p style="margin-top:8px">Direct messages, reports and case suggestions.</p><p style="margin-top:12px"><a class="btn btn--primary" href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Open Instagram</a></p></div>
        <div class="paper" style="padding:24px"><span class="kicker">Press</span><h2 style="margin-top:10px">Press kit and partnerships</h2><p style="margin-top:8px">Public project materials, for press, podcasts and editorial partners.</p><p style="margin-top:12px"><a class="btn" href="/en/press/">Go to Press</a></p></div>
      </div>
    </section>`;
  write("/en/contact", page({
    title: "Contact",
    description: "How to reach the author and the SIGNAL/NOISE project: Instagram and the press page.",
    path: "/en/contact/",
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/contato/", "/en/contact/"),
    langSwitch: "/contato/",
  }));
}

// ---------------------------------------------------------------------
// 404.html — sem ela o Cloudflare Pages trata o site como SPA e devolve a home com
// status 200 para qualquer endereço inexistente. Fica fora das rotas e do sitemap.
// ---------------------------------------------------------------------
function notFoundPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Erro 404</span>
      <h1 style="margin-top:12px">Página não encontrada.</h1>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">O endereço não existe ou mudou de lugar. Comece por aqui:</p>
      <p style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="/">Início</a><a class="btn" href="/livro/amostra/">Ler a amostra</a><a class="btn" href="/arquivo/">Arquivo</a></p>
    </section>`;
  writeFileSync(join(root, "404.html"), page({
    title: "Página não encontrada",
    description: "A página procurada não existe ou mudou de lugar.",
    path: "/404.html",
    bodyHtml: body,
    robots: "noindex,follow",
  }));
}

// ---------------------------------------------------------------------
// /buy — roteador de compra por mercado (dados em src/data/markets.json e buy.json).
// Só exibe edições com link conhecido. Fica noindex e fora do sitemap até a versão
// global ser validada. Sem capa: a capa internacional ainda não foi homologada.
// ---------------------------------------------------------------------
function buyPage() {
  const markets = marketList();
  const chips = markets.map((m) => `<a class="buy-chip" href="#${m.code.toLowerCase()}" data-market-chip="${m.code}">${escapeHtml(m.name)}</a>`).join("");
  const sections = markets.map((m) => {
    const links = buyLinks(m.code).map((l) => `${buyLinkHtml(l.url, escapeHtml(l.label), "Amazon " + m.code)}`).join("");
    return `<section class="buy-market" id="${m.code.toLowerCase()}" data-market="${m.code}">
        <h2>${escapeHtml(m.name)} <span class="mono buy-market__flag" data-suggested-label hidden>Suggested for you</span></h2>
        <div class="buy-group__links">${links}</div>
      </section>`;
  }).join("");
  const body = `
    <section class="section container--narrow" data-buy-router>
      <span class="kicker">Get the book</span>
      <h1 style="margin-top:12px">${escapeHtml(buyData.title)}</h1>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">Choose your region, then your edition. Links open Amazon in a new tab.</p>
      <nav class="buy-chips" aria-label="Choose your region">${chips}</nav>
      ${sections}
      <p class="mono" style="margin-top:28px;color:var(--muted)">Reading in Portuguese? See the <a href="/livro/">Portuguese edition</a>.</p>
    </section>`;
  write("/buy", page({
    title: "Get SIGNAL/NOISE",
    description: "Choose your region and edition of SIGNAL/NOISE by Alex Jr. Kich.",
    path: "/buy/",
    bodyHtml: body,
    robots: "noindex,follow",
    lang: "en",
    ogLocale: "en_US",
    minimal: true,
  }));
}

// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// /leitores
// ---------------------------------------------------------------------
function leitoresPage() {
  const bookCases = cases.filter((c) => c.bookNote);
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Para quem leu o livro</span>
      <h1 style="margin-top:12px">A investigação não termina aqui.</h1>
      <p style="margin-top:8px;color:var(--muted)">O romance é ficção. Os temas que ele toca — e os casos que o inspiraram — são reais e continuam documentados neste arquivo público.</p>

      <section style="margin-top:32px">
        <h2 style="font-size:16px">Fato, testemunho, hipótese e ficção</h2>
        <p style="margin-top:8px;color:var(--muted)">Este site separa quatro coisas que costumam se misturar: o registro documental, o relato de quem viveu o episódio (testemunho), a interpretação sobre o que aconteceu (hipótese) e a história inventada do romance (ficção). Um documento registra uma afirmação ou ocorrência; ele não se transforma automaticamente em fato por existir.</p>
      </section>

      <section style="margin-top:32px">
        <h2 style="font-size:16px">Casos reais que inspiraram o romance</h2>
        <div class="grid" style="margin-top:16px">${bookCases.map(caseCard).join("")}</div>
        <a href="/casos/" class="mono" style="display:inline-block;margin-top:12px">Ver o arquivo completo →</a>
      </section>

      <div style="margin-top:36px;padding-top:20px;border-top:1px solid var(--border);display:flex;gap:12px;flex-wrap:wrap">
        <a href="/livro/" class="btn">Voltar à página do livro</a>
        <button type="button" class="btn btn--primary" data-share data-share-title="SINAL/RUÍDO — Leitores" data-share-text="A investigação não termina aqui.">Compartilhar</button>
      </div>
    </section>`;
  write("/leitores", page({
    title: "Leitores",
    description: "Página complementar para leitores do romance SINAL/RUÍDO.",
    path: "/leitores/",
    bodyHtml: body,
    alternates: ptEnAlternates("/leitores/", "/en/readers/"),
    langSwitch: "/en/readers/",
  }));
}

function enLeitoresPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">For readers of the book</span>
      <h1 style="margin-top:12px">The investigation doesn't end here.</h1>
      <p style="margin-top:8px;color:var(--muted)">The novel is fiction. The themes it touches — and the cases that inspired it — are real and remain documented in this public archive.</p>

      <section style="margin-top:32px">
        <h2 style="font-size:16px">Fact, testimony, hypothesis and fiction</h2>
        <p style="margin-top:8px;color:var(--muted)">This site keeps four things separate that tend to blur together: the documentary record, the account of someone who lived through the episode (testimony), the interpretation of what happened (hypothesis), and the invented story of the novel (fiction). A document records a claim or an occurrence; it does not automatically become fact just by existing.</p>
      </section>

      <section style="margin-top:32px">
        <h2 style="font-size:16px">Real cases that inspired the novel</h2>
        <div class="grid" style="margin-top:16px">${casesEn.map(enCaseCard).join("")}</div>
        <a href="/en/archive/" class="mono" style="display:inline-block;margin-top:12px">See the full archive →</a>
      </section>

      <div style="margin-top:36px;padding-top:20px;border-top:1px solid var(--border);display:flex;gap:12px;flex-wrap:wrap">
        <a href="/en/signal-noise/" class="btn">Back to the book page</a>
      </div>
    </section>`;
  write("/en/readers", page({
    title: "Readers",
    description: "Companion page for readers of the novel SIGNAL/NOISE.",
    path: "/en/readers/",
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/leitores/", "/en/readers/"),
    langSwitch: "/leitores/",
  }));
}

// ---------------------------------------------------------------------
// /r/[campanha] — redirecionamento estático para /leitores?campanha=X
// ---------------------------------------------------------------------
function campanhaRedirect(campanha) {
  const target = `/leitores/?campanha=${encodeURIComponent(campanha)}`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=${target}" />
  <title>SINAL/RUÍDO</title></head>
  <body><script>location.replace(${JSON.stringify(target)})</script>
  <p>Redirecionando para ${escapeHtml(target)}…</p></body></html>`;
  write(`/r/${campanha}`, html);
}

// ---------------------------------------------------------------------
// /documentos — entidade de primeira classe derivada dos documentos dos casos
// ---------------------------------------------------------------------
function documentosPage() {
  const body = `
    <section class="section">
      <div class="container">
        <span class="kicker">Acervo documental</span>
        <h1 style="margin-top:12px">Documentos.</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:70ch">Um documento é um registro, não uma garantia de veracidade. Esta área organiza origem, data, relação com casos e acesso à fonte quando disponível.</p>
        <div class="grid grid--3" style="margin-top:24px">
          ${documents.map((d) => `
            <a class="card" href="/documentos/${d.slug}/">
              <span class="card__meta">${escapeHtml(d.tipo)} · ${escapeHtml(d.caseCode)}</span>
              <h3>${escapeHtml(d.titulo)}</h3>
              <p>${escapeHtml(d.descricao)}</p>
              <p class="mono" style="margin-top:8px;font-size:11px;color:var(--muted)">${escapeHtml(d.origem)}</p>
            </a>`).join("")}
        </div>
      </div>
    </section>`;
  write("/documentos", page({
    title: "Documentos",
    description: "Acervo documental do SINAL/RUÍDO, com origem e relação explícita com os casos.",
    path: "/documentos/",
    bodyHtml: body,
  }));
}

function documentoDetailPage(doc) {
  const body = `
    <article class="section container--narrow">
      <a href="/documentos/" class="mono" style="color:var(--muted)">← Voltar aos documentos</a>
      <div class="paper" style="margin-top:20px;padding:28px">
        <span class="kicker">Registro documental</span>
        <p class="mono" style="margin-top:8px;color:var(--paper-muted)">${escapeHtml(doc.tipo)} · ${escapeHtml(doc.caseCode)}</p>
        <h1 style="margin-top:8px">${escapeHtml(doc.titulo)}</h1>
        <p style="margin-top:14px">${escapeHtml(doc.descricao)}</p>
        <dl class="metadata-grid" style="margin-top:24px">
          ${doc.data ? `<div><dt>DATA</dt><dd>${escapeHtml(doc.data)}</dd></div>` : ""}
          <div><dt>ORIGEM</dt><dd>${escapeHtml(doc.origem)}</dd></div>
          <div><dt>CASO RELACIONADO</dt><dd><a href="/casos/${doc.caseSlug}/">${escapeHtml(doc.caseTitle)}</a></dd></div>
        </dl>
        ${doc.linkExterno ? `<a class="btn" style="margin-top:20px" href="${escapeHtml(doc.linkExterno)}" target="_blank" rel="noopener noreferrer">Abrir fonte externa ↗</a>` : `<p class="mono" style="margin-top:20px;color:var(--paper-muted)">LINK DIRETO À FONTE: ainda não cadastrado.</p>`}
      </div>
      <p class="mono" style="margin-top:16px;color:var(--muted)">A presença de um documento oficial ou institucional confirma sua proveniência documental, não a interpretação extraordinária de seu conteúdo.</p>
    </article>`;
  write(`/documentos/${doc.slug}`, page({
    title: doc.titulo,
    description: doc.descricao,
    path: `/documentos/${doc.slug}/`,
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------
// /metodo
// ---------------------------------------------------------------------
function metodoPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Política editorial</span>
      <h1 style="margin-top:12px">Nem deboche, nem fé. Método.</h1>
      <p style="margin-top:12px;font-size:18px;color:var(--muted)">O SINAL/RUÍDO não parte da conclusão. Organiza o material disponível, registra a proveniência, separa testemunho de documento, explicita hipóteses concorrentes e preserva o direito de terminar em “não sabemos”.</p>

      <div class="grid" style="margin-top:28px">
        <div class="paper method-block"><span class="kicker">01 · Documento</span><h2>O registro existe.</h2><p>Identificamos origem, data, cadeia de cópias, contexto, alterações e acesso ao original quando possível. Documento oficial não significa confirmação de uma interpretação extraordinária.</p></div>
        <div class="paper method-block"><span class="kicker">02 · Testemunho</span><h2>Alguém declarou algo.</h2><p>Registramos quem falou, quando falou, quanto tempo havia passado, versões existentes e possíveis contaminações posteriores. Testemunho é evidência testemunhal, não prova física automática.</p></div>
        <div class="paper method-block"><span class="kicker">03 · Hipótese</span><h2>Uma explicação compete com outras.</h2><p>Hipóteses convencionais, instrumentais, atmosféricas e extraordinárias devem ser avaliadas pelo que explicam e pelo que deixam de explicar, sem prêmio por serem mais interessantes.</p></div>
      </div>

      <section style="margin-top:36px">
        <h2>Níveis de maturidade</h2>
        <div class="grid grid--3" style="margin-top:16px">
          <div class="card"><strong>Nível 1 · Registro</strong><p>Ficha básica e fontes iniciais. Não representa investigação completa.</p></div>
          <div class="card"><strong>Nível 2 · Caso indexado</strong><p>Material organizado e rastreável, ainda sujeito a auditoria factual formal.</p></div>
          <div class="card"><strong>Nível 3 · Dossiê revisado</strong><p>Auditoria factual WEB homologada, genealogia de fontes e limitações explicitadas.</p></div>
        </div>
      </section>

      <section style="margin-top:36px" class="paper method-block">
        <h2>O que o arquivo nunca faz</h2>
        <ul class="method-list"><li>Não calcula “probabilidade extraterrestre”.</li><li>Não usa popularidade como evidência.</li><li>Não converte ausência de explicação em confirmação.</li><li>Não apresenta ficção do romance como fato.</li><li>Não esconde correções ou limitações conhecidas.</li></ul>
      </section>
    </section>`;
  write("/metodo", page({
    title: "Método",
    description: "Método editorial do SINAL/RUÍDO: documento, testemunho, hipótese, proveniência e revisão explícita.",
    path: "/metodo/",
    bodyHtml: body,
    alternates: ptEnAlternates("/metodo/", "/en/method/"),
    langSwitch: "/en/method/",
  }));
}

function enMetodoPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Editorial policy</span>
      <h1 style="margin-top:12px">Neither mockery, nor faith. Method.</h1>
      <p style="margin-top:12px;font-size:18px;color:var(--muted)">SINAL/RUÍDO does not start from the conclusion. It organizes the available material, records provenance, separates testimony from document, spells out competing hypotheses, and preserves the right to end in "we don't know."</p>

      <div class="grid" style="margin-top:28px">
        <div class="paper method-block"><span class="kicker">01 · Document</span><h2>The record exists.</h2><p>We identify origin, date, chain of copies, context, alterations and access to the original when possible. An official document does not mean confirmation of an extraordinary interpretation.</p></div>
        <div class="paper method-block"><span class="kicker">02 · Testimony</span><h2>Someone stated something.</h2><p>We record who spoke, when, how much time had passed, existing versions and possible later contamination. Testimony is testimonial evidence, not automatic physical proof.</p></div>
        <div class="paper method-block"><span class="kicker">03 · Hypothesis</span><h2>One explanation competes with others.</h2><p>Conventional, instrumental, atmospheric and extraordinary hypotheses must be judged by what they explain and what they fail to explain, with no bonus for being more interesting.</p></div>
      </div>

      <section style="margin-top:36px">
        <h2>Maturity levels</h2>
        <div class="grid grid--3" style="margin-top:16px">
          <div class="card"><strong>Level 1 · Record</strong><p>Basic entry and initial sources. Does not represent a complete investigation.</p></div>
          <div class="card"><strong>Level 2 · Indexed case</strong><p>Organized, traceable material, still subject to formal factual audit.</p></div>
          <div class="card"><strong>Level 3 · Reviewed dossier</strong><p>Approved WEB factual audit, source genealogy and limitations spelled out.</p></div>
        </div>
      </section>

      <section style="margin-top:36px" class="paper method-block">
        <h2>What the archive never does</h2>
        <ul class="method-list"><li>Does not calculate an "extraterrestrial probability."</li><li>Does not use popularity as evidence.</li><li>Does not turn absence of an explanation into confirmation.</li><li>Does not present the novel's fiction as fact.</li><li>Does not hide known corrections or limitations.</li></ul>
      </section>
    </section>`;
  write("/en/method", page({
    title: "Method",
    description: "SINAL/RUÍDO editorial method: document, testimony, hypothesis, provenance and explicit review.",
    path: "/en/method/",
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/metodo/", "/en/method/"),
    langSwitch: "/metodo/",
  }));
}

// ---------------------------------------------------------------------
// /correcoes
// ---------------------------------------------------------------------
function correcoesPage() {
  const published = corrections.filter((c) => c.public === true);
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Transparência editorial</span>
      <h1 style="margin-top:12px">Correções.</h1>
      <p style="margin-top:8px;color:var(--muted)">Quando uma informação factual publicada for corrigida, o registro deve permanecer visível com data, mudança, motivo e referência ao dossiê afetado. Correções internas ou dados demonstrativos não entram neste histórico público.</p>
      ${published.length ? `<div class="grid" style="margin-top:24px">${published.map((c) => `<div class="card"><span class="card__meta">${escapeHtml(c.date)}</span><h3>${escapeHtml(c.change)}</h3><p>${escapeHtml(c.reason)}</p><a class="mono" href="/casos/${c.caseSlug}/">${escapeHtml(c.caseTitle)} →</a></div>`).join("")}</div>` : `<div class="paper" style="margin-top:24px;padding:24px"><strong>Nenhuma correção factual pública homologada nesta versão.</strong><p style="margin-top:8px;color:var(--paper-muted)">Este estado vazio é intencional. O histórico só será preenchido quando houver uma correção factual real a registrar.</p></div>`}
    </section>`;
  write("/correcoes", page({
    title: "Correções",
    description: "Histórico público de correções factuais do SINAL/RUÍDO.",
    path: "/correcoes/",
    bodyHtml: body,
    alternates: ptEnAlternates("/correcoes/", "/en/corrections/"),
    langSwitch: "/en/corrections/",
  }));
}

function enCorrecoesPage() {
  const published = corrections.filter((c) => c.public === true);
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Editorial transparency</span>
      <h1 style="margin-top:12px">Corrections.</h1>
      <p style="margin-top:8px;color:var(--muted)">When a published factual claim is corrected, the record stays visible with date, change, reason and a reference to the affected dossier. Internal corrections or demonstration data do not enter this public history.</p>
      ${published.length ? `<div class="grid" style="margin-top:24px">${published.map((c) => `<div class="card"><span class="card__meta">${escapeHtml(c.date)}</span><h3>${escapeHtml(c.change)}</h3><p>${escapeHtml(c.reason)}</p><a class="mono" href="/casos/${c.caseSlug}/" hreflang="pt-BR">${escapeHtml(c.caseTitle)} →</a></div>`).join("")}</div>` : `<div class="paper" style="margin-top:24px;padding:24px"><strong>No public factual correction approved in this version.</strong><p style="margin-top:8px;color:var(--paper-muted)">This empty state is intentional. The history will only be filled in when there is an actual factual correction to record.</p></div>`}
    </section>`;
  write("/en/corrections", page({
    title: "Corrections",
    description: "Public history of factual corrections for SINAL/RUÍDO.",
    path: "/en/corrections/",
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/correcoes/", "/en/corrections/"),
    langSwitch: "/correcoes/",
  }));
}

// ---------------------------------------------------------------------
// /imprensa
// ---------------------------------------------------------------------
// /autor — página do autor (segunda versão do texto). Só PT. Sem formulário e sem newsletter (regra do MVP).
// Sem material ainda: rascunhos a lápis, capa e mapas de VALANDOR e página/link de VALANDOR (por isso não há botão para ele).
const AMAZON_DUAS_IRMAS = "https://www.amazon.com.br/dp/B0HGMMSBSX";
const AMAZON_AUTHOR_PAGE = "https://www.amazon.ca/stores/ALEX-JR.-KICH/author/B0HH718W4M";
const CRONICAS_LINHAS = {
  "os-deuses-nao-tem-filhos": "Se alguém criou você, isso lhe dá o direito de decidir quem você deve ser?",
  "a-ultima-testemunha": "Algumas coisas só acontecem se alguém estiver olhando.",
  "amanha-nao-existe": "O que sobra do livre-arbítrio quando uma máquina entrega as respostas antes das perguntas?",
  "o-universo-nao-responde": "Um sinal vindo de além de Netuno traz uma única frase: “Não respondam à luz.”",
  "o-arquivo-dos-mortos": "Se tudo sobre uma pessoa puder ser guardado, ela continua existindo?",
  "antes-de-nascermos": "Crianças desenham o mesmo lugar e dizem que estiveram lá antes de nascer.",
  "o-ceu-esta-errado": "As estrelas começam a desaparecer. Depois, os próprios registros passam a afirmar que elas nunca estiveram ali.",
  "o-retangulo-negro": "Ilse Moura continua lembrando dos filhos enquanto o resto do mundo esquece que eles existiram.",
  "nao-tem-a-palavra": "A última falante de uma língua conhece uma palavra que abre uma porta para outro lugar por 1,7 segundo.",
  "o-ultimo-sinal": "Tudo converge para uma frase que atravessou as histórias desde o começo, quase escondida.",
};

function autorPage() {
  const cronicas = books.filter((b) => b.kind === "Crônicas Cosmológicas");
  const cards = cronicas.map((b) => `
        <a class="autor-cron" href="/livros/${b.slug}/">
          <img src="/livros/thumbs/${b.slug}.jpg" alt="Capa de ${escapeHtml(b.title)}" width="360" height="575" loading="lazy" />
          <span class="autor-cron__num">${escapeHtml(b.numeral)}</span>
          <strong>${escapeHtml(b.title)}</strong>
          <span>${escapeHtml(CRONICAS_LINHAS[b.slug] || b.description || "")}</span>
        </a>`).join("");
  const amazon = buyLinkHtml(AMAZON_DUAS_IRMAS, "Livro 1 · O Mapa Debaixo da Cama", "Amazon BR");
  const ficha = (img, nome, alt) => `<figure class="autor-ficha"><img src="/autor/${img}.jpg" alt="${alt}" loading="lazy" /><figcaption>${nome}</figcaption></figure>`;
  const lines = (arr) => arr.map((t) => `<p class="autor-line">${t}</p>`).join("");

  const body = `
    <section class="autor-hero">
      <div class="autor-hero__text">
        <h1>Alex Jr. Kich</h1>
        <p class="autor-hero__lead">Escritor, artista e criador de mundos.</p>
        <p>Vivo no Rio Grande do Sul. Desenho, componho e escrevo histórias em escalas muito diferentes: algumas olham para o céu, outras constroem mundos inteiros, outras cabem debaixo de uma cama.</p>
        <p>Mas a regra é sempre a mesma:</p>
        <p class="autor-cite">O conceito pode ser enorme, mas o conflito precisa continuar humano.</p>
        <p><a class="btn btn--primary" href="/#livros">Conhecer os livros</a></p>
      </div>
      <div class="autor-hero__photo"><img src="/autor/retrato.jpg" alt="Retrato de Alex Jr. Kich, de mãos juntas, olhando para o lado" width="1149" height="1368" loading="lazy" /></div>
    </section>

    <section class="autor-sec autor-sobre">
      <div class="autor-narrow">
        <span class="kicker">Sobre mim</span>
        <h2>Gosto de histórias que começam pequenas.</h2>
        ${lines(["Uma fotografia.", "Uma ausência.", "Uma criança que sabe alguma coisa que não deveria saber.", "Um sinal.", "Um rio.", "Um mapa esquecido debaixo da cama."])}
        <p>A partir daí, a história pode crescer o quanto precisar. Pode chegar a Netuno, atravessar o tempo ou inventar um mundo inteiro.</p>
        <p>Mas alguém precisa continuar no centro, tentando entender o que está acontecendo.</p>
        <p>Uma estrela que desaparece é um fenômeno.</p>
        <p class="autor-cite">Uma mãe que percebe que o mundo inteiro esqueceu que o filho dela existiu, isso é uma história.</p>
        <p class="autor-cite autor-cite--accent">É essa diferença que eu procuro.</p>
      </div>
    </section>

    <section class="autor-sec autor-sec--alt" id="por-onde-comecar">
      <div class="autor-wrap">
        <div class="autor-center"><span class="kicker">Por onde começar</span><h2>Não precisa conhecer tudo para entrar.</h2></div>
        <div class="autor-start">
          <article>
            <a class="autor-start__cover" href="/livros/sinal-ruido/"><img src="/livro/capa.jpg" alt="Capa de SINAL/RUÍDO" width="400" height="600" loading="lazy" /></a>
            <span class="mono autor-start__kicker">Ficção científica</span><h3>SINAL/RUÍDO</h3>
            <p>Um sinal real captado em 1977. Uma pergunta que nunca foi embora.</p>
            <a class="btn" href="/livros/sinal-ruido/">Conhecer SINAL/RUÍDO</a>
          </article>
          <article>
            <a class="autor-start__cover" href="/#cronicas"><img src="/autor/cronicas-cosmologicas-capa.png" alt="Capa da coleção Crônicas Cosmológicas" width="1024" height="1536" loading="lazy" /></a>
            <span class="mono autor-start__kicker">Mistério cosmológico</span><h3>Crônicas Cosmológicas</h3>
            <p>Dez histórias independentes ligadas por algo que registra pessoas, acontecimentos e até versões da realidade que talvez nunca tenham existido.</p>
            <a class="btn" href="/#cronicas">Explorar as Crônicas</a>
          </article>
          <article>
            <a class="autor-start__typo" href="#valandor"><span>V</span><em>VALANDOR</em></a>
            <span class="mono autor-start__kicker">Fantasia</span><h3>VALANDOR</h3>
            <p>Um mundo onde os rios lembram e onde possuir um poder nunca resolve a pergunta mais importante: usá-lo para quê?</p>
            <a class="btn" href="#valandor">Entrar em VALANDOR</a>
          </article>
          <article>
            <a class="autor-start__cover" href="#duas-irmas"><img src="/autor/duas-irmas-capa.jpg" alt="Capa de Duas Irmãs e Oito Patas" width="636" height="900" loading="lazy" /></a>
            <span class="mono autor-start__kicker">Literatura infantil</span><h3>Duas Irmãs e Oito Patas</h3>
            <p>Duas meninas, dois cães e a suspeita de que uma casa comum pode esconder muito mais do que parece.</p>
            <a class="btn" href="#duas-irmas">Conhecer a série</a>
          </article>
        </div>
      </div>
    </section>

    <section class="autor-sec autor-sr">
      <div class="autor-wrap autor-split autor-split--cover">
        <div>
          <span class="kicker">Romance · Obra de origem</span>
          <h2>SINAL/RUÍDO</h2>
          <p class="autor-cite">E se o sinal mais importante já tivesse chegado?</p>
          <p>Em 15 de agosto de 1977, o radiotelescópio Big Ear, em Ohio, captou durante 72 segundos um sinal forte demais para ser ruído.</p>
          <p>Um astrônomo circulou o registro e escreveu ao lado:</p>
          <p class="autor-cite autor-cite--accent">Wow!</p>
          <p>O sinal nunca mais se repetiu.</p>
          <p>SINAL/RUÍDO começa nesse episódio real.</p>
          <p>Henrique, Marina e Lara seguem vestígios que ligam aquele sinal a coisas próximas demais: registros incompletos, coincidências que insistem em voltar, uma porteira, um desaparecimento.</p>
          <p>O problema começa científico.</p>
          <p>Depois deixa de ser.</p>
          <p>A pergunta já não é apenas quem enviou o sinal.</p>
          <p>É outra:</p>
          <p class="autor-cite">como a gente sabe que alguma coisa é, de fato, uma mensagem?</p>
          <p>Talvez tenhamos passado tempo demais procurando respostas parecidas conosco.</p>
          <p class="mono autor-note">Romance independente e obra de origem do universo das Crônicas Cosmológicas.</p>
          <p><a class="btn btn--primary" href="/livros/sinal-ruido/">Conhecer SINAL/RUÍDO</a></p>
        </div>
        <div class="autor-cover"><img src="/livro/capa.jpg" alt="Capa de SINAL/RUÍDO" width="400" height="600" loading="lazy" /></div>
      </div>
    </section>

    <section class="autor-sec autor-cron-sec" id="cronicas-autor">
      <div class="autor-wrap">
        <div class="autor-center">
          <span class="kicker">Crônicas Cosmológicas</span>
          <h2>Dez histórias. Um Arquivo. Nenhuma resposta completa.</h2>
          <p>Depois de SINAL/RUÍDO, o universo se abre.</p>
          <p>São dez romances com protagonistas, épocas e conflitos próprios. É possível entrar por qualquer um deles.</p>
          <p>Por baixo de todos, porém, existe alguma coisa.</p>
          <p>O Arquivo.</p>
          <p>Ele registra pessoas, acontecimentos e versões do que poderia ter sido.</p>
          <p>Às vezes sabe demais. Às vezes esquece.</p>
          <p>E, de vez em quando, guarda coisas que ainda não deveriam existir.</p>
        </div>
        <div class="autor-cron-grid">${cards}
        </div>
        <p class="autor-center autor-note">Nenhum volume explica o Arquivo inteiro. De propósito.</p>
        <p class="autor-center"><a class="btn btn--primary" href="/#cronicas">Explorar as Crônicas Cosmológicas</a></p>
      </div>
    </section>

    <section class="autor-sec" id="valandor">
      <div class="autor-wrap">
        <div class="autor-narrow" style="margin:0">
          <span class="kicker">Fantasia</span>
          <h2>VALANDOR</h2>
          <p class="autor-cite">Um mundo onde os rios lembram.</p>
          <p>Valandor começou como uma história e cresceu até ganhar povos, mapas, passado, mitologia e regras próprias.</p>
          <p>No centro está Kayla, que carrega o Dom.</p>
          <p>Mas possuir um poder não responde à pergunta mais difícil:</p>
          <p class="autor-cite">mesmo podendo, deveria?</p>
          <p>Um rio capaz de guardar memórias é uma ideia.</p>
          <p>Vira história quando uma menina descobre que esse rio guarda alguma coisa sobre a própria família.</p>
        </div>
        <div class="autor-vol-grid">
          <article class="autor-vol autor-vol--main"><span class="mono">Livro I</span><h3>O Que o Rio Esqueceu</h3><p>Na família de Kayla, todos confundem proteção com silêncio.</p><p>O que ninguém contou a ela ficou guardado em algum lugar.</p><p>E o rio Orasûn lembra.</p><p>Ao lado de Aelora, Kayla segue o curso do rio até onde histórias familiares sobrevivem justamente porque ninguém pensou em procurá-las ali.</p><p>Só que memória não é a mesma coisa que verdade inteira.</p><p>E o Dom não decide por ela o que fazer com aquilo que encontrar.</p></article>
          <article class="autor-vol"><span class="mono">Livro II</span><h3>O Que a Água Carrega</h3><p>A água não apenas guarda.</p><p>Ela leva.</p><p>Memórias, escolhas e consequências seguem o curso até lugares que ninguém previa.</p></article>
          <article class="autor-vol"><span class="mono">Livro III</span><h3>O Que o Nome Preserva</h3><p>Se memórias podem falhar e histórias podem ser reescritas, o que ainda mantém alguém sendo quem é?</p><p>Talvez o nome.</p></article>
        </div>
        <p class="autor-note">Livro I disponível em inglês como <em>What the River Forgot</em>.</p>
      </div>
    </section>

    <section class="autor-creme" id="duas-irmas">
      <div class="autor-wrap">
        <div class="autor-creme__top">
          <img class="autor-creme__capa" src="/autor/duas-irmas-capa.jpg" alt="Capa de Duas Irmãs e Oito Patas: Kayla, Kamila, Max e Pandora" width="636" height="900" loading="lazy" />
        </div>
        <div class="autor-narrow">
          <span class="kicker">Literatura infantil</span>
          <h2>Duas Irmãs e Oito Patas</h2>
          <p class="autor-cite">Algumas aventuras começam debaixo da cama.</p>
          <p>Esta nasceu em casa.</p>
          <p>É uma série infantil escrita para minhas filhas, Kayla e Kamila, protagonizada por elas e pelos nossos cães, Max e Pandora.</p>
          <p>Duas irmãs.</p><p>Dois cães.</p><p>Oito patas.</p>
          <p>Aqui não existe Arquivo, sinal vindo do espaço ou rio de mil anos.</p>
          <p>Existe uma casa.</p><p>Um quintal.</p><p>Objetos esquecidos.</p>
          <p>E aquela certeza que as crianças têm de que qualquer coisa pode esconder uma aventura.</p>
          <h3>Livro 1 · O Mapa Debaixo da Cama</h3>
          <p>Um mapa aparece debaixo da cama.</p>
          <p>Para Kayla, isso basta.</p>
          <p>Não é papel velho.</p>
          <p>É uma pista.</p>
          <p>A casa muda de tamanho. O quintal ganha territórios. Max e Pandora entram na investigação. Kamila, ainda bebê, participa do jeito dela.</p>
          <p>No fim da trilha, o tesouro não é ouro.</p>
          <p>É uma lembrança da infância do pai, guardada durante anos esperando alguém encontrá-la.</p>
          <p>A série cresce junto com as meninas.</p>
          <p>Cada livro acompanha uma nova fase.</p>
          <p><strong>Livro 1 disponível na Amazon.</strong></p>
          <div class="autor-buy">${amazon}<span class="autor-buy__label">Conhecer Duas Irmãs e Oito Patas</span></div>
        </div>
        <div class="autor-faixa">
          <img src="/autor/ilustracao-cama.jpg" alt="Ilustração: Kayla na cama com o mapa, a bebê e o cachorro" width="625" height="1000" loading="lazy" />
          <img src="/autor/ilustracao-quintal.jpg" alt="Ilustração: Kayla no quintal segurando o mapa" width="625" height="1000" loading="lazy" />
        </div>
        <div class="autor-fichas">
          ${ficha("ficha-kayla", "Kayla", "Ficha de personagem: Kayla em pé")}
          ${ficha("ficha-kamila", "Kamila", "Ficha de personagem: Kamila na almofada")}
          ${ficha("ficha-pandora", "Pandora", "Ficha de personagem: Pandora")}
          ${ficha("ficha-max", "Max", "Ficha de personagem: Max")}
        </div>
      </div>
    </section>

    <section class="autor-sec autor-sec--alt">
      <div class="autor-narrow">
        <span class="kicker">Antes das palavras, o lápis</span>
        <p>Desenho desde muito antes de escrever meu primeiro livro.</p>
        <p>Retratos. Animais. Personagens. Lugares.</p>
        <p>Uma árvore agarrada a uma ilha flutuante.</p>
        <p>Um rosto que ainda não tinha nome.</p>
        <p>A cara de uma cocker que eu conhecia de cor.</p>
        <p>Às vezes o desenho vira história.</p>
        <p>Outras vezes, é a história que precisa do desenho para eu descobrir como ela é.</p>
        <p>Também componho.</p>
        <p>Talvez seja tudo parte da mesma coisa: encontrar uma forma de transformar algo que existe na cabeça em alguma coisa que outra pessoa possa ver, ouvir ou imaginar.</p>
      </div>
    </section>

    <section class="autor-sec">
      <div class="autor-narrow">
        <span class="kicker">Como eu escrevo</span>
          <p>Sempre me interessei por sistemas.</p>
          <p>Regras, padrões, estruturas que deveriam funcionar de determinado modo.</p>
          <p>Principalmente quando funcionam exatamente como deveriam e, ainda assim, alguma coisa dá errado.</p>
          <p>Essa pergunta aparece de formas diferentes no que escrevo:</p>
          <p class="autor-cite">o que acontece quando o sistema funciona perfeitamente, mas o resultado está errado?</p>
          <p>Em SINAL/RUÍDO, existe informação de sobra e nenhuma garantia de significado.</p>
          <p>Nas Crônicas Cosmológicas, os registros podem estar corretos e ainda assim descrever uma realidade impossível.</p>
          <p>Em VALANDOR, conhecer as regras de um poder não diz quando ele deve ser usado.</p>
          <p>Mas não começo pelas regras.</p>
          <p>Começo procurando alguém que será atingido por elas.</p>
          <p>O mistério precisa ser compreensível, mas não precisa desaparecer.</p>
          <p>Uma resposta pode esclarecer alguma coisa sem transformar o desconhecido num manual de instruções.</p>
          <p>E personagem não existe para explicar o mundo ao leitor.</p>
          <p>Precisa querer alguma coisa. Errar. Ter medo. Proteger alguém. Fazer perguntas inconvenientes. Rir na hora errada.</p>
          <p>É por isso que consigo escrever sobre um sinal vindo do espaço, um mundo de fantasia e duas meninas seguindo um mapa pelo quintal sem considerar essas histórias incompatíveis.</p>
          <p>A escala muda.</p>
          <p class="autor-cite autor-cite--accent">A pessoa no centro, não.</p>
      </div>
    </section>

    <section class="autor-sec autor-sec--alt">
      <div class="autor-narrow">
        <span class="kicker">Livros</span>
        <ul class="autor-status">
          <li><strong>SINAL/RUÍDO:</strong> publicado. <a href="/livros/sinal-ruido/">Ver o livro</a></li>
          <li><strong>VALANDOR · O Que o Rio Esqueceu:</strong> edição em inglês disponível como <em>What the River Forgot</em>. Nova edição em português em desenvolvimento.</li>
          <li><strong>Duas Irmãs e Oito Patas · O Mapa Debaixo da Cama:</strong> publicado. <a href="${AMAZON_DUAS_IRMAS}" target="_blank" rel="noopener">Comprar na Amazon</a></li>
          <li><strong>Crônicas Cosmológicas:</strong> coleção em desenvolvimento. O Livro I, <a href="/livros/os-deuses-nao-tem-filhos/">Os Deuses Não Têm Filhos</a>, já está à venda.</li>
        </ul>
        <p><a class="btn btn--primary" href="/#livros">Ver todos os livros</a> <a class="btn" href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Instagram</a> <a class="btn" href="${AMAZON_AUTHOR_PAGE}" target="_blank" rel="noopener">Página do autor na Amazon</a> <a class="btn" href="/imprensa/">Imprensa</a></p>
      </div>
    </section>`;
  write("/autor", page({
    title: "Alex Jr. Kich",
    description: "Alex Jr. Kich, escritor, artista e criador de mundos. Autor de SINAL/RUÍDO, das Crônicas Cosmológicas, de VALANDOR e de Duas Irmãs e Oito Patas.",
    path: "/autor/",
    bodyHtml: body,
    ogImage: "/autor/retrato.jpg",
    alternates: ptEnAlternates("/autor/", "/en/author/"),
    langSwitch: "/en/author/",
    extraHead: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" />`,
  }));
}

// /en/author — English translation of /autor/. Same images and structure; links point to /en/*
// where an English page exists, otherwise fall back to in-page anchors (VALANDOR, Duas Irmãs).
function enAuthorPage() {
  const cronicas = books.filter((b) => b.kind === "Crônicas Cosmológicas");
  const cards = cronicas.map((b) => `
        <a class="autor-cron" href="/en/chronicles/${b.slug}/">
          <img src="/livros/thumbs/${b.slug}.jpg" alt="Cover of ${escapeHtml(b.titleEn || b.title)}" width="360" height="575" loading="lazy" />
          <span class="autor-cron__num">${escapeHtml(b.numeral)}</span>
          <strong>${escapeHtml(b.titleEn || b.title)}</strong>
        </a>`).join("");
  const ficha = (img, nome, alt) => `<figure class="autor-ficha"><img src="/autor/${img}.jpg" alt="${alt}" loading="lazy" /><figcaption>${nome}</figcaption></figure>`;
  const lines = (arr) => arr.map((t) => `<p class="autor-line">${t}</p>`).join("");

  const body = `
    <section class="autor-hero">
      <div class="autor-hero__text">
        <h1>Alex Jr. Kich</h1>
        <p class="autor-hero__lead">Writer, artist and worldbuilder.</p>
        <p>I live in Rio Grande do Sul, Brazil. I draw, compose and write stories on very different scales: some look up at the sky, others build entire worlds, others fit under a bed.</p>
        <p>But the rule is always the same:</p>
        <p class="autor-cite">The concept can be enormous, but the conflict has to stay human.</p>
        <p><a class="btn btn--primary" href="/en/#books">Explore the books</a></p>
      </div>
      <div class="autor-hero__photo"><img src="/autor/retrato.jpg" alt="Portrait of Alex Jr. Kich, hands clasped, looking to the side" width="1149" height="1368" loading="lazy" /></div>
    </section>

    <section class="autor-sec autor-sobre">
      <div class="autor-narrow">
        <span class="kicker">About me</span>
        <h2>I like stories that start small.</h2>
        ${lines(["A photograph.", "An absence.", "A child who knows something she shouldn't.", "A signal.", "A river.", "A map forgotten under a bed."])}
        <p>From there, the story can grow as much as it needs to. It can reach Neptune, travel through time, or invent an entire world.</p>
        <p>But someone has to stay at the center, trying to understand what's happening.</p>
        <p>A star that disappears is a phenomenon.</p>
        <p class="autor-cite">A mother who realizes the whole world forgot her son ever existed — that's a story.</p>
        <p class="autor-cite autor-cite--accent">That's the difference I look for.</p>
      </div>
    </section>

    <section class="autor-sec autor-sec--alt" id="por-onde-comecar">
      <div class="autor-wrap">
        <div class="autor-center"><span class="kicker">Where to start</span><h2>You don't need to know everything to step in.</h2></div>
        <div class="autor-start">
          <article>
            <a class="autor-start__cover" href="/en/signal-noise/"><img src="/livro/capa-en.jpg" alt="Cover of SIGNAL/NOISE" width="400" height="600" loading="lazy" /></a>
            <span class="mono autor-start__kicker">Science fiction</span><h3>SIGNAL/NOISE</h3>
            <p>A real signal captured in 1977. A question that never went away.</p>
            <a class="btn" href="/en/signal-noise/">Discover SIGNAL/NOISE</a>
          </article>
          <article>
            <a class="autor-start__cover" href="/en/chronicles/"><img src="/autor/cronicas-cosmologicas-capa.png" alt="Cover of the Cosmological Chronicles collection" width="1024" height="1536" loading="lazy" /></a>
            <span class="mono autor-start__kicker">Cosmological mystery</span><h3>Cosmological Chronicles</h3>
            <p>Ten independent stories linked by something that records people, events, and even versions of reality that may never have existed.</p>
            <a class="btn" href="/en/chronicles/">Explore the Chronicles</a>
          </article>
          <article>
            <a class="autor-start__typo" href="#valandor"><span>V</span><em>VALANDOR</em></a>
            <span class="mono autor-start__kicker">Fantasy</span><h3>VALANDOR</h3>
            <p>A world where rivers remember, and where having power never answers the harder question: what for?</p>
            <a class="btn" href="#valandor">Enter VALANDOR</a>
          </article>
          <article>
            <a class="autor-start__cover" href="#duas-irmas"><img src="/autor/duas-irmas-capa.jpg" alt="Cover of Two Sisters and Eight Paws" width="636" height="900" loading="lazy" /></a>
            <span class="mono autor-start__kicker">Children's literature</span><h3>Two Sisters and Eight Paws</h3>
            <p>Two girls, two dogs, and the suspicion that an ordinary house might hide far more than it seems.</p>
            <a class="btn" href="#duas-irmas">Meet the series</a>
          </article>
        </div>
      </div>
    </section>

    <section class="autor-sec autor-sr">
      <div class="autor-wrap autor-split autor-split--cover">
        <div>
          <span class="kicker">Novel · Origin work</span>
          <h2>SIGNAL/NOISE</h2>
          <p class="autor-cite">What if the most important signal had already arrived?</p>
          <p>On August 15, 1977, the Big Ear radio telescope in Ohio picked up, for 72 seconds, a signal too strong to be noise.</p>
          <p>An astronomer circled the printout and wrote next to it:</p>
          <p class="autor-cite autor-cite--accent">Wow!</p>
          <p>The signal never repeated.</p>
          <p>SIGNAL/NOISE begins with that real event.</p>
          <p>Henrique, Marina and Lara follow traces that tie that signal to things too close to home: incomplete records, coincidences that keep coming back, a gate, a disappearance.</p>
          <p>The problem starts scientific.</p>
          <p>Then it stops being one.</p>
          <p>The question is no longer just who sent the signal.</p>
          <p>It's another one:</p>
          <p class="autor-cite">how do we know something is, in fact, a message?</p>
          <p>Maybe we've spent too much time looking for answers that resemble us.</p>
          <p class="mono autor-note">Standalone novel and origin work of the Cosmological Chronicles universe.</p>
          <p><a class="btn btn--primary" href="/en/signal-noise/">Discover SIGNAL/NOISE</a></p>
        </div>
        <div class="autor-cover"><img src="/livro/capa-en.jpg" alt="Cover of SIGNAL/NOISE" width="400" height="600" loading="lazy" /></div>
      </div>
    </section>

    <section class="autor-sec autor-cron-sec" id="cronicas-autor">
      <div class="autor-wrap">
        <div class="autor-center">
          <span class="kicker">Cosmological Chronicles</span>
          <h2>Ten stories. One Archive. No complete answer.</h2>
          <p>After SIGNAL/NOISE, the universe opens up.</p>
          <p>Ten novels, each with its own protagonists, eras and conflicts. You can start with any of them.</p>
          <p>Underneath all of them, though, there's something.</p>
          <p>The Archive.</p>
          <p>It records people, events, and versions of what could have been.</p>
          <p>Sometimes it knows too much. Sometimes it forgets.</p>
          <p>And every so often, it holds things that shouldn't exist yet.</p>
        </div>
        <div class="autor-cron-grid">${cards}
        </div>
        <p class="autor-center autor-note">No single volume explains the whole Archive. On purpose.</p>
        <p class="autor-center"><a class="btn btn--primary" href="/en/chronicles/">Explore the Cosmological Chronicles</a></p>
      </div>
    </section>

    <section class="autor-sec" id="valandor">
      <div class="autor-wrap">
        <div class="autor-narrow" style="margin:0">
          <span class="kicker">Fantasy</span>
          <h2>VALANDOR</h2>
          <p class="autor-cite">A world where rivers remember.</p>
          <p>VALANDOR started as one story and grew into peoples, maps, a past, a mythology and rules of its own.</p>
          <p>At its center is Kayla, who carries the Gift.</p>
          <p>But having power doesn't answer the harder question:</p>
          <p class="autor-cite">even if you can, should you?</p>
          <p>A river able to hold memories is an idea.</p>
          <p>It becomes a story when a girl discovers that river is holding something about her own family.</p>
        </div>
        <div class="autor-vol-grid">
          <article class="autor-vol autor-vol--main"><span class="mono">Book I</span><h3>What the River Forgot</h3><p>In Kayla's family, everyone confuses protection with silence.</p><p>What no one told her stayed buried somewhere.</p><p>And the Orasûn river remembers.</p><p>Alongside Aelora, Kayla follows the river's course to where family stories survive precisely because no one thought to look for them there.</p><p>Except memory isn't the same thing as the whole truth.</p><p>And the Gift doesn't decide for her what to do with what she finds.</p></article>
          <article class="autor-vol"><span class="mono">Book II</span><h3>What the Water Carries</h3><p>Water doesn't just hold.</p><p>It carries.</p><p>Memories, choices and consequences follow its course to places no one expected.</p></article>
          <article class="autor-vol"><span class="mono">Book III</span><h3>What the Name Preserves</h3><p>If memories can fail and stories can be rewritten, what still keeps someone who they are?</p><p>Maybe the name.</p></article>
        </div>
        <p class="autor-note">Book I is available in English as <em>What the River Forgot</em>.</p>
      </div>
    </section>

    <section class="autor-creme" id="duas-irmas">
      <div class="autor-wrap">
        <div class="autor-creme__top">
          <img class="autor-creme__capa" src="/autor/duas-irmas-capa.jpg" alt="Cover of Two Sisters and Eight Paws: Kayla, Kamila, Max and Pandora" width="636" height="900" loading="lazy" />
        </div>
        <div class="autor-narrow">
          <span class="kicker">Children's literature</span>
          <h2>Two Sisters and Eight Paws</h2>
          <p class="autor-cite">Some adventures start under the bed.</p>
          <p>This one was born at home.</p>
          <p>It's a children's series written for my daughters, Kayla and Kamila, starring them and our dogs, Max and Pandora.</p>
          <p>Two sisters.</p><p>Two dogs.</p><p>Eight paws.</p>
          <p>There's no Archive here, no signal from space, no thousand-year-old river.</p>
          <p>There's a house.</p><p>A backyard.</p><p>Forgotten objects.</p>
          <p>And that certainty children have that anything might be hiding an adventure.</p>
          <h3>Book 1 · The Map Under the Bed</h3>
          <p>A map turns up under the bed.</p>
          <p>For Kayla, that's enough.</p>
          <p>It isn't old paper.</p>
          <p>It's a clue.</p>
          <p>The house changes size. The backyard gains territories. Max and Pandora join the investigation. Kamila, still a baby, takes part in her own way.</p>
          <p>At the end of the trail, the treasure isn't gold.</p>
          <p>It's a memory from their father's childhood, kept for years, waiting for someone to find it.</p>
          <p>The series grows along with the girls.</p>
          <p>Each book follows a new stage.</p>
          <p><strong>Book 1 is currently available in Portuguese, with an English edition planned.</strong></p>
        </div>
        <div class="autor-faixa">
          <img src="/autor/ilustracao-cama.jpg" alt="Illustration: Kayla in bed with the map, the baby and the dog" width="625" height="1000" loading="lazy" />
          <img src="/autor/ilustracao-quintal.jpg" alt="Illustration: Kayla in the backyard holding the map" width="625" height="1000" loading="lazy" />
        </div>
        <div class="autor-fichas">
          ${ficha("ficha-kayla", "Kayla", "Character sheet: Kayla standing")}
          ${ficha("ficha-kamila", "Kamila", "Character sheet: Kamila on a pillow")}
          ${ficha("ficha-pandora", "Pandora", "Character sheet: Pandora")}
          ${ficha("ficha-max", "Max", "Character sheet: Max")}
        </div>
      </div>
    </section>

    <section class="autor-sec autor-sec--alt">
      <div class="autor-narrow">
        <span class="kicker">Before the words, the pencil</span>
        <p>I've been drawing since long before I wrote my first book.</p>
        <p>Portraits. Animals. Characters. Places.</p>
        <p>A tree clinging to a floating island.</p>
        <p>A face that didn't have a name yet.</p>
        <p>The face of a cocker spaniel I knew by heart.</p>
        <p>Sometimes the drawing becomes a story.</p>
        <p>Other times, it's the story that needs the drawing for me to figure out what it looks like.</p>
        <p>I also compose music.</p>
        <p>Maybe it's all part of the same thing: finding a way to turn something that exists in my head into something someone else can see, hear or imagine.</p>
      </div>
    </section>

    <section class="autor-sec">
      <div class="autor-narrow">
        <span class="kicker">How I write</span>
          <p>I've always been interested in systems.</p>
          <p>Rules, patterns, structures that should work a certain way.</p>
          <p>Especially when they work exactly as they should, and something still goes wrong.</p>
          <p>That question shows up in different forms in what I write:</p>
          <p class="autor-cite">what happens when the system works perfectly and the result is still wrong?</p>
          <p>In SIGNAL/NOISE, there's information to spare and no guarantee of meaning.</p>
          <p>In the Cosmological Chronicles, the records can be correct and still describe an impossible reality.</p>
          <p>In VALANDOR, knowing the rules of a power doesn't tell you when it should be used.</p>
          <p>But I don't start with the rules.</p>
          <p>I start by looking for someone who will be hit by them.</p>
          <p>The mystery needs to be understandable, but it doesn't need to disappear.</p>
          <p>An answer can clarify something without turning the unknown into an instruction manual.</p>
          <p>And a character doesn't exist to explain the world to the reader.</p>
          <p>They need to want something. Make mistakes. Be afraid. Protect someone. Ask inconvenient questions. Laugh at the wrong moment.</p>
          <p>That's why I can write about a signal from space, a fantasy world, and two girls following a map through the backyard without considering these stories incompatible.</p>
          <p>The scale changes.</p>
          <p class="autor-cite autor-cite--accent">The person at the center doesn't.</p>
      </div>
    </section>

    <section class="autor-sec autor-sec--alt">
      <div class="autor-narrow">
        <span class="kicker">Books</span>
        <ul class="autor-status">
          <li><strong>SIGNAL/NOISE:</strong> published. <a href="/en/signal-noise/">See the book</a></li>
          <li><strong>VALANDOR · What the River Forgot:</strong> Book I available in English. New Portuguese edition in progress.</li>
          <li><strong>Two Sisters and Eight Paws · The Map Under the Bed:</strong> published in Portuguese; English edition planned.</li>
          <li><strong>Cosmological Chronicles:</strong> collection in progress. Book I, <a href="/en/chronicles/os-deuses-nao-tem-filhos/">The Gods Have No Children</a>, is already available.</li>
        </ul>
        <p><a class="btn btn--primary" href="/en/chronicles/">See all the books</a> <a class="btn" href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Instagram</a> <a class="btn" href="${AMAZON_AUTHOR_PAGE}" target="_blank" rel="noopener">Amazon author page</a> <a class="btn" href="/buy/">Get the book</a></p>
      </div>
    </section>`;
  write("/en/author", page({
    title: "Alex Jr. Kich",
    description: "Alex Jr. Kich, writer, artist and worldbuilder. Author of SIGNAL/NOISE, the Cosmological Chronicles, VALANDOR and Two Sisters and Eight Paws.",
    path: "/en/author/",
    bodyHtml: body,
    ogImage: "/autor/retrato.jpg",
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/autor/", "/en/author/"),
    langSwitch: "/autor/",
    extraHead: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" />`,
  }));
}

function imprensaPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Press kit</span>
      <h1 style="margin-top:12px">SINAL/RUÍDO para imprensa, podcasts e parceiros editoriais.</h1>
      <p style="margin-top:8px;color:var(--muted)">Materiais públicos do projeto. A área factual e o romance são apresentados separadamente para evitar que elementos narrativos sejam confundidos com documentação.</p>

      <div class="grid grid--2" style="margin-top:28px">
        <div class="paper" style="padding:24px"><span class="kicker">Projeto WEB</span><h2 style="margin-top:10px">Arquivo instrumental brasileiro</h2><p style="margin-top:8px">Arquivo público de origem brasileira e escopo internacional que organiza casos, documentos, mídia e hipóteses com proveniência e revisão explícitas.</p></div>
        <div class="paper" style="padding:24px"><span class="kicker">Livro</span><h2 style="margin-top:10px">SINAL/RUÍDO</h2><p style="margin-top:8px">Romance adulto de ficção científica e investigação. Autor exibido editorialmente: Alex Jr. Kich.</p></div>
      </div>

      <div class="paper" style="margin-top:24px;padding:24px">
        <h2>Sobre o autor</h2>
        <h3 style="margin-top:14px">Bio curta</h3>
        <p style="margin-top:6px">Alex Jr. Kich é escritor e artista no Rio Grande do Sul. Desenha, compõe e escreve ficção científica, fantasia e literatura infantil. É autor de SINAL/RUÍDO, do universo VALANDOR e de Duas Irmãs e Oito Patas, série escrita para as filhas.</p>
        <h3 style="margin-top:14px">Bio longa</h3>
        <p style="margin-top:6px">Alex Jr. Kich é escritor, artista e criador de mundos. É autor de SINAL/RUÍDO, romance que parte do sinal Wow!, de 1977, e origem das Crônicas Cosmológicas, coleção de dez romances ligados pelo mistério do Arquivo. Criou VALANDOR, trilogia de fantasia cujo primeiro volume, O Que o Rio Esqueceu, já tem edição em inglês. Na literatura infantil, escreve Duas Irmãs e Oito Patas, protagonizada pelas filhas e pelos cães da família, cujo Livro 1, O Mapa Debaixo da Cama, já está à venda na Amazon. Também desenha e compõe. Sua regra de trabalho cabe numa frase: o conceito pode ser enorme, mas o conflito precisa continuar humano.</p>
        <h3 style="margin-top:14px">Publicações</h3>
        <ul style="margin-top:6px;padding-left:18px">
          <li><a href="/livros/sinal-ruido/">SINAL/RUÍDO</a>: publicado.</li>
          <li><a href="/livros/os-deuses-nao-tem-filhos/">Crônicas Cosmológicas I · Os Deuses Não Têm Filhos</a>: à venda na Amazon.</li>
          <li>Duas Irmãs e Oito Patas, Livro 1 · O Mapa Debaixo da Cama: <a href="https://www.amazon.com.br/dp/B0HGMMSBSX" target="_blank" rel="noopener">à venda na Amazon</a>.</li>
          <li>VALANDOR I · O Que o Rio Esqueceu: edição em inglês na Amazon; nova edição em português em breve.</li>
        </ul>
      </div>

      <div class="paper" style="margin-top:24px;padding:24px">
        <h2>Imagens para imprensa</h2>
        <p style="margin-top:8px">Uso editorial com crédito ao autor. <a href="/autor/">Página do autor</a> para o contexto completo.</p>
        <p style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
          <a class="btn" href="/autor/retrato.jpg" download>Retrato do autor</a>
          <a class="btn" href="/livro/capa.jpg" download>Capa · SINAL/RUÍDO</a>
          <a class="btn" href="/autor/duas-irmas-capa.jpg" download>Capa · Duas Irmãs e Oito Patas</a>
        </p>
        <p class="mono" style="margin-top:12px;color:var(--paper-muted)">SEM FORMULÁRIO · SEM CAPTAÇÃO DE DADOS</p>
      </div>
    </section>`;
  write("/imprensa", page({
    title: "Imprensa",
    description: "Press kit público do projeto SINAL/RUÍDO e do romance relacionado.",
    path: "/imprensa/",
    bodyHtml: body,
    alternates: ptEnAlternates("/imprensa/", "/en/press/"),
    langSwitch: "/en/press/",
  }));
}

function enImprensaPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Press kit</span>
      <h1 style="margin-top:12px">SIGNAL/NOISE for press, podcasts and editorial partners.</h1>
      <p style="margin-top:8px;color:var(--muted)">Public project materials. The factual archive and the novel are presented separately so narrative elements are never mistaken for documentation.</p>

      <div class="grid grid--2" style="margin-top:28px">
        <div class="paper" style="padding:24px"><span class="kicker">WEB project</span><h2 style="margin-top:10px">Brazilian instrumental archive</h2><p style="margin-top:8px">A public archive of Brazilian origin and international scope, organizing cases, documents, media and hypotheses with explicit provenance and review.</p></div>
        <div class="paper" style="padding:24px"><span class="kicker">Book</span><h2 style="margin-top:10px">SIGNAL/NOISE</h2><p style="margin-top:8px">Adult science fiction and investigation novel. Author credited editorially: Alex Jr. Kich.</p></div>
      </div>

      <div class="paper" style="margin-top:24px;padding:24px">
        <h2>About the author</h2>
        <h3 style="margin-top:14px">Short bio</h3>
        <p style="margin-top:6px">Alex Jr. Kich is a writer and artist based in Rio Grande do Sul, Brazil. He draws, composes and writes science fiction, fantasy and children's literature. He is the author of SIGNAL/NOISE, of the VALANDOR universe, and of Two Sisters and Eight Paws, a series written for his daughters.</p>
        <h3 style="margin-top:14px">Long bio</h3>
        <p style="margin-top:6px">Alex Jr. Kich is a writer, artist and worldbuilder. He is the author of SIGNAL/NOISE, a novel that starts from the 1977 Wow! signal and is the origin work of the Cosmological Chronicles, a collection of ten novels linked by the mystery of the Archive. He created VALANDOR, a fantasy trilogy whose first volume, What the River Forgot, already has an English edition. In children's literature, he writes Two Sisters and Eight Paws, starring his daughters and the family's dogs, whose Book 1, The Map Under the Bed, is already for sale on Amazon. He also draws and composes music. His working rule fits in one sentence: the concept can be enormous, but the conflict has to stay human.</p>
        <h3 style="margin-top:14px">Publications</h3>
        <ul style="margin-top:6px;padding-left:18px">
          <li><a href="/en/signal-noise/">SIGNAL/NOISE</a>: published.</li>
          <li><a href="/en/chronicles/os-deuses-nao-tem-filhos/">Cosmological Chronicles I · The Gods Have No Children</a>: for sale on Amazon.</li>
          <li>Two Sisters and Eight Paws, Book 1 · The Map Under the Bed: <a href="https://www.amazon.com.br/dp/B0HGMMSBSX" target="_blank" rel="noopener">for sale on Amazon</a> (Portuguese edition; English edition planned).</li>
          <li>VALANDOR I · What the River Forgot: English edition on Amazon; new Portuguese edition coming soon.</li>
        </ul>
      </div>

      <div class="paper" style="margin-top:24px;padding:24px">
        <h2>Images for press</h2>
        <p style="margin-top:8px">Editorial use with credit to the author. <a href="/en/author/">Author page</a> for full context.</p>
        <p style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
          <a class="btn" href="/autor/retrato.jpg" download>Author portrait</a>
          <a class="btn" href="/livro/capa-en.jpg" download>Cover · SIGNAL/NOISE</a>
          <a class="btn" href="/autor/duas-irmas-capa.jpg" download>Cover · Two Sisters and Eight Paws</a>
        </p>
        <p class="mono" style="margin-top:12px;color:var(--paper-muted)">NO FORM · NO DATA COLLECTION</p>
      </div>
    </section>`;
  write("/en/press", page({
    title: "Press",
    description: "Public press kit for the SIGNAL/NOISE project and the related novel.",
    path: "/en/press/",
    bodyHtml: body,
    lang: "en", ogLocale: "en_US", minimal: true,
    alternates: ptEnAlternates("/imprensa/", "/en/press/"),
    langSwitch: "/imprensa/",
  }));
}

// ---------------------------------------------------------------------
// search index
// ---------------------------------------------------------------------
function buildSearchIndex() {
  const items = [
    ...cases.map((c) => ({ type: "caso", title: c.title, url: `/casos/${c.slug}/`, tags: [c.location, c.code] })),
    ...documents.map((d) => ({ type: "documento", title: d.titulo, url: `/documentos/${d.slug}/`, tags: [d.origem, d.caseTitle, d.tipo] })),
    ...collections.map((c) => ({ type: "coleção", title: c.name, url: `/colecoes/${c.slug}/`, tags: [c.institution, c.country] })),
    ...media.map((m) => ({ type: "mídia", title: m.titulo, url: `/midia/${m.slug}/`, tags: [m.caseTitle, m.tipo] })),
    ...books.filter((b) => b.featured).map((b) => ({ type: "livro", title: b.title, url: "/livro/", tags: [b.kind, b.status] })),
  ];
  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(join(root, "public/search-index.json"), JSON.stringify(items));
}

// ---------------------------------------------------------------------
// SEO / deploy: robots.txt, sitemap.xml, _headers
// ---------------------------------------------------------------------
function buildSeoFiles() {
  // Rotas de campanha são redirects. A amostra literária permanece fora do sitemap
  // enquanto o texto final não tiver sido inserido e homologado.
  const canonicalRoutes = routes.filter((r) => !r.startsWith("/r/") && !r.startsWith("/cortesia/") && r !== "/livro/amostra/" && r !== "/buy/" && r !== "/livros/");
  const urlset = canonicalRoutes
    .map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`)
    .join("\n");
  writeStatic("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`);

  writeStatic("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  writeStatic("_headers", `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: geolocation=(), microphone=(), camera=()\n\n/cortesia/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  Cache-Control: private, no-store\n`);

  // Regras para Cloudflare Pages. As campanhas mantêm os links permanentes
  // impressos/divulgados.
  writeStatic("_redirects", `# Cloudflare Pages redirects\n/r/livro            /leitores/?campanha=livro            301\n/r/bunkerx          /leitores/?campanha=bunkerx          301\n/r/cienciatododia   /leitores/?campanha=cienciatododia   301\n/r/spacetoday       /leitores/?campanha=spacetoday       301\n`);
}

// ---------------------------------------------------------------------
// run
// ---------------------------------------------------------------------
["arquivo", "casos", "documentos", "colecoes", "midia", "noticias", "metodo", "correcoes", "livro", "livros", "leitores", "imprensa", "privacidade", "r", "explorar", "brinde", "buy", "en", "autor"].forEach(clean);

validateI18n();
homePage();
arquivoPage();
enArquivoPage();
casosPage();
cases.forEach(caseDossierPage);
casesEn.forEach(enCaseDossierPage);
documentosPage();
documents.forEach(documentoDetailPage);
colecoesPage();
collections.forEach(colecaoDetailPage);
midiaPage();
media.forEach(midiaDetailPage);
noticiasPage();
enNoticiasPage();
metodoPage();
enMetodoPage();
correcoesPage();
enCorrecoesPage();
livroPage();
livroAmostraPage();
livroSampleEnPage();
livrosPage();
cortesiaPage();
const sheetReady = (b) => Boolean((bookSheets[b.slug] || {}).synopsis);
const chroniclesPt = books.filter((b) => b.kind === "Crônicas Cosmológicas" && sheetReady(b));
chroniclesPt.forEach((b, _i, arr) => bookSheetPage(b, arr, "pt"));
const chroniclesEn = chroniclesPt.filter((b) => (bookSheetsEn[b.slug] || {}).synopsis);
chroniclesEn.forEach((b, _i, arr) => bookSheetPage(b, arr, "en"));
chroniclesEnPage(chroniclesPt);
enHomePage(chroniclesPt);
if ((bookSheetsEn["sinal-ruido"] || {}).synopsis) bookSheetPage(SINAL_RUIDO_ORIGIN, chroniclesEn, "en");
bookSheetPage(books.find((b) => b.slug === "sinal-ruido"), chroniclesPt, "pt");
leitoresPage();
enLeitoresPage();
imprensaPage();
enImprensaPage();
autorPage();
enAuthorPage();
privacidadePage();
enPrivacidadePage();
contatoPage();
enContatoPage();
buyPage();
notFoundPage();
["livro", "bunkerx", "cienciatododia", "spacetoday"].forEach(campanhaRedirect);
buildSearchIndex();
buildSeoFiles();

console.log(`Geradas ${routes.length} páginas (${routes.filter((r) => !r.startsWith("/r/")).length} canônicas + ${routes.filter((r) => r.startsWith("/r/")).length} redirects).`);
