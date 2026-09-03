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
  const body = `
    <section class="section grid-texture" style="border-bottom:1px solid var(--border)">
      <div class="container--medium">
        <span class="kicker">Arquivo público</span>
        <h1 style="font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:0.04em;font-size:clamp(32px,5vw,52px);margin-top:16px">SINAL<span style="color:var(--signal)">/</span>RUÍDO</h1>
        <p class="mono" style="margin-top:8px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-size:12px">Arquivo instrumental brasileiro</p>
        <p style="margin-top:16px;color:var(--signal);font-style:italic;font-size:15px">Nem todo sinal quer ser ouvido.</p>
        <p style="margin-top:12px;max-width:60ch;color:var(--muted);font-size:17px">Organizamos casos, documentos, testemunhos, mídia e hipóteses sobre fenômenos aéreos não identificados — separando sempre o que foi verificado do que ainda é interpretação.</p>
        <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap">
          <button type="button" class="search-trigger" data-cmdk-open style="min-width:280px">Buscar caso, documento, órgão, local, coleção… <kbd>Ctrl K</kbd></button>
        </div>
        <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn btn--primary" href="/casos/">Ver casos</a>
          <a class="btn" href="/colecoes/">Coleções</a>
          <a class="btn" href="/midia/">Mídia</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <span class="kicker">Casos em leitura pública</span>
        <div class="grid grid--3" style="margin-top:24px">
          ${cases.slice(0, 3).map(caseCard).join("")}
        </div>
        <a href="/casos/" class="mono" style="display:inline-block;margin-top:16px;color:var(--muted)">Ver todos os casos →</a>
      </div>
    </section>

    <section class="section" style="border-top:1px solid var(--border)">
      <div class="container">
        <span class="kicker">Arquivo público · última atualização ${updates[0]?.date ?? ""}</span>
        <h2 style="margin-top:12px;font-size:24px">Atualizações do arquivo</h2>
        <div class="updates" style="margin-top:20px">
          ${updates.map((u) => `
            <div class="update-row">
              <time class="mono">${escapeHtml(u.date)}</time>
              <div>
                <strong>${escapeHtml(u.title)}</strong>
                <p style="color:var(--muted);font-size:13px;margin-top:2px">${escapeHtml(u.description)}</p>
                <div class="update-row__badges">${u.tags.map((t) => provenanceBadge(t)).join("")}</div>
              </div>
            </div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section" style="border-top:1px solid var(--border)">
      <div class="container">
        <div class="paper" style="padding:32px">
          <span class="kicker">O romance</span>
          <h2 style="margin-top:12px">SINAL/RUÍDO também é um romance — e é explicitamente ficção.</h2>
          <p style="margin-top:8px;max-width:640px">O livro usa o mesmo método de investigação apresentado aqui como matéria narrativa. Os casos deste arquivo são reais; a história do livro não é.</p>
          <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap">
            <a class="btn btn--primary" href="/livro/">Conhecer o livro</a>
            <a class="btn" href="/leitores/">Sou leitor do livro</a>
          </div>
        </div>
      </div>
    </section>`;

  write("/", page({
    title: "SINAL/RUÍDO",
    description: "Arquivo instrumental brasileiro sobre fenômenos aéreos não identificados — documento, testemunho e hipótese, sempre separados.",
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
        <p style="margin-top:8px;color:var(--muted);max-width:640px">O arquivo reúne casos, coleções institucionais e biblioteca de mídia. Busque abaixo por nome, órgão ou local, ou navegue pelas três áreas.</p>

        <div class="arquivo-search" style="margin-top:24px" data-arquivo-search-wrap>
          <span class="arquivo-search__icon" aria-hidden="true">⌕</span>
          <input type="search" class="arquivo-search__input" placeholder="Buscar caso, coleção, documento, órgão, local…" autocomplete="off" data-arquivo-input />
        </div>

        <div class="filter-row" style="margin-top:14px" data-filter-group="tipo" data-arquivo-filters>
          <button type="button" class="filter-btn" aria-pressed="true" data-filter-value="all">Todos</button>
          <button type="button" class="filter-btn" data-filter-value="caso">Casos</button>
          <button type="button" class="filter-btn" data-filter-value="coleção">Coleções</button>
          <button type="button" class="filter-btn" data-filter-value="mídia">Mídia</button>
        </div>

        <ul class="arquivo-results" style="margin-top:20px" data-arquivo-results></ul>

        <div class="grid grid--3" style="margin-top:36px" data-arquivo-categories>
          <a class="card" href="/casos/"><span class="card__meta">${cases.length} casos</span><h3>Casos</h3><p>Dossiês factuais completos, com documentos, testemunhos, cronologia e hipóteses.</p></a>
          <a class="card" href="/colecoes/"><span class="card__meta">${collections.length} coleções</span><h3>Coleções</h3><p>Acervos institucionais de origem — nacionais e internacionais.</p></a>
          <a class="card" href="/midia/"><span class="card__meta">${media.length} itens</span><h3>Mídia</h3><p>Imagens, documentos e vídeos com origem, autoria e licença confirmadas.</p></a>
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
  const body = `
    <section class="section container--medium">
      <a href="/colecoes/" class="mono" style="color:var(--muted)">← Voltar a coleções</a>
      <span class="mono" style="display:block;margin-top:20px;font-size:12px;color:var(--muted)">${escapeHtml(col.country)} · ${escapeHtml(col.period)}</span>
      <h1 style="margin-top:8px">${escapeHtml(col.name)}</h1>
      <p style="margin-top:4px;color:var(--muted)">${escapeHtml(col.institution)}</p>
      <p style="margin-top:16px;max-width:640px">${escapeHtml(col.description)}</p>
      ${col.url ? `<a href="${escapeHtml(col.url)}" target="_blank" rel="noopener noreferrer" class="mono" style="display:inline-block;margin-top:16px">Acessar a coleção na fonte oficial →</a>` : ""}

      <section style="margin-top:40px">
        <span class="kicker">Casos no arquivo com documentos desta coleção</span>
        <div class="grid" style="margin-top:16px">${relatedCases.map(caseCard).join("")}</div>
      </section>
    </section>`;
  write(`/colecoes/${col.slug}`, page({ title: col.name, description: col.description, path: `/colecoes/${col.slug}/`, bodyHtml: body }));
}

// ---------------------------------------------------------------------
// /midia
// ---------------------------------------------------------------------
function midiaPage() {
  const body = `
    <section class="section">
      <div class="container">
        <span class="kicker">Biblioteca</span>
        <h1 style="margin-top:12px">Mídia.</h1>
        <p style="margin-top:8px;color:var(--muted);max-width:640px">Toda imagem, documento e vídeo aqui tem origem, autoria e licença confirmadas. Nada é apresentado como registro original sem dizer claramente quando não é.</p>

        <div class="filter-row" style="margin-top:24px" data-filter-group="tipo" data-filter-target="[data-media-card]">
          <button type="button" class="filter-btn" aria-pressed="true" data-filter-value="all">Todos</button>
          <button type="button" class="filter-btn" data-filter-value="imagem">Imagens</button>
          <button type="button" class="filter-btn" data-filter-value="documento">Documentos</button>
          <button type="button" class="filter-btn" data-filter-value="video">Vídeos</button>
        </div>

        <div class="grid grid--3" style="margin-top:20px">
          ${media.map((m) => `<div data-media-card data-tipo="${m.tipo}">${mediaCard(m)}</div>`).join("")}
        </div>
      </div>
    </section>`;
  write("/midia", page({ title: "Mídia", description: "Biblioteca de imagens, documentos e vídeos do arquivo, com origem e licença de cada item.", path: "/midia/", bodyHtml: body }));
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
// /noticias — desenvolvimentos recentes reais sobre UAP/disclosure
// ---------------------------------------------------------------------
function noticiasPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Fora do arquivo de casos</span>
      <h1 style="margin-top:12px">Últimas notícias sobre UAP e disclosure.</h1>
      <p style="margin-top:8px;color:var(--muted)">Desenvolvimentos institucionais recentes — não são casos avaliados neste arquivo, apenas o registro de que algo aconteceu, com data e fonte. Tratamento e contradições completos, quando existirem, entram depois como dossiê próprio.</p>
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
    title: "Notícias",
    description: "Desenvolvimentos institucionais recentes sobre UAP e disclosure, com data e fonte.",
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
        <div class="book-hero__cover-col">
          <img class="book-hero__cover" src="/livro/capa.jpg" alt="Capa do romance SINAL/RUÍDO" width="400" height="600" />
          <a href="#apoio" class="book-hero__pix-badge">
            <img src="/apoio/pix-qr.jpg" alt="QR Code Pix para apoiar o SINAL/RUÍDO" width="72" height="72" loading="lazy" />
            <span>Apoiar via Pix</span>
          </a>
        </div>
        <div class="book-hero__text">
          <span class="badge" style="border-color:var(--signal);color:var(--signal)">Obra de ficção</span>
          <h1 style="margin-top:16px">SINAL/RUÍDO — o romance.</h1>
          <p style="margin-top:12px;font-size:17px;color:var(--muted)">SINAL/RUÍDO é um romance. Personagens, organizações, eventos e diálogos são invenção do autor. O livro se inspira em método de investigação e em casos reais tratados no arquivo público deste site, mas a trama, os nomes e os desfechos não correspondem a fatos verificados.</p>
        </div>
      </div>

      <section id="apoio" style="margin-top:32px">
        <span class="kicker">Apoie o projeto</span>
        <div class="paper pix-card" style="margin-top:16px;padding:24px">
          <div class="pix-card__qr">
            <img src="/apoio/pix-qr.jpg" alt="QR Code Pix para apoiar o SINAL/RUÍDO" width="180" height="180" loading="lazy" />
          </div>
          <div class="pix-card__info">
            <h2 style="font-size:16px">Manter o arquivo e o romance no ar tem custo.</h2>
            <p style="margin-top:8px;color:var(--paper-muted)">Se este trabalho valeu a sua leitura e você quiser ajudar a manter o site, a pesquisa e o livro, pode contribuir via Pix — qualquer valor. Escaneie o QR Code com o app do seu banco ou copie a chave abaixo.</p>
            <div class="pix-card__code mono" data-pix-code>00020126330014br.gov.bcb.pix0111026387420665204000053039865802BR5916Alex Junior Kich6009Sao Paulo62290525REC6A982558C600D1848319096304DD3C</div>
            <button type="button" class="btn btn--primary" style="margin-top:12px" data-copy-pix>Copiar código Pix</button>
          </div>
        </div>
      </section>

      <div class="paper" style="margin-top:24px;padding:24px">
        <h2 style="font-size:16px">Sinopse</h2>
        <p style="margin-top:8px">Um sinal de rádio de 1977, nunca explicado, é reexaminado décadas depois por um laboratório fictício. O que os dados parecem revelar força uma equipe de investigadores com métodos opostos a decidir até onde a disciplina resiste quando a urgência pede uma resposta.</p>
      </div>

      <p style="margin-top:20px;font-size:13px;color:var(--muted)">Personagens, organizações e eventos ficcionais do romance não fazem parte do arquivo factual.</p>

      <section style="margin-top:32px">
        <span class="kicker">Casos reais que inspiraram o romance</span>
        <div class="grid grid--2" style="margin-top:16px">${bookCases.map(caseCard).join("")}</div>
      </section>

      <div style="margin-top:36px;padding-top:20px;border-top:1px solid var(--border);display:flex;gap:12px;flex-wrap:wrap">
        <a href="/casos/" class="btn">Ver o arquivo factual completo</a>
        <button type="button" class="btn btn--primary" data-share data-share-title="SINAL/RUÍDO — o romance" data-share-text="Um romance de investigação. Ficção inspirada em fatos reais.">Compartilhar</button>
      </div>
    </section>`;
  write("/livro", page({ title: "O livro", description: "SINAL/RUÍDO, o romance — obra de ficção inspirada no arquivo factual.", path: "/livro/", bodyHtml: body }));
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
        <p style="margin-top:8px;color:var(--muted)">Este site separa quatro coisas que costumam se misturar: o documento original (fato), o relato de quem viveu o episódio (testemunho), a interpretação sobre o que aconteceu (hipótese) e a história inventada do romance (ficção).</p>
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
// /contato
// ---------------------------------------------------------------------
function contatoPage() {
  const body = `
    <section class="section container--narrow">
      <span class="kicker">Fale com o arquivo</span>
      <h1 style="margin-top:12px">Mensagem, relato ou sugestão de caso.</h1>
      <p style="margin-top:8px;color:var(--muted);max-width:60ch">Viu um caso que devia estar aqui? Foi testemunha de algo? Achou um erro ou quer só mandar uma mensagem? Escreva abaixo. Toda mensagem é lida — nem toda mensagem vira resposta individual.</p>

      <form class="contact-form" style="margin-top:28px" data-contact-form>
        <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off" />

        <label class="contact-form__field">
          <span>Nome</span>
          <input type="text" name="name" required autocomplete="name" />
        </label>

        <label class="contact-form__field">
          <span>Email</span>
          <input type="email" name="email" required autocomplete="email" />
        </label>

        <label class="contact-form__field">
          <span>Assunto</span>
          <select name="assunto" required>
            <option value="Mensagem geral">Mensagem geral</option>
            <option value="Relato / testemunho">Relato / testemunho pessoal</option>
            <option value="Sugestão de caso">Sugestão de caso para o arquivo</option>
            <option value="Correção">Correção ou erro encontrado</option>
          </select>
        </label>

        <label class="contact-form__field">
          <span>Mensagem</span>
          <textarea name="message" rows="7" required placeholder="Se for relato ou sugestão de caso, inclua data, local e, se possível, uma fonte."></textarea>
        </label>

        <button type="submit" class="btn btn--primary" data-contact-submit>Enviar</button>
        <p class="contact-form__status" data-contact-status role="status" aria-live="polite"></p>
      </form>
    </section>`;
  write("/contato", page({
    title: "Contato",
    description: "Envie uma mensagem, um relato ou sugira um caso para o arquivo SINAL/RUÍDO.",
    path: "/contato/",
    bodyHtml: body,
  }));
}

