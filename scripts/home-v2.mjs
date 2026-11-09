import { cinematicHome } from "./cinematic-home.mjs";
// Home v2 (cinematográfica, motion). Gera index.html (PT) e en/index.html (EN). Ativos em public/home/. Dados reais de src/data. GERADO por prototipo-home/sync-para-site.sh
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = join(ROOT, "src/data") + "/";
const j = (f) => JSON.parse(readFileSync(D + f, "utf8"));
const books = j("books.json"), cases = j("cases.json"), sheets = j("book-sheets.json"), sheetsEn = j("book-sheets-en.json");
const chPt = j("sample-chapters.json"), chEn = j("sample-chapters-en.json");
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const b = books.find((x) => x.slug === "sinal-ruido"), gods = books.find((x) => x.slug === "os-deuses-nao-tem-filhos");
const sigAll = j("signals.json").signals.filter((s) => s.status === "confirmed" && Number.isFinite(s.latitude));
const sigStats = [sigAll.length, new Set(sigAll.map((s) => s.cidade)).size, new Set(sigAll.map((s) => s.pais_codigo)).size];
const REAL = true;
const US_PAPER = "https://www.amazon.com/dp/B0HJQQBS8Q";
const caseIds = ["sinal-wow", "operacao-prato-colares", "varginha", "noite-oficial-dos-ovnis"];
const caseTitle = { "sinal-wow": "Sinal Wow!", "operacao-prato-colares": "Operação Prato", varginha: "Varginha", "noite-oficial-dos-ovnis": "Noite Oficial dos OVNIs" };
const caseTitleEn = { ...caseTitle, "noite-oficial-dos-ovnis": "The Official UFO Night", varginha: "Varginha" };

