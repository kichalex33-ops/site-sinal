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
function buyPanel(book) {
  const link = (url, format, store) => url ? `<a class="buy-link" href="${escapeHtml(url)}" target="_blank" rel="noopener"><span class="buy-link__format">${format}</span><span class="buy-link__store">${store}</span><span class="buy-link__arrow" aria-hidden="true">↗</span></a>` : "";
  const pt = [
    link(book.purchaseUrl, "Ebook", "Amazon Kindle"),
    link(book.purchaseUrlUiclap, "Impresso", "UICLAP"),
  ].join("");
  const en = [
    link(book.purchaseUrlEn, "Ebook", "Amazon US"),
    link(book.purchaseUrlEnBr, "Ebook", "Amazon BR"),
    link(book.purchaseUrlEnUk, "Paperback", "Amazon UK"),
  ].join("");
  return `<div class="buy-panel">
    ${pt ? `<div class="buy-group"><span class="buy-group__title">Português</span><div class="buy-group__links">${pt}</div></div>` : `<span class="btn btn--disabled" aria-disabled="true">Comprar · EM BREVE</span>`}
    ${en ? `<div class="buy-group"><span class="buy-group__title">English edition</span><div class="buy-group__links">${en}<a class="buy-link buy-link--sample" href="/livro/sample/"><span class="buy-link__format">Free</span><span class="buy-link__store">Read sample</span><span class="buy-link__arrow" aria-hidden="true">→</span></a></div></div>` : ""}
  </div>`;
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

  write(`/casos/${item.slug}`, page({
    title: item.title,
    description: item.resumo,
    path: `/casos/${item.slug}/`,
    bodyHtml: body,
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
          <div style="margin-top:20px"><a class="btn btn--primary" href="/livro/amostra/">Ler até 3 capítulos</a></div>
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
function livrosPage() {
  const featured = books.find((b) => b.featured) || books[0];
  const chronicles = books.filter((b) => b.kind === "Crônicas Cosmológicas");
  const others = books.filter((b) => !b.featured && b.kind !== "Crônicas Cosmológicas");
  const body = `
    <section class="section books-page" style="--books-art:url(/livros/ambiente.jpg)">
      <div class="container">
        <span class="kicker">Projeto literário</span>
        <h1 style="margin-top:12px">SINAL/RUÍDO · Livros</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:760px">A área literária reúne o romance principal e projetos narrativos associados. Tudo aqui é ficção e permanece separado do arquivo factual.</p>
        <p class="mono" style="margin-top:8px"><a href="/en/chronicles/" hreflang="en" style="color:var(--muted)">English version →</a></p>
        <div class="books-featured" style="margin-top:32px">
          <img src="${escapeHtml(featured.cover)}" alt="Capa de ${escapeHtml(featured.title)}" />
          <div><span class="badge" style="border-color:var(--signal);color:var(--signal)">${escapeHtml(featured.status)}</span><h2>${escapeHtml(featured.title)}</h2><p class="mono">${escapeHtml(featured.author)} · ${escapeHtml(featured.kind)}</p><p>${escapeHtml(featured.synopsis || featured.description)}</p><div class="books-actions"><a class="btn btn--primary" href="${escapeHtml(featured.sampleUrl)}">Ler os primeiros capítulos</a><a class="btn" href="${escapeHtml(featured.url)}">Conhecer o livro</a></div>
            <div class="support-home__qr"><img src="/apoio/pix-qr.jpg" alt="QR Code Pix para apoiar SINAL/RUÍDO" loading="lazy" /><div><span class="mono">PIX · APOIO À OBRA</span><button type="button" class="btn btn--primary" data-copy-pix>Copiar código Pix</button><span class="visually-hidden" data-pix-code>00020126330014br.gov.bcb.pix0111026387420665204000053039865802BR5916Alex Junior Kich6009Sao Paulo62290525REC6A982558C600D1848319096304DD3C</span></div></div>
          </div>
        </div>
        <section class="books-future" id="cronicas"><span class="kicker">Crônicas Cosmológicas · I–X</span><h2>Obras em desenvolvimento</h2><div class="books-grid books-grid--covers">${chronicles.map((b) => ((bookSheets[b.slug] || {}).synopsis ? `<a class="book-card book-card--cover" href="/livros/${b.slug}/"><img src="${escapeHtml(b.cover)}" alt="Capa de ${escapeHtml(b.title)}" loading="lazy" /><span class="mono">${escapeHtml(b.numeral)} · ${escapeHtml(b.status)}</span><h3>${escapeHtml(b.title)}</h3>${b.description ? `<p>${escapeHtml(b.description)}</p>` : ""}<span class="book-card__more mono">Sinopse e ficha →</span></a>` : `<article class="book-card book-card--cover"><img src="${escapeHtml(b.cover)}" alt="Capa de ${escapeHtml(b.title)}" loading="lazy" /><span class="mono">${escapeHtml(b.numeral)} · ${escapeHtml(b.status)}</span><h3>${escapeHtml(b.title)}</h3>${b.description ? `<p>${escapeHtml(b.description)}</p>` : ""}</article>`)).join("")}</div></section>
        ${others.length ? `<section class="books-future"><span class="kicker">Outro projeto literário</span><div class="books-grid">${others.map((b) => `<article class="book-card"><span class="mono">${escapeHtml(b.status)}</span><h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(b.description)}</p><small>${escapeHtml(b.kind)}</small></article>`).join("")}</div></section>` : ""}
      </div>
    </section>`;
  write("/livros", page({ title: "Livros", description: "Livros e projetos literários de SINAL/RUÍDO, claramente separados do arquivo factual.", path: "/livros/", bodyHtml: body, ogImage: "/livro/capa.jpg" }));
}

// ---------------------------------------------------------------------
// /privacidade
// ---------------------------------------------------------------------
// /livros/<slug> — pagina de cada livro das Cronicas: sinopse + ficha (dados em src/data/book-sheets.json)
// Seções da ficha que ficam nos dados mas não são exibidas: revelam ligações entre os livros
// (spoiler). Para exibir, remova o título da lista.
const HIDDEN_SECTIONS = new Set(["A face do Arquivo", "Lugar dentro da coleção"]);

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
function bookSheetPage(b, list, lang) {
  const ui = SHEET_UI[lang];
  const en = lang === "en";
  const isOrigin = b.slug === "sinal-ruido";
  const sh = (en ? bookSheetsEn : bookSheets)[b.slug] || {};
  const otherSheet = (en ? bookSheets : bookSheetsEn)[b.slug];
  const amb = sh.ambientacao || {};
  const paras = (t) => String(t || "").split(/\n\s*\n/).filter(Boolean).map((x) => `<p>${escapeHtml(x)}</p>`).join("");
  const synopsis = sh.synopsis || b.synopsis || "";
  const status = ui.statusMap[b.status] || b.status;
  const rows = [
    ...(isOrigin ? [["Type", "Origin work, outside the numbering of the Cosmological Chronicles"]] : [[ui.seriesLabel, ui.series], [ui.volume, b.numeral]]),
    [ui.author, b.author],
    [ui.status, status],
    ...(amb.epoca ? [[ui.epoch, amb.epoca]] : []),
    ...(amb.local ? [[ui.place, amb.local]] : []),
    ...(sh.ficha || []).map((f) => [f.label, f.value]),
  ].filter((r) => r[1]);
  const idx = list.findIndex((x) => x.slug === b.slug);
  const prev = list[idx - 1], next = isOrigin ? list[0] : list[idx + 1];
  const base = en ? "/en/chronicles/" : "/livros/";
  const path = isOrigin ? "/en/signal-noise/" : `${base}${b.slug}/`;
  const ptPath = isOrigin ? "/livro/" : `/livros/${b.slug}/`;
  const enPath = isOrigin ? "/en/signal-noise/" : `/en/chronicles/${b.slug}/`;
  const backHref = en ? "/en/chronicles/" : "/livros/#cronicas";
  const sections = (sh.secoes || []).filter((s) => !HIDDEN_SECTIONS.has(s.titulo));
  const badge = isOrigin ? "ORIGIN" : `${b.numeral} · ${status}`;
  const switchHref = en ? ptPath : enPath;
  const showSwitch = en || Boolean(otherSheet && (otherSheet.synopsis));
  const navLabel = (x) => (en && x.slug === "sinal-ruido" ? "SIGNAL/NOISE" : x.title);
  const body = `
    <section class="section book-sheet">
      <div class="container">
        <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <a href="${backHref}" class="mono" style="color:var(--muted)">${ui.back}</a>
          ${showSwitch ? `<a href="${switchHref}" class="mono" style="color:var(--muted)" hreflang="${en ? "pt-BR" : "en"}">${ui.switchLabel}</a>` : ""}
        </div>
        <div class="book-sheet__hero">
          <img class="book-sheet__cover" src="${escapeHtml(b.cover)}" alt="${en ? "Cover of" : "Capa de"} ${escapeHtml(b.title)}" width="450" height="720" />
          <div>
            <span class="badge" style="border-color:var(--signal);color:var(--signal)">${escapeHtml(badge)}</span>
            <h1 style="margin-top:12px">${escapeHtml(b.title)}</h1>
            <p class="mono" style="margin-top:8px;color:var(--signal)">${escapeHtml(b.author)}</p>
            ${sh.tagline ? `<p class="book-sheet__tagline" style="margin-top:14px;font-style:italic;color:var(--muted)">${escapeHtml(sh.tagline)}</p>` : ""}
            <div class="book-sheet__synopsis">${synopsis ? paras(synopsis) : `<p class="book-sheet__pending">${ui.synopsisSoon}</p>`}</div>
            ${isOrigin ? `<p style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="/livro/sample/">Read the sample</a><a class="btn" href="/buy/">Get the book</a></p>` : ""}
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
          ${prev ? `<a href="${base}${prev.slug}/"><span class="mono">← ${escapeHtml(prev.numeral)}</span><strong>${escapeHtml(prev.title)}</strong></a>` : "<span></span>"}
          ${next ? `<a href="${base}${next.slug}/" style="text-align:right"><span class="mono">${escapeHtml(next.numeral)} →</span><strong>${escapeHtml(navLabel(next))}</strong></a>` : "<span></span>"}
        </nav>
      </div>
    </section>`;
  const descr = synopsis ? synopsis.slice(0, 200) : en ? `${b.title}, volume ${b.numeral} of the Cosmological Chronicles, by ${b.author}.` : `${b.title}, volume ${b.numeral} das Crônicas Cosmológicas, de ${b.author}.`;
  const title = isOrigin ? "SIGNAL/NOISE · Origin" : `${b.title} · ${ui.chapterTitle}`;
  write(path.replace(/\/$/, ""), page({
    title, description: descr, path, bodyHtml: body, ogImage: b.cover,
    ...(en ? { lang: ui.lang, ogLocale: ui.ogLocale, minimal: true, robots: "noindex,follow" } : {}),
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
        <p class="mono" style="margin-top:8px"><a href="/livros/#cronicas" hreflang="pt-BR" style="color:var(--muted)">← Versão em português</a></p>

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
          <div class="books-grid books-grid--covers" style="margin-top:16px">${withEn.map((b) => `<a class="book-card book-card--cover" href="/en/chronicles/${b.slug}/"><img src="${escapeHtml(b.cover)}" alt="Cover of ${escapeHtml(b.title)}" loading="lazy" /><span class="mono">${escapeHtml(b.numeral)} · ${escapeHtml(status(b.status))}</span><h3>${escapeHtml(b.title)}</h3>${(bookSheetsEn[b.slug] || {}).tagline ? `<p>${escapeHtml(bookSheetsEn[b.slug].tagline)}</p>` : ""}<span class="book-card__more mono">Synopsis and details →</span></a>`).join("")}</div>
        </section>
      </div>
    </section>`;
  write("/en/chronicles", page({
    title: "The Cosmological Chronicles",
    description: "Ten stories, different people, different places, different times. One universe that never reveals itself completely.",
    path: "/en/chronicles/",
    bodyHtml: body,
    ogImage: "/livro/capa-en.jpg",
    lang: "en", ogLocale: "en_US", minimal: true, robots: "noindex,follow",
  }));
}



// /cortesia/<token> — pagina nao listada: so acessa quem tem o link (noindex, fora do menu, do sitemap e da busca)
const CORTESIA_TOKEN = "55okhxeexdf9m1";
function cortesiaPage() {
  const epubHref = `/cortesia/${CORTESIA_TOKEN}/SINAL_RUIDO_cortesia.epub`;
  const body = `
    <section class="section container--narrow courtesy">
      <span class="kicker">Cortesia do SINAL/RUÍDO</span>
      <h1 style="margin-top:12px">Este exemplar é seu.</h1>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">Você recebeu este link porque alguém quis que você lesse <strong>SINAL/RUÍDO</strong>. Baixe o ebook abaixo, sem custo. Esta página não é pública: ela não aparece no menu nem nas buscas.</p>

      <div class="courtesy__card">
        <img src="/livro/capa.jpg" alt="Capa de SINAL/RUÍDO" width="300" height="432" />
        <div>
          <span class="mono">EBOOK · EPUB · 494 KB</span>
          <h2>SINAL/RUÍDO</h2>
          <p class="mono" style="color:var(--signal)">Alex Jr. Kich</p>
          <a class="btn btn--primary" href="${epubHref}" download="SINAL_RUIDO_cortesia.epub" rel="noopener">Baixar EPUB</a>
        </div>
      </div>

      <section class="courtesy__help">
        <span class="kicker">Como ler</span>
        <ul>
          <li><strong>Celular ou tablet:</strong> abra o arquivo no Apple Livros (iPhone e iPad), Google Play Livros ou em outro leitor de EPUB.</li>
          <li><strong>Kindle:</strong> envie o arquivo pelo serviço Send to Kindle da Amazon.</li>
          <li><strong>Computador:</strong> use um leitor como o Calibre ou o próprio navegador, com uma extensão de EPUB.</li>
        </ul>
      </section>

      <p class="mono" style="margin-top:28px;color:var(--muted)">Gostou? Conheça <a href="/livro/">a página do livro</a>. Por favor, não divulgue este link publicamente.</p>
    </section>`;
  write(`/cortesia/${CORTESIA_TOKEN}`, page({ title: "Cortesia", description: "Página privada de cortesia do SINAL/RUÍDO.", path: `/cortesia/${CORTESIA_TOKEN}/`, bodyHtml: body, robots: "noindex,nofollow,noarchive", ogImage: "/livro/capa.jpg" }));
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
  write("/privacidade", page({ title: "Privacidade", description: "Política de privacidade do SINAL/RUÍDO: o site não coleta dados pessoais; publicação no Instagram pela API da Meta.", path: "/privacidade/", bodyHtml: body }));
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
  write("/contato", page({ title: "Contato", description: "Como falar com o autor e o projeto SINAL/RUÍDO: Instagram e página de imprensa.", path: "/contato/", bodyHtml: body }));
}

// ---------------------------------------------------------------------
// /brinde — porta de entrada pública para quem vem do Instagram (o bot do
// @sinal_ruido envia este link). Não é a /cortesia/, que é privada e noindex.
// Sem formulário e sem download de EPUB.
// ---------------------------------------------------------------------
function brindePage() {
  const book = books.find((b) => b.slug === "sinal-ruido") || books[0];
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Bem-vindo ao sinal</span>
      <h1 style="margin-top:12px">Obrigado por participar.</h1>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">Você chegou pelo Instagram do <strong>SINAL/RUÍDO</strong>, o romance de ${escapeHtml(book.author)}. Esta página é a porta de entrada: comece pela amostra gratuita ou conheça o livro e as Crônicas Cosmológicas.</p>

      <div class="grid grid--2" style="margin-top:28px">
        <div class="paper" style="padding:24px"><span class="kicker">Comece por aqui</span><h2 style="margin-top:10px">Leia a amostra</h2><p style="margin-top:8px">Os três primeiros capítulos, gratuitos, direto no navegador.</p><p style="margin-top:12px"><a class="btn btn--primary" href="/livro/amostra/">Ler a amostra</a></p></div>
        <div class="paper" style="padding:24px"><span class="kicker">O livro</span><h2 style="margin-top:10px">Conheça SINAL/RUÍDO</h2><p style="margin-top:8px">Sinopse e informações do romance.</p><p style="margin-top:12px"><a class="btn" href="/livro/">Conhecer o livro</a></p></div>
        <div class="paper" style="padding:24px"><span class="kicker">O universo</span><h2 style="margin-top:10px">Crônicas Cosmológicas</h2><p style="margin-top:8px">Os livros que compõem as Crônicas Cosmológicas.</p><p style="margin-top:12px"><a class="btn" href="/livros/#cronicas">Ver as Crônicas</a></p></div>
        <div class="paper" style="padding:24px"><span class="kicker">Instagram</span><h2 style="margin-top:10px">@sinal_ruido</h2><p style="margin-top:8px">Acompanhe o projeto e as novas publicações.</p><p style="margin-top:12px"><a class="btn" href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">Abrir o Instagram</a></p></div>
      </div>
    </section>

    <section class="section section--divider container--narrow">
      <span class="kicker">Onde comprar</span>
      <div style="margin-top:16px">${buyPanel(book)}</div>
    </section>`;
  write("/brinde", page({
    title: "Brinde",
    description: "Porta de entrada do SINAL/RUÍDO: leia a amostra gratuita, conheça o livro e as Crônicas Cosmológicas.",
    path: "/brinde/",
    bodyHtml: body,
    ogImage: "/livro/capa.jpg",
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
    const links = buyLinks(m.code).map((l) => `<a class="buy-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener"><span class="buy-link__format">${escapeHtml(l.label)}</span><span class="buy-link__store">Amazon ${escapeHtml(m.code)}</span><span class="buy-link__arrow" aria-hidden="true">↗</span></a>`).join("");
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
  write("/leitores", page({ title: "Leitores", description: "Página complementar para leitores do romance SINAL/RUÍDO.", path: "/leitores/", bodyHtml: body }));
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
  }));
}

// ---------------------------------------------------------------------
// /imprensa
// ---------------------------------------------------------------------
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

      <div class="paper" style="margin-top:24px;padding:24px"><h2>Materiais</h2><p style="margin-top:8px">A capa pública atual permanece disponível na área do livro. Bio final, ficha bibliográfica, ISBN, imagens autorizadas para imprensa e contato profissional devem ser homologados antes do lançamento.</p><p class="mono" style="margin-top:12px;color:var(--paper-muted)">SEM FORMULÁRIO · SEM CAPTAÇÃO DE DADOS PESSOAIS NESTA FASE</p></div>
    </section>`;
  write("/imprensa", page({
    title: "Imprensa",
    description: "Press kit público do projeto SINAL/RUÍDO e do romance relacionado.",
    path: "/imprensa/",
    bodyHtml: body,
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
  const canonicalRoutes = routes.filter((r) => !r.startsWith("/r/") && !r.startsWith("/cortesia/") && r !== "/livro/amostra/" && r !== "/buy/" && !r.startsWith("/en/"));
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
["arquivo", "casos", "documentos", "colecoes", "midia", "noticias", "metodo", "correcoes", "livro", "livros", "leitores", "imprensa", "privacidade", "r", "explorar", "brinde", "buy", "en"].forEach(clean);

validateI18n();
homePage();
arquivoPage();
casosPage();
cases.forEach(caseDossierPage);
documentosPage();
documents.forEach(documentoDetailPage);
colecoesPage();
collections.forEach(colecaoDetailPage);
midiaPage();
media.forEach(midiaDetailPage);
noticiasPage();
metodoPage();
correcoesPage();
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
if ((bookSheetsEn["sinal-ruido"] || {}).synopsis) bookSheetPage(SINAL_RUIDO_ORIGIN, chroniclesEn, "en");
leitoresPage();
imprensaPage();
privacidadePage();
contatoPage();
brindePage();
buyPage();
notFoundPage();
["livro", "bunkerx", "cienciatododia", "spacetoday"].forEach(campanhaRedirect);
buildSearchIndex();
buildSeoFiles();

console.log(`Geradas ${routes.length} páginas (${routes.filter((r) => !r.startsWith("/r/")).length} canônicas + ${routes.filter((r) => r.startsWith("/r/")).length} redirects).`);
