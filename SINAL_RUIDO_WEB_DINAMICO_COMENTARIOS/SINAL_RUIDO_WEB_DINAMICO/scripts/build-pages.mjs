import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { page } from "../src/js/render/shell.js";
import { caseCard, collectionCard, mediaCard } from "../src/js/render/cards.js";
import { editorialBadge, maturityBadge, provenanceBadge, integrityBadge, escapeHtml } from "../src/js/render/badges.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dataDir = join(root, "src/data");

const cases = JSON.parse(readFileSync(join(dataDir, "cases.json"), "utf-8"));
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
function homePage() {
  const featuredVideo = media.find((m) => m.tipo === "video") || media[0];
  const featuredCollections = [
    collections.find((c) => c.slug === "pursue"),
    collections.find((c) => c.slug === "aaro"),
    collections.find((c) => c.slug === "arquivo-nacional-fundo-ovni"),
    collections.find((c) => c.slug === "nara-rg-615"),
  ].filter(Boolean);
  const featuredBook = books.find((b) => b.featured) || books[0];

  const body = `
    <section class="home-hero grid-texture">
      <div class="container home-hero__inner">
        <div class="home-hero__copy">
          <span class="kicker">Arquivo público · Brasil / Internacional</span>
          <h1 class="home-hero__headline" aria-label="O que sabemos. O que não sabemos. O que ainda falta encontrar.">
            <span data-hero-line>O que sabemos.</span>
            <span data-hero-line>O que não sabemos.</span>
            <span data-hero-line class="home-hero__headline-accent">O que ainda falta encontrar.</span>
          </h1>
          <p class="home-hero__lead">Casos, documentos, testemunhos e mídia organizados com contexto, proveniência e revisão. O arquivo registra o que existe sem transformar lacuna em conclusão.</p>
          <button type="button" class="home-search" data-cmdk-open aria-haspopup="dialog">
            <span>Buscar caso, documento, órgão, local ou coleção…</span>
            <kbd>Ctrl K</kbd>
          </button>
          <div class="home-hero__links" aria-label="Áreas principais do arquivo">
            <a href="/casos/">Casos</a><a href="/documentos/">Documentos</a><a href="/colecoes/">Coleções</a><a href="/midia/">Mídia</a>
          </div>
        </div>
        <aside class="home-hero__index" aria-label="Resumo real do acervo atual">
          <span class="mono home-hero__index-title">ACERVO INDEXADO</span>
          <div class="home-stats">
            <div><strong data-count="${cases.length}">${cases.length}</strong><span>casos</span></div>
            <div><strong data-count="${documents.length}">${documents.length}</strong><span>documentos</span></div>
            <div><strong data-count="${media.length}">${media.length}</strong><span>mídias</span></div>
            <div><strong data-count="${collections.length}">${collections.length}</strong><span>coleções</span></div>
          </div>
          <p class="mono home-hero__index-note">Contagens derivadas do catálogo desta versão. Sem métricas demonstrativas.</p>
        </aside>
      </div>
    </section>

    <section class="section home-updates">
      <div class="container">
        <div class="section-heading">
          <div><span class="kicker">Arquivo vivo</span><h2>Últimas atualizações</h2></div>
          <a class="mono section-heading__link" href="/noticias/">Radar documental →</a>
        </div>
        <div class="updates home-updates__grid">
          ${updates.slice(0,4).map((u) => `
            <article class="update-row">
              <time class="mono">${escapeHtml(u.date)}</time>
              <div><strong>${escapeHtml(u.title)}</strong><p>${escapeHtml(u.description)}</p><div class="update-row__badges">${u.tags.map((t) => provenanceBadge(t)).join("")}</div></div>
            </article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section section--divider">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">Dossiês</span><h2>Casos em destaque</h2></div><a class="mono section-heading__link" href="/casos/">Ver catálogo →</a></div>
        <div class="grid grid--3 home-case-grid">${cases.slice(0,3).map(caseCard).join("")}</div>
      </div>
    </section>

    <section class="section section--divider home-media-section">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">Biblioteca audiovisual</span><h2>Veja o registro. Depois leia o contexto.</h2></div><a class="mono section-heading__link" href="/midia/">Explorar mídia →</a></div>
        <div class="home-media-feature">
          <a class="home-media-feature__player" href="/midia/${featuredVideo.slug}/" aria-label="Abrir ${escapeHtml(featuredVideo.titulo)}">
            ${featuredVideo.tipo === "video" ? `<video src="${escapeHtml(featuredVideo.src)}" muted preload="metadata" playsinline></video><span class="home-media-feature__play" aria-hidden="true">▶</span>` : `<img src="${escapeHtml(featuredVideo.src)}" alt="" />`}
          </a>
          <div class="home-media-feature__meta">
            <span class="badge badge--provenance">${escapeHtml(featuredVideo.origem)}</span>
            <h3>${escapeHtml(featuredVideo.titulo)}</h3>
            <p>${escapeHtml(featuredVideo.contexto)}</p>
            <div class="home-media-feature__actions"><a class="btn btn--primary" href="/midia/${featuredVideo.slug}/">Abrir no player</a><a class="btn" href="/midia/">Toda a biblioteca</a></div>
            <p class="mono home-media-feature__note">Sem autoplay. Arquivos relacionados são sugeridos por metadados, não por popularidade.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--divider pursue-home">
      <div class="container">
        <div class="pursue-home__panel">
          <div>
            <span class="kicker">Coleção institucional</span>
            <h2>Arquivos UAP liberados pelo Pentágono</h2>
            <p>PURSUE reúne liberações oficiais em documentos, vídeos, imagens e outros arquivos. No SINAL/RUÍDO, a proveniência institucional é preservada sem converter publicação oficial em validação de uma interpretação extraordinária.</p>
            <a class="btn btn--primary" href="/colecoes/pursue/">Abrir coleção PURSUE</a>
          </div>
          <div class="release-stack" aria-label="Releases PURSUE indexados">
            ${(collections.find((c) => c.slug === "pursue")?.releases || []).map((r) => `<div class="release-chip"><strong>${escapeHtml(r.label)}</strong><span>${escapeHtml(r.date)}</span></div>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--divider">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">Acervos de origem</span><h2>Coleções institucionais</h2></div><a class="mono section-heading__link" href="/colecoes/">Ver todas →</a></div>
        <div class="grid grid--2">${featuredCollections.map(collectionCard).join("")}</div>
      </div>
    </section>

    <section class="section section--divider method-home">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">Método</span><h2>Uma pergunta precisa sobreviver às fontes.</h2></div><a class="mono section-heading__link" href="/metodo/">Conhecer o método →</a></div>
        <div class="method-home__grid">
          <div><span>01</span><strong>Documento</strong><p>O que foi registrado e por quem.</p></div>
          <div><span>02</span><strong>Testemunho</strong><p>O que alguém relata ter observado.</p></div>
          <div><span>03</span><strong>Hipótese</strong><p>O que pode explicar o conjunto disponível.</p></div>
          <div><span>04</span><strong>Contradição</strong><p>Onde as fontes não concordam.</p></div>
          <div><span>05</span><strong>Revisão</strong><p>O que muda quando chega informação melhor.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--divider literary-home">
      <div class="container literary-home__grid">
        <div class="literary-home__cover"><img src="${escapeHtml(featuredBook.cover)}" alt="Capa de ${escapeHtml(featuredBook.title)}" loading="lazy" /></div>
        <div class="literary-home__copy">
          <span class="badge" style="border-color:var(--signal);color:var(--signal)">FICÇÃO</span>
          <span class="kicker">SINAL/RUÍDO · Livros</span>
          <h2>${escapeHtml(featuredBook.title)}</h2>
          <p>${escapeHtml(featuredBook.description)}</p>
          <div class="literary-home__actions"><a class="btn btn--primary" href="/livro/amostra/">Ler até 3 capítulos</a><a class="btn" href="/livros/">Ver os livros</a></div>
          <p class="mono literary-home__note">A área literária é explicitamente ficcional. O arquivo factual continua separado.</p>
        </div>
      </div>
    </section>

    <section class="section section--divider support-home">
      <div class="container support-home__grid">
        <div><span class="kicker">Apoio independente</span><h2>Apoie SINAL/RUÍDO</h2><p>O apoio é opcional e ajuda a sustentar pesquisa, arquivo público e produção editorial. Nenhum conteúdo factual ou capítulo da amostra depende de contribuição.</p></div>
        <div class="support-home__qr"><img src="/apoio/pix-qr.jpg" alt="QR Code Pix para apoio ao projeto SINAL/RUÍDO" loading="lazy" /><div><span class="mono">PIX · APOIO À OBRA</span><button type="button" class="btn btn--primary" data-copy-pix>Copiar código Pix</button><span class="visually-hidden" data-pix-code>00020126330014br.gov.bcb.pix0111026387420665204000053039865802BR5916Alex Junior Kich6009Sao Paulo62290525REC6A982558C600D1848319096304DD3C</span></div></div>
      </div>
    </section>`;

  write("/", page({
    title: "SINAL/RUÍDO",
    description: "Arquivo instrumental brasileiro. O que sabemos, o que não sabemos e o que ainda falta encontrar.",
    path: "/",
    bodyHtml: body,
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
          <button type="button" class="filter-btn" data-filter-value="mídia">Mídia</button>
        </div>

        <ul class="arquivo-results" style="margin-top:20px" data-arquivo-results></ul>

        <div class="grid grid--2" style="margin-top:36px" data-arquivo-categories>
          <a class="card" href="/casos/"><span class="card__meta">${cases.length} casos</span><h3>Casos</h3><p>Dossiês e registros com cronologia, documentos, testemunhos e hipóteses.</p></a>
          <a class="card" href="/documentos/"><span class="card__meta">${documents.length} documentos</span><h3>Documentos</h3><p>Registros documentais relacionados aos casos, com origem e vínculo explícitos.</p></a>
          <a class="card" href="/colecoes/"><span class="card__meta">${collections.length} coleções</span><h3>Coleções</h3><p>Acervos institucionais de origem, nacionais e internacionais.</p></a>
          <a class="card" href="/midia/"><span class="card__meta">${media.length} itens</span><h3>Mídia</h3><p>Imagens, documentos e vídeos com origem, autoria e licença registradas.</p></a>
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

function caseDossierPage(item) {
  const relatedCorrections = corrections.filter((c) => c.caseSlug === item.slug);
  const body = `
    <article class="section container--medium">
      <a href="/casos/" class="mono" style="color:var(--muted)">← Voltar ao catálogo</a>

      <div class="paper" style="margin-top:20px;padding:28px">
        <span class="kicker">SINAL/RUÍDO — Dossiê</span>
        <div class="mono" style="margin-top:6px;font-size:12px;color:var(--paper-muted)">${escapeHtml(item.code)}</div>
        <h1 style="margin-top:6px;font-size:30px">${escapeHtml(item.title)}</h1>
        <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:13px;color:var(--paper-muted)">
          <span>${escapeHtml(item.date)}</span><span>•</span><span>${escapeHtml(item.location)}</span><span>•</span>
          ${editorialBadge(item.status, item.statusLabel)}
          ${maturityBadge(item.maturidade)}
        </div>
      </div>

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
function midiaPage() {
  const videos = media.filter((m) => m.tipo === "video");
  const featured = videos[0] || media[0];
  const related = media.filter((m) => m.slug !== featured.slug).slice(0, 5);
  const body = `
    <section class="section media-library">
      <div class="container">
        <span class="kicker">Biblioteca audiovisual</span>
        <h1 style="margin-top:12px">Mídia.</h1>
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

        <div class="media-masonry" style="margin-top:20px">
          ${media.map((m) => `<div data-media-card data-tipo="${m.tipo}">${mediaCard(m)}</div>`).join("")}
        </div>
      </div>
    </section>`;
  write("/midia", page({ title: "Mídia", description: "Biblioteca audiovisual do SINAL/RUÍDO, com vídeos, imagens e documentos contextualizados por fonte e proveniência.", path: "/midia/", bodyHtml: body }));
}

function midiaDetailPage(m) {
  const body = `
    <article class="section container--medium">
      <a href="/midia/" class="mono" style="color:var(--muted)">← Voltar à mídia</a>

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
  const body = `
    <section class="section container--narrow">
      <div class="book-hero">
        <div class="book-hero__cover-col"><img class="book-hero__cover" src="/livro/capa.jpg" alt="Capa do romance SINAL/RUÍDO" width="400" height="600" /></div>
        <div class="book-hero__text">
          <span class="badge" style="border-color:var(--signal);color:var(--signal)">FICÇÃO</span>
          <p class="mono" style="margin-top:14px;color:var(--muted)">NEM TODO SINAL QUER SER OUVIDO.</p>
          <h1 style="margin-top:10px">SINAL/RUÍDO — o romance.</h1>
          <p class="mono" style="margin-top:8px;color:var(--signal)">Alex Jr. Kich</p>
          <p style="margin-top:12px;font-size:17px;color:var(--muted)">Personagens, organizações, eventos e diálogos pertencem ao romance. O livro utiliza pesquisa real e método de investigação como matéria narrativa, mas sua trama e seus desfechos não integram o arquivo factual.</p>
          <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="/livro/amostra/">Ler até 3 capítulos</a><a class="btn" href="/livros/">Ver coleção de livros</a></div>
        </div>
      </div>

      <section style="margin-top:36px"><span class="kicker">Do livro para o arquivo</span><h2 style="margin-top:10px">Casos reais relacionados</h2><div class="grid" style="margin-top:16px">${bookCases.slice(0,4).map(caseCard).join("")}</div></section>

      <section class="paper support-book" style="margin-top:36px;padding:28px">
        <div><span class="kicker">Apoio à obra</span><h2 style="margin-top:10px">Ajude a manter a pesquisa e a publicação independentes.</h2><p style="margin-top:8px;color:var(--paper-muted)">Contribuição opcional. O acesso ao arquivo factual e à amostra não depende de pagamento.</p><div class="pix-card__code mono" data-pix-code>00020126330014br.gov.bcb.pix0111026387420665204000053039865802BR5916Alex Junior Kich6009Sao Paulo62290525REC6A982558C600D1848319096304DD3C</div><button type="button" class="btn btn--primary" style="margin-top:12px" data-copy-pix>Copiar código Pix</button></div>
        <img src="/apoio/pix-qr.jpg" alt="QR Code Pix para apoiar SINAL/RUÍDO" width="220" height="220" />
      </section>

      <div style="margin-top:36px;padding-top:20px;border-top:1px solid var(--border);display:flex;gap:12px;flex-wrap:wrap"><a href="/leitores/" class="btn">Área de leitores</a><button type="button" class="btn" data-share data-share-title="SINAL/RUÍDO — o romance" data-share-text="Um romance de investigação. Ficção apoiada por pesquisa factual separada.">Compartilhar</button></div>
    </section>`;
  write("/livro", page({ title: "O livro", description: "SINAL/RUÍDO, o romance — ficção científica de investigação com pesquisa factual separada do arquivo público.", path: "/livro/", bodyHtml: body, ogImage: "/livro/capa.jpg" }));
}

function livroAmostraPage() {
  const chapters = [
    { id: "chapter-1", n: "1", title: "O arquivo ruim", state: "ready-for-import" },
    { id: "chapter-2", n: "2", title: "Erro conhecido", state: "ready-for-import" },
    { id: "chapter-3", n: "3", title: "A máquina contra si mesma", state: "ready-for-import" },
  ];
  const body = `
    <article class="section reading-shell" data-reading-sample>
      <header class="reading-meta">
        <div><span class="badge" style="border-color:var(--signal);color:var(--signal)">FICÇÃO · AMOSTRA GRATUITA</span><p class="mono">SINAL/RUÍDO · Alex Jr. Kich</p></div>
        <div class="reading-tools" aria-label="Opções de leitura"><button type="button" data-reading-size="down" aria-label="Diminuir fonte">A−</button><button type="button" data-reading-size="up" aria-label="Aumentar fonte">A+</button><button type="button" data-reading-theme aria-label="Alternar modo de leitura">◐</button></div>
      </header>

      <nav class="chapter-nav" aria-label="Capítulos da amostra">
        ${chapters.map((c, i) => `<button type="button" data-chapter-tab="${c.id}" aria-selected="${i === 0 ? "true" : "false"}"><span>${c.n}</span>${escapeHtml(c.title)}</button>`).join("")}
      </nav>

      ${chapters.map((c, i) => `<section class="paper reading-paper" data-chapter-panel="${c.id}" ${i ? "hidden" : ""}>
        <p class="mono reading-progress">CAPÍTULO ${c.n} DE 3</p>
        <h1>${c.n}. ${escapeHtml(c.title)}</h1>
        <div class="reading-import-note">
          <strong>ÁREA PRONTA PARA O TEXTO HOMOLOGADO</strong>
          <p>O layout, navegação, progresso local e comentários já estão implementados. O texto integral deve ser importado literalmente da edição editorial vigente do manuscrito, sem reescrita pelo frontend.</p>
        </div>
        <div class="chapter-end"><span>Fim do capítulo ${c.n}</span>${i < chapters.length - 1 ? `<button class="btn btn--primary" type="button" data-next-chapter="${chapters[i+1].id}">Capítulo seguinte →</button>` : `<a class="btn btn--primary" href="/livro/">Conhecer o livro →</a>`}</div>

        <section class="reader-comments" data-comments-root data-chapter-id="${c.id}">
          <div class="reader-comments__heading"><div><span class="kicker">Comentários dos leitores</span><h2>O que ficou na sua cabeça?</h2></div><span class="mono">MODERAÇÃO PRÉVIA</span></div>
          <form class="comment-form" data-comment-form>
            <label>Nome ou apelido<input name="display_name" autocomplete="nickname" minlength="2" maxlength="40" required /></label>
            <label>Comentário<textarea name="comment_text" rows="5" minlength="8" maxlength="1200" required placeholder="Conte o que achou deste capítulo..."></textarea></label>
            <label class="comment-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off" /></label>
            <div data-turnstile></div>
            <div class="comment-form__footer"><button class="btn btn--primary" type="submit">Enviar comentário</button><p class="mono" data-comment-status>Os comentários passam por moderação antes de aparecer.</p></div>
          </form>
          <div class="reader-comments__list" data-comments-list></div>
        </section>
      </section>`).join("")}

      <div class="reading-actions"><a class="btn" href="/livro/">← Voltar ao livro</a><a class="btn" href="/casos/">Explorar os casos reais →</a></div>
    </article>`;
  write("/livro/amostra", page({
    title: "Amostra do romance",
    description: "Leia uma amostra de até três capítulos do romance SINAL/RUÍDO e envie um comentário para moderação.",
    path: "/livro/amostra/",
    bodyHtml: body,
    ogImage: "/livro/capa.jpg",
    robots: "noindex,follow",
    extraHead: `<script src="/comments-config.js"></script><script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>`,
  }));
}

// ---------------------------------------------------------------------
// /livros
// ---------------------------------------------------------------------
function livrosPage() {
  const featured = books.find((b) => b.featured) || books[0];
  const future = books.filter((b) => !b.featured);
  const body = `
    <section class="section books-page">
      <div class="container">
        <span class="kicker">Projeto literário</span>
        <h1 style="margin-top:12px">SINAL/RUÍDO · Livros</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:760px">A área literária reúne o romance principal e projetos narrativos associados. Tudo aqui é ficção e permanece separado do arquivo factual.</p>
        <div class="books-featured" style="margin-top:32px">
          <img src="${escapeHtml(featured.cover)}" alt="Capa de ${escapeHtml(featured.title)}" />
          <div><span class="badge" style="border-color:var(--signal);color:var(--signal)">${escapeHtml(featured.status)}</span><h2>${escapeHtml(featured.title)}</h2><p class="mono">${escapeHtml(featured.author)} · ${escapeHtml(featured.kind)}</p><p>${escapeHtml(featured.description)}</p><div class="books-actions"><a class="btn btn--primary" href="${escapeHtml(featured.sampleUrl)}">Ler até 3 capítulos</a><a class="btn" href="${escapeHtml(featured.url)}">Conhecer o livro</a></div></div>
        </div>
        <section class="books-future"><span class="kicker">Crônicas Cosmológicas</span><h2>Obras em desenvolvimento</h2><div class="books-grid">${future.map((b) => `<article class="book-card"><span class="mono">${escapeHtml(b.status)}</span><h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(b.description)}</p><small>${escapeHtml(b.kind)}</small></article>`).join("")}</div></section>
      </div>
    </section>`;
  write("/livros", page({ title: "Livros", description: "Livros e projetos literários de SINAL/RUÍDO, claramente separados do arquivo factual.", path: "/livros/", bodyHtml: body, ogImage: "/livro/capa.jpg" }));
}

// ---------------------------------------------------------------------
// /privacidade
// ---------------------------------------------------------------------
function privacidadePage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Privacidade</span>
      <h1 style="margin-top:12px">Poucos dados. Finalidade explícita.</h1>
      <p style="margin-top:10px;color:var(--muted)">O arquivo factual pode ser consultado sem conta. A única coleta pública prevista nesta fase é opcional e restrita aos comentários da amostra literária.</p>
      <div class="paper method-block" style="margin-top:28px"><h2>Comentários da amostra</h2><p>Ao comentar, o visitante informa um nome ou apelido e o texto do comentário. O sistema também registra o capítulo, o estado de moderação e datas técnicas. Não é solicitado e-mail.</p><p>Comentários são enviados para moderação antes da publicação. Conteúdo rejeitado pode permanecer no banco pelo tempo necessário à moderação e limpeza operacional.</p></div>
      <div class="paper method-block" style="margin-top:16px"><h2>Proteção contra spam</h2><p>A área de comentários foi preparada para Cloudflare Turnstile e Cloudflare D1. A infraestrutura de entrega e segurança pode processar dados técnicos de conexão conforme sua própria operação. O SINAL/RUÍDO não grava endereço IP na tabela pública de comentários.</p></div>
      <p class="mono" style="margin-top:20px;color:var(--muted)">Antes do lançamento, este texto deve ser confrontado com a configuração real de produção e ajustado se novos serviços de dados forem adicionados.</p>
    </section>`;
  write("/privacidade", page({ title: "Privacidade", description: "Política de privacidade do SINAL/RUÍDO para a fase pública inicial.", path: "/privacidade/", bodyHtml: body }));
}

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
    ...books.map((b) => ({ type: "livro", title: b.title, url: b.featured ? "/livro/" : "/livros/", tags: [b.kind, b.status] })),
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
  const canonicalRoutes = routes.filter((r) => !r.startsWith("/r/") && r !== "/livro/amostra/");
  const urlset = canonicalRoutes
    .map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`)
    .join("\n");
  writeStatic("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`);

  writeStatic("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  writeStatic("_headers", `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: geolocation=(), microphone=(), camera=()\n`);

  // Regras para Cloudflare Pages. As campanhas mantêm os links permanentes
  // impressos/divulgados. /contato é legado do protótipo e não coleta dados no MVP.
  writeStatic("_redirects", `# Cloudflare Pages redirects\n/r/livro            /leitores/?campanha=livro            301\n/r/bunkerx          /leitores/?campanha=bunkerx          301\n/r/cienciatododia   /leitores/?campanha=cienciatododia   301\n/r/spacetoday       /leitores/?campanha=spacetoday       301\n/contato             /imprensa/                           301\n/contato/            /imprensa/                           301\n`);
}

// ---------------------------------------------------------------------
// run
// ---------------------------------------------------------------------
["arquivo", "casos", "documentos", "colecoes", "midia", "noticias", "metodo", "correcoes", "livro", "livros", "leitores", "imprensa", "privacidade", "contato", "r"].forEach(clean);

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
livrosPage();
leitoresPage();
imprensaPage();
privacidadePage();
["livro", "bunkerx", "cienciatododia", "spacetoday"].forEach(campanhaRedirect);
buildSearchIndex();
buildSeoFiles();

console.log(`Geradas ${routes.length} páginas (${routes.filter((r) => !r.startsWith("/r/")).length} canônicas + ${routes.filter((r) => r.startsWith("/r/")).length} redirects).`);