const T = {
  pt: {
    lang: "pt-BR", base: "", root: "/", title: "SINAL/RUÍDO — Alex Jr. Kich",
    desc: "SINAL/RUÍDO, romance de ficção científica investigativa de Alex Jr. Kich. Leia 3 capítulos grátis.",
    nav: [["Ler", "/livro/amostra/"], ["Livros", "/livros/"], ["Arquivo", "/arquivo/"], ["Mapa", "/mapa-dos-sinais/"], ["Autor", "/autor/"]],
    other: ["EN", "/en/"], eyebrow: "Ficção científica investigativa",
    hook: ["Em 1977, um sinal apareceu por 72&nbsp;segundos.", "Quarenta e nove anos depois, Henrique tenta provar que aquilo não significa nada."],
    turn: "O padrão se recusa a desaparecer.", by: `Um romance de ${b.author} inspirado no mistério real do sinal Wow!`,
    cover: "/home/capa.jpg", coverAlt: "Capa de SINAL/RUÍDO", kindle: b.purchaseUrl, print: b.purchaseUrlUiclap, buyK: "Comprar Kindle", buyP: "Comprar impresso",
    sample: "Ler 3 capítulos grátis", sampleUrl: "/livro/amostra/",
    sceneK: "A base real", sceneH: "Um minuto e doze segundos que nunca se repetiram.",
    facts: [["15/08/1977", "data do registro"], ["Big Ear", "radiotelescópio, Ohio State"], ["72 s", "janela de observação"], ["6EQUJ5", "a sequência circulada"]],
    wow: "Wow!",
    synK: "Sobre o romance",
    syn: [["O sinal existiu.", 0], ["O resto é onde a história começa.", 0]],
    synBody: "Em Santa Maria, Henrique usa o sinal Wow! de 1977 para testar ARGOS, um sistema que procura estruturas em dados imperfeitos. Ele espera encontrar erro. Encontra um padrão que resiste a cada tentativa de descartá-lo.",
    synBody2: "Mas correlação não é prova — e separar coincidência de evidência começa a cobrar um preço humano.", synLink: "Conhecer a história e a ficha do livro", synUrl: "/livros/sinal-ruido/",
    sampK: "Leia antes de decidir", sampH: "Três capítulos.<br>As primeiras pistas.", sampNote: "Sem cadastro. Comece e decida depois.", sampBtn: "Ler os 3 capítulos", chapters: chPt.chapters || chPt,
    bridge: ["O que sabemos.", "O que não sabemos.", "O que ainda falta encontrar."], bridgeNote: "No arquivo público, documentos, testemunhos e hipóteses ficam separados da ficção. “Não identificado” não significa “extraterrestre”.",
    casesK: "O arquivo", casesH: "Casos reais", casesAll: "Entrar no arquivo", casesUrl: "/arquivo/", caseBase: "/casos/", caseTitle,
    uniK: "Crônicas Cosmológicas · Volume I", uniH: gods.title, uniLine: sheets[gods.slug]?.tagline || gods.description, uniCover: "/home/deuses.jpg", uniBuy: "Comprar na Amazon", uniMore: "Conhecer o livro", uniUrl: `/livros/${gods.slug}/`, uniBuyUrl: gods.purchaseUrl, uniAll: "Ver os dez livros da coleção", uniAllUrl: "/livros/", uniNote: "",
    authK: "Sobre o autor", authText: "Escritor, artista e criador de mundos. Vive no Rio Grande do Sul, desenha, compõe e escreve histórias em diferentes escalas.", authBtn: "Conhecer Alex Jr. Kich", authUrl: "/autor/",
    foot: ["Imprensa", "/imprensa/"], foot2: ["Método", "/metodo/"], foot3: ["Privacidade", "/privacidade/"], replay: "Rever a transmissão",
    intro: { h: "Sinal recebido", go: "Silenciar", off: "Som desligado", play: "Toque para iniciar", skip: "Pular", warn: "Contém luzes piscantes e som. Use “Pular” ou Esc para ir direto ao site." },
    menu: "Menu", scroll: "Role",
  },
  en: {
    lang: "en", base: "../", root: "/en/", title: "SIGNAL/NOISE — Alex Jr. Kich",
    desc: "SIGNAL/NOISE, an investigative science-fiction novel by Alex Jr. Kich. Read 3 chapters free.",
    nav: [["Read", "/livro/sample/"], ["Books", "/en/chronicles/"], ["Archive", "/en/archive/"], ["Map", "/en/world-map-of-signals/"], ["Author", "/en/author/"]],
    other: ["PT", "/"], eyebrow: "Investigative science fiction",
    hook: ["In 1977, a signal appeared for 72&nbsp;seconds.", "Forty-nine years later, Henrique tries to prove it means nothing."],
    turn: "The pattern refuses to disappear.", by: `A novel by ${b.author} inspired by the real mystery of the Wow! signal.`,
    cover: "/home/capa-en.jpg", coverAlt: "Cover of SIGNAL/NOISE", kindle: b.purchaseUrlEn, print: US_PAPER, buyK: "Buy Kindle", buyP: "Buy paperback",
    sample: "Read 3 free chapters", sampleUrl: "/livro/sample/",
    sceneK: "The real starting point", sceneH: "Seventy-two seconds that never happened again.",
    facts: [["Aug 15, 1977", "date of the record"], ["Big Ear", "radio telescope, Ohio State"], ["72 s", "observation window"], ["6EQUJ5", "the circled sequence"]],
    wow: "Wow!",
    synK: "About the novel",
    syn: [["The signal existed.", 0], ["The rest is where the story begins.", 0]],
    synBody: "In Santa Maria, Brazil, Henrique uses the Wow! signal recorded in 1977 to test ARGOS, a system built to find patterns in imperfect data. He expects an error. Instead, he finds a pattern that survives every attempt to dismiss it.",
    synBody2: "But correlation is not proof — and separating coincidence from evidence begins to exact a human cost.", synLink: "The story and book details", synUrl: "/en/signal-noise/",
    sampK: "Read before you decide", sampH: "Three chapters.<br>The first clues.", sampNote: "No sign-up. Start reading and decide later.", sampBtn: "Read the 3 chapters", chapters: chEn.chapters || chEn,
    bridge: ["What we know.", "What we do not know.", "What we have yet to find."], bridgeNote: "In the public archive, documents, testimony and hypotheses stay separate from fiction. “Unidentified” does not mean “extraterrestrial”.",
    casesK: "The archive", casesH: "Real cases", casesAll: "Enter the archive", casesUrl: "/en/archive/", caseBase: "/en/archive/cases/", caseTitle: caseTitleEn,
    uniK: "Cosmological Chronicles · Volume I", uniH: gods.titleEn, uniLine: sheetsEn[gods.slug]?.tagline || gods.description, uniCover: "/home/deuses-en.jpg", uniBuy: "Buy the Portuguese edition", uniMore: "About the book", uniUrl: `/en/chronicles/${gods.slug}/`, uniBuyUrl: gods.purchaseUrl, uniAll: "See all ten books in the series", uniAllUrl: "/en/chronicles/", uniNote: "Currently available in Portuguese.",
    authK: "About the author", authText: "Writer, artist and worldbuilder. Based in Rio Grande do Sul, Brazil, he draws, composes and writes stories at different scales.", authBtn: "Meet Alex Jr. Kich", authUrl: "/en/author/",
    foot: ["Press", "/en/press/"], foot2: ["Method", "/en/method/"], foot3: ["Privacy", "/en/privacy/"], replay: "Replay the transmission",
    intro: { h: "Signal received", go: "Mute", off: "Sound off", play: "Tap to start", skip: "Skip", warn: "Contains flashing lights and sound. Use “Skip” or Esc to go straight to the site." },
    menu: "Menu", scroll: "Scroll",
  },
};