// ---------------------------------------------------------------------
// search index
// ---------------------------------------------------------------------
function buildSearchIndex() {
  const items = [
    ...cases.map((c) => ({ type: "caso", title: c.title, url: `/casos/${c.slug}/`, tags: [c.location, c.code] })),
    ...collections.map((c) => ({ type: "coleção", title: c.name, url: `/colecoes/${c.slug}/`, tags: [c.institution, c.country] })),
    ...media.map((m) => ({ type: "mídia", title: m.titulo, url: `/midia/${m.slug}/`, tags: [m.caseTitle, m.tipo] })),
  ];
  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(join(root, "public/search-index.json"), JSON.stringify(items));
}

// ---------------------------------------------------------------------
// SEO / deploy: robots.txt, sitemap.xml, _headers
// ---------------------------------------------------------------------
function buildSeoFiles() {
  const canonicalRoutes = routes.filter((r) => !r.startsWith("/r/"));
  const urlset = canonicalRoutes
    .map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`)
    .join("\n");
  writeStatic("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`);

  writeStatic("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  writeStatic("_headers", `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: geolocation=(), microphone=(), camera=()\n`);
}

// ---------------------------------------------------------------------
// run
// ---------------------------------------------------------------------
["arquivo", "casos", "colecoes", "midia", "noticias", "livro", "leitores", "contato", "r"].forEach(clean);

homePage();
arquivoPage();
casosPage();
cases.forEach(caseDossierPage);
colecoesPage();
collections.forEach(colecaoDetailPage);
midiaPage();
media.forEach(midiaDetailPage);
noticiasPage();
livroPage();
leitoresPage();
contatoPage();
["livro", "bunkerx", "cienciatododia", "spacetoday"].forEach(campanhaRedirect);
buildSearchIndex();
buildSeoFiles();

console.log(`Geradas ${1 + 1 + 1 + cases.length + 1 + collections.length + 1 + media.length + 4 + 4} páginas.`);