const vols = books.filter((x) => x.kind === "Crônicas Cosmológicas");
const X = {
  pt: {
    transK: "A transmissão", transSkip: "Continuar",
    mapK: "Mapa dos Sinais", mapH: "Os sinais estão aparecendo.", mapP: "SINAL/RUÍDO começou como uma história sobre um sinal impossível. Agora o sinal está atravessando o mundo real.", mapStats: ["Sinais confirmados", "Cidades", "Países"], mapLabel: "Mapa-múndi com os locais confirmados", mapHint: "Arraste para mover, use + e − para ampliar. Passe o mouse, toque ou pressione Enter em um marcador.", mapAttr: "Mapa: © colaboradores do OpenStreetMap", mapConf: "Sinal confirmado", mapPhoto: "Cartaz exposto em", mapGo: "Abrir o mapa completo", mapUrl: "/mapa-dos-sinais/", mapLang: "pt",
    cenasK: "Cenas do começo", cenasH: "O livro começa aqui.", cenasNote: "Fragmentos das primeiras páginas. Sem som, só o que aparece na tela.",
    cenas: [["espectro", "O pico"], ["impressao", "6EQUJ5"], ["equipamentos", "A sala"], ["digitando", "“Isso não deveria estar aqui.”"], ["laboratorio", "Os dois"], ["onda", "A linha"]],
    livroK: "O livro", livroH: "Vire. Há mais.", parts: ["Frente", "Lombada", "Contracapa", "Orelha"],
    cronK: "O universo", cronH: "Crônicas Cosmológicas", cronSub: "Dez livros. Um fio atravessa todos. Aqui ainda não se sabe onde ele termina.",
    soon: "Em desenvolvimento", sale: "À venda", front: "Frente", back: "Verso", origin: "Origem", originLine: "Tudo começa num sinal de 72 segundos.",
    cronBase: "/livros/", cronAll: "Ver a coleção completa", cronAllUrl: "/livros/",
  },
  en: {
    transK: "The transmission", transSkip: "Continue",
    mapK: "World Map of Signals", mapH: "The signals are appearing.", mapP: "SIGNAL/NOISE began as a story about an impossible signal. Now the signal is crossing the real world.", mapStats: ["Confirmed signals", "Cities", "Countries"], mapLabel: "World map of confirmed locations", mapHint: "Drag to move, use + and − to zoom. Hover, tap or press Enter on a marker.", mapAttr: "Map: © OpenStreetMap contributors", mapConf: "Confirmed signal", mapPhoto: "Poster displayed at", mapGo: "Open the full map", mapUrl: "/en/world-map-of-signals/", mapLang: "en",
    cenasK: "Scenes from the opening", cenasH: "The book starts here.", cenasNote: "Fragments of the first pages. No sound, only what is on screen.",
    cenas: [["espectro", "The peak"], ["impressao", "6EQUJ5"], ["equipamentos", "The room"], ["digitando", "“This should not be here.”"], ["laboratorio", "The two of them"], ["onda", "The line"]],
    livroK: "The book", livroH: "Turn it over. There is more.", parts: ["Front", "Spine", "Back cover", "Inside flap"],
    cronK: "The universe", cronH: "Cosmological Chronicles", cronSub: "Ten books. One thread runs through all of them. Where it ends is not yet known.",
    soon: "In development", sale: "Available", front: "Front", back: "Back", origin: "Origin", originLine: "It all begins with a 72-second signal.",
    cronBase: "/en/chronicles/", cronAll: "See the whole series", cronAllUrl: "/en/chronicles/",
  },
};
const wordsOf = (arr) => arr.map(([t]) => t.split(" ").map((w) => `<span class="w">${esc(w)}</span>`).join(" ")).join(" ");

function page(k) {
  const t = T[k], A = (p) => "/home/" + p;
  const link = (u, l, c) => (u ? `<a class="btn ${c}" href="${esc(u)}" target="_blank" rel="noopener noreferrer"><span>${l}</span></a>` : "");
  const chs = t.chapters.map((c) => `<a class="chap" data-r href="${t.sampleUrl}"><span class="n">${String(c.n).padStart(2, "0")}</span><h3>${esc(c.title)}</h3><span class="go mono">${t.sampBtn} <span class="arrow">→</span></span></a>`).join("");
  const cs = caseIds.map((id) => { const c = cases.find((x) => x.slug === id); return `<a class="case" href="${k === "en" && !existsSync(join(ROOT, "en/archive/cases", id)) ? t.casesUrl : t.caseBase + id + "/"}"><img src="${A("casos/" + id + ".jpg")}" alt="" loading="lazy"><div class="case__t"><span class="mono"><b>${esc(c.date)}</b> · ${esc((c.location || "").split(",").slice(-1)[0].trim())}</span><h3>${esc(t.caseTitle[id])}</h3></div></a>`; }).join("");
  const x = X[k];
  const tl = (v) => (k === "en" ? sheetsEn[v.slug]?.tagline : sheets[v.slug]?.tagline) || v.description || "";
  const sCenas = `<section class="cenas" id="cenas"><div class="wrap"><span class="mono" data-r><b>●</b> ${x.cenasK}</span><h2 class="big" data-r>${x.cenasH}</h2><p class="mono" data-r style="margin-top:14px">${x.cenasNote}</p></div>
  <div class="rail rail--cenas">${x.cenas.map(([id, t], i) => `<figure class="cena"><video muted loop playsinline preload="none" poster="${A("cenas/" + id + ".jpg")}" data-src="${A("cenas/" + id + ".mp4")}"></video><figcaption><span class="mono"><b>${String(i + 1).padStart(2, "0")}</b></span>${t}</figcaption></figure>`).join("")}</div></section>`;
  const sTrans = `<section class="trans" aria-label="${x.transK}"><div class="trans__pin">${[1, 2, 3, 4, 5].map((n) => `<video class="trans__v" muted playsinline preload="none" poster="${A("transmissao/t" + n + ".jpg")}" data-src="${A("transmissao/t" + n + ".mp4")}" aria-hidden="true"></video>`).join("")}
  <div class="trans__noise" aria-hidden="true"></div><div class="trans__vig" aria-hidden="true"></div>
  <div class="trans__hud mono"><span><b>●</b> ${x.transK}</span><span class="trans__n" aria-hidden="true">01 / 05</span></div>
  <a class="trans__skip mono" href="#cenas">${x.transSkip} <span class="arrow">→</span></a></div></section>`;
  const sMapa = `<section class="mapa" id="mapa-sinais"><div class="wrap"><span class="mono" data-r><b>●</b> ${x.mapK}</span><h2 class="big" data-r>${x.mapH}</h2><p class="cron__sub" data-r>${x.mapP}</p>
  <dl class="mapa__stats" data-r>${x.mapStats.map((n, i) => `<div><dd>${sigStats[i]}</dd><dt class="mono">${n}</dt></div>`).join("")}</dl>
  <div class="signal-map" id="signal-map" data-signal-map data-src="/data/signals.public.json" data-lang="${x.mapLang}" data-confirmed="${esc(x.mapConf)}" data-photo-alt="${esc(x.mapPhoto)}" role="region" aria-label="${esc(x.mapLabel)}"></div>
  <noscript><p class="mono">${t.lang === "en" ? "The map needs JavaScript to be displayed." : "O mapa precisa de JavaScript para ser exibido."}</p></noscript>
  <p class="mono mapa__hint">${x.mapHint} <span>${x.mapAttr}</span></p>
  <div style="margin-top:28px"><a class="link-arrow" href="${x.mapUrl}">${x.mapGo} <span class="arrow">→</span></a></div></div></section>`;
  const sLivro = `<section class="livro" aria-label="${x.livroK}"><div class="livro__pin"><div class="livro__head"><span class="mono"><b>●</b> ${x.livroK}</span><h2>${x.livroH}</h2></div>
  <div class="livro__view"><img class="livro__img" src="${A("capa-aberta.jpg")}" alt="" width="2600" height="1222"></div>
  <ol class="livro__parts">${x.parts.map((p, i) => `<li data-i="${i}"><span class="mono">0${i + 1}</span>${p}</li>`).join("")}</ol></div></section>`;
  const volCard = (v, i, o) => {
    const slug = o ? "sinal-ruido" : v.slug, num = o ? x.origin : v.numeral, title = o ? (k === "en" ? "SIGNAL/NOISE" : "SINAL/RUÍDO") : (k === "en" ? v.titleEn : v.title);
    const line = o ? x.originLine : tl(v), sale = o || v.purchaseUrl, href = o ? t.synUrl : (k === "en" ? "/en/chronicles/" : "/livros/") + v.slug + "/";
    return `<article class="vol ${i % 2 ? "vol--r" : ""}" data-vol data-r><span class="vol__n" aria-hidden="true">${num}</span>
      <a class="vol__book" href="${href}"><span class="vol__flip"><img class="f" src="${A("vol/" + slug + (k === "en" ? "-en" : "") + ".jpg")}" alt="${esc(title)}" loading="lazy" width="520" height="780"><img class="b" src="${A("vol/" + slug + "-verso.jpg")}" alt="" loading="lazy" width="520" height="780"></span></a>
      <div class="vol__t"><span class="mono"><b>${sale ? x.sale : x.soon}</b></span><h3><a href="${href}">${esc(title)}</a></h3><p>${esc(line)}</p></div></article>`;
  };
  const sCron = `<section class="cron" id="cronicas"><div class="wrap"><span class="mono" data-r><b>●</b> ${x.cronK}</span><h2 class="big" data-r>${x.cronH}</h2><p class="cron__sub" data-r>${x.cronSub}</p></div>
  <div class="cron__track"><svg class="thread" preserveAspectRatio="none" aria-hidden="true"><path class="thread__bg"/><path class="thread__fg"/></svg>
  ${[null, ...vols].map((v, i) => volCard(v, i, i === 0)).join("")}</div>
  <div class="wrap" style="margin-top:50px"><a class="link-arrow" href="${x.cronAllUrl}">${x.cronAll} <span class="arrow">→</span></a></div></section>`;
  return `<!doctype html>
<html lang="${t.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.title)}</title><meta name="description" content="${esc(t.desc)}"><meta name="theme-color" content="#07090d"><link rel="icon" href="data:,">
<link rel="stylesheet" href="${A("style.css")}">${REAL ? '<link rel="stylesheet" href="/home/mapa.css">' : ""}<link rel="preload" as="image" href="${A("telescopio-poster.jpg")}">
<script src="${A("lenis.min.js")}"></script><script type="module" src="${A("main.js")}"></script>${REAL ? '<script type="module" src="/src/js/home-map.js"></script>' : ""}</head>
<body>
<div class="progress" aria-hidden="true"></div><div class="curtain" aria-hidden="true"></div>

<div class="intro" role="dialog" aria-label="${esc(t.intro.h)}">
  <video src="${A("intro.mp4")}" poster="${A("intro-poster.jpg")}" playsinline preload="auto"></video>
  <div class="intro__gray" aria-hidden="true"><img src="${A("gray.jpg")}" alt=""></div>
  <button class="intro__sound" type="button" hidden data-on="${esc(t.intro.go)}" data-off="${esc(t.intro.off)}">${esc(t.intro.go)}</button>
  <button class="intro__play" type="button" hidden>${esc(t.intro.play)}</button>
  <p class="intro__warn mono">${esc(t.intro.warn)}</p>
  <button class="intro__skip" type="button">${esc(t.intro.skip)} →</button>
</div>

<header class="hdr"><a class="logo" href="${t.root}" aria-label="SINAL/RUÍDO">${k === "en" ? "SIGNAL" : "SINAL"}<span class="slash">/</span>${k === "en" ? "NOISE" : "RUÍDO"}</a>
  <nav class="nav" aria-label="Principal">${t.nav.map(([l, u]) => `<a href="${u}">${l}</a>`).join("")}</nav>
  <div class="lang"><a href="${t.other[1]}" hreflang="${k === "pt" ? "en" : "pt-BR"}">${t.other[0]}</a></div>
  <button class="menu-btn" type="button" aria-expanded="false">${t.menu}</button></header>

<main>
<section class="hero" aria-labelledby="h1">
  <video class="hero__video" muted loop playsinline preload="auto" poster="${A("telescopio-poster.jpg")}" aria-hidden="true"><source src="${A("telescopio-mobile.mp4")}" media="(max-width:700px)" type="video/mp4"><source src="${A("telescopio.mp4")}" type="video/mp4"></video>
  <div class="wrap hero__grid">
    <div>
      <p class="eyebrow mono">${t.eyebrow}</p>
      <h1 class="title" id="h1"><span class="ln">${k === "en" ? "SIGNAL" : "SINAL"}</span><span class="ln">/${k === "en" ? "NOISE" : "RUÍDO"}</span></h1>
      <div class="hook">${t.hook.map((p) => `<p>${p}</p>`).join("")}<p class="turn">${t.turn}</p></div>
      <div class="cta">${link(t.kindle, t.buyK, "btn--primary")}${link(t.print, t.buyP, "btn--ghost")}<a class="link-arrow" href="${t.sampleUrl}">${t.sample} <span class="arrow">→</span></a></div>
      <p class="by mono">${t.by}</p>
    </div>
    <div class="cover-stage"><div class="cover"><img src="${t.cover}" alt="${esc(t.coverAlt)}" width="1050" height="1512" fetchpriority="high"></div></div>
  </div>
  <div class="scroll-cue mono"><i></i>${t.scroll}</div>
</section>

${sTrans}

${sCenas}

<section class="scene" aria-labelledby="sceneh"><div class="scene__pin">
  <div><span class="mono"><b>●</b> ${t.sceneK}</span><h2 id="sceneh">${t.sceneH}</h2></div>
  <div class="wave-box"><canvas id="wave" role="img" aria-label="${esc(t.sceneH)}"></canvas><div class="wow" aria-hidden="true"><strong>${t.wow}</strong><span class="mono">6EQUJ5</span></div></div>
  <div class="facts">${t.facts.map(([a, c]) => `<div class="fact"><b>${a}</b><span>${c}</span></div>`).join("")}</div>
</div></section>

<section class="syn"><div class="wrap"><span class="mono" data-r><b>●</b> ${t.synK}</span>
  <h2 class="syn__txt">${wordsOf(t.syn)}</h2>
  <div class="syn__more" data-r><p>${t.synBody}</p><p>${t.synBody2}</p><a class="link-arrow" href="${t.synUrl}">${t.synLink} <span class="arrow">→</span></a></div></div></section>

${sLivro}

<section class="sample"><div class="wrap">
  <div class="sample__head"><div><span class="mono" data-r><b>●</b> ${t.sampK}</span><h2 class="big" data-r>${t.sampH}</h2></div></div>
  <div style="margin-top:40px">${chs}</div>
  <div class="sample__foot" data-r><a class="btn btn--primary" href="${t.sampleUrl}"><span>${t.sampBtn} <span class="arrow">→</span></span></a><span class="mono">${t.sampNote}</span></div>
</div></section>

${sCron}

${sMapa}

<section class="bridge"><div class="wrap"><div class="bridge__lines">${t.bridge.map((l) => `<p><span>${l}</span></p>`).join("")}</div><p class="bridge__note" data-r>${t.bridgeNote}</p></div></section>

<section class="cases"><div class="wrap cases__head"><div><span class="mono" data-r><b>●</b> ${t.casesK}</span><h2 class="big" data-r style="font-size:clamp(1.8rem,4vw,3.4rem)">${t.casesH}</h2></div><a class="link-arrow" href="${t.casesUrl}">${t.casesAll} <span class="arrow">→</span></a></div>
  <div class="rail">${cs}</div></section>

<section class="author"><div class="wrap author__grid">
  <div class="author__img" data-r><img src="${A("retrato.jpg")}" alt="Alex Jr. Kich" loading="lazy" width="700" height="833"></div>
  <div data-r><span class="mono"><b>●</b> ${t.authK}</span><h2 class="big">Alex Jr. Kich</h2><p>${t.authText}</p><a class="btn btn--ghost" href="${t.authUrl}"><span>${t.authBtn} <span class="arrow">→</span></span></a></div>
</div></section>
</main>

<footer class="foot"><div class="wrap"><div class="foot__big" aria-hidden="true">${k === "en" ? "SIGNAL" : "SINAL"}/${k === "en" ? "NOISE" : "RUÍDO"}</div>
  <div class="foot__row mono"><nav>${[t.foot, t.foot2, t.foot3].map(([l, u]) => `<a href="${u}">${l}</a>`).join("")}<a href="#" data-replay>${t.replay}</a></nav><span>© ${new Date().getFullYear()} Alex Jr. Kich</span></div></div></footer>
</body></html>`;
}

export function writeHomeV2() {
  writeFileSync(join(ROOT, "index.html"), cinematicHome(page("pt")));
  mkdirSync(join(ROOT, "en"), { recursive: true });
  writeFileSync(join(ROOT, "en/index.html"), page("en"));
}
