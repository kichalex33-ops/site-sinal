// Mapa dos Sinais / World Map of Signals: dados + HTML das duas versoes.
// Fonte única: src/data/signals.json. Publica somente os status editoriais autorizados:
// o gerador filtra aqui e escreve public/data/signals.public.json (o mapa e os cards leem dele).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { escapeHtml } from "../src/js/render/badges.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(root, "src/data", f), "utf-8"));

const signalsData = read("signals.json");
const postersData = read("posters.json");

import { PUBLIC_SIGNAL_STATUSES, signalStatus } from "../src/js/signal-status.js";

function validate() {
  const errors = [];
  const ids = new Set();
  for (const s of signalsData.signals) {
    if (ids.has(s.id)) errors.push(`id duplicado: ${s.id}`);
    ids.add(s.id);
    if (!signalsData.statuses.includes(s.status)) errors.push(`${s.id}: status invalido (${s.status})`);
    if (PUBLIC_SIGNAL_STATUSES.includes(s.status)) {
      const lat = s.latitude, lon = s.longitude;
      if (typeof lat !== "number" || typeof lon !== "number" || Math.abs(lat) > 90 || Math.abs(lon) > 180) errors.push(`${s.id}: local público exige latitude/longitude validas`);
      for (const k of ["nome", "cidade", "pais", "pais_en", "pais_codigo", "tipo"]) if (!s[k]) errors.push(`${s.id}: local público sem ${k}`);
    }
  }
  if (errors.length) throw new Error("signals.json invalido:\n- " + errors.join("\n- "));
}

export function publicSignals() {
  validate();
  return signalsData.signals
    .filter((s) => PUBLIC_SIGNAL_STATUSES.includes(s.status))
    // campos publicos apenas: nada de "interno", coord_source etc.
    .map(({ id, nome, nome_en, tipo, cidade, estado, estado_sigla, pais, pais_en, pais_codigo, latitude, longitude, coord_precision, status, data_confirmacao, foto, descricao, descricao_en, link }) =>
      ({ id, nome, nome_en: nome_en || nome, tipo, cidade, estado, estado_sigla, pais, pais_en, pais_codigo, latitude, longitude, coord_precision, status, data_confirmacao, foto, descricao, descricao_en, link }));
}

export function writePublicSignals() {
  const list = publicSignals();
  mkdirSync(join(root, "public/data"), { recursive: true });
  writeFileSync(join(root, "public/data/signals.public.json"), JSON.stringify({ signals: list }, null, 1) + "\n");
  return list;
}

export function stats(list) {
  return {
    signals: list.length,
    cities: new Set(list.map((s) => `${s.pais_codigo}|${s.estado || ""}|${s.cidade}`)).size,
    countries: new Set(list.map((s) => s.pais_codigo)).size,
  };
}

const T = {
  pt: {
    path: "/mapa-dos-sinais/",
    lang: "pt",
    kicker: "Mapa dos Sinais",
    h1: "Ajude o sinal a chegar à sua cidade.",
    lead1: "SINAL/RUÍDO começou como uma história sobre um sinal impossível.",
    lead2: "Agora o sinal está atravessando o mundo real.",
    lead3: "Baixe um dos cartazes, coloque-o em um espaço da sua cidade e envie uma foto. Cada local confirmado passa a fazer parte do Mapa dos Sinais.",
    cta1: "Leve o sinal para sua cidade",
    cta2: "Ver o mapa",
    tagline: "Um sinal começou no Brasil. Agora ele pode aparecer em qualquer lugar do mundo.",
    statsLabel: "Números do mapa",
    statNames: ["Locais acompanhados", "Cidades", "Países"],
    mapH: "Por onde o sinal está chegando",
    mapLabel: "Mapa-múndi com locais confirmados e em negociação",
    mapHint: "Arraste para mover, use os botões + e − para ampliar. Passe o mouse, toque ou pressione Enter em um marcador para ver o local.",
    mapNoJs: "O mapa precisa de JavaScript para ser exibido.",
    photoAlt: "Cartaz exposto em",
    mapAttr: "Mapa: © colaboradores do OpenStreetMap",
    confirmedLabel: "Sinal confirmado",
    howKicker: "Como participar",
    howH: "Quatro passos.",
    steps: [
      ["01", "Baixe", "Escolha um dos cartazes oficiais de SINAL/RUÍDO."],
      ["02", "Imprima", "A4 já é suficiente. Pode ser colorido ou preto e branco."],
      ["03", "Coloque o sinal", "Com autorização do responsável, coloque-o em uma biblioteca, livraria, café, universidade, escola, centro cultural ou outro espaço apropriado."],
      ["04", "Registre", "Tire uma foto mostrando o cartaz no local e envie para nós junto com o nome do espaço, cidade e país."],
    ],
    howAfter: "Depois da confirmação, o ponto poderá aparecer no Mapa dos Sinais.",
    postersKicker: "Cartazes oficiais",
    postersH: "Escolha seu sinal",
    postersLead: "Download direto, sem cadastro. Os arquivos em português têm proporção A4; os em inglês são 3:4 e cabem em A4 com pequenas margens.",
    langG: "Idioma", colorG: "Cor",
    fAll: "Todos", fColor: "Colorido", fBw: "Preto e branco",
    langNames: { pt: "Português", en: "English" },
    colorNames: { color: "Colorido", bw: "Preto e branco" },
    langEmpty: "Cartazes em português: em breve.",
    download: "Baixar", zoom: "Ampliar", close: "Fechar", dlHint: "PNG",
    sendKicker: "Envie seu sinal",
    sendH: "Colocou um sinal? Conte para nós.",
    sendLead: "Preencha os dados abaixo. O site não guarda nem envia nada: ele monta a mensagem no seu aparelho e você a envia pelo Instagram @sinal_ruido, anexando a foto na conversa. Todo registro passa por aprovação manual antes de aparecer no mapa.",
    f: { name: "Nome", email: "E-mail", venue: "Nome do local", city: "Cidade", region: "Estado/região", country: "País", type: "Tipo de local", message: "Mensagem (opcional)", consent: "Autorizo o uso da foto enviada para divulgação do projeto e para o Mapa dos Sinais." },
    types: [["library", "Biblioteca"], ["bookstore", "Livraria"], ["cafe", "Café"], ["university", "Universidade"], ["school", "Escola"], ["cultural", "Centro cultural"], ["other", "Outro"]],
    typeSelect: "Selecione…",
    make: "Montar mensagem",
    outLabel: "Sua mensagem",
    outHelp: "Copie, abra o Instagram, cole na conversa com @sinal_ruido e anexe a foto do cartaz no local.",
    copy: "Copiar mensagem", copied: "Mensagem copiada", openIg: "Abrir o Instagram",
    required: "Preencha este campo.", badEmail: "Informe um e-mail válido.", needConsent: "É preciso autorizar o uso da foto.",
    msgHead: "Sinal colocado (pedido de registro no Mapa dos Sinais)",
    msgLabels: { name: "Nome", email: "E-mail", venue: "Local", type: "Tipo", city: "Cidade", region: "Estado/região", country: "País", message: "Mensagem", consent: "Autorizo o uso da foto enviada para divulgação do projeto e para o Mapa dos Sinais.", photo: "(foto do cartaz no local em anexo)" },
    choosePath: "/mapa-dos-sinais/escolha-seu-sinal/",
    chooseNav: "Escolha seu sinal",
    chooseKicker: "Mapa dos Sinais",
    chooseLead: "Quatro passos para levar o sinal a um espaço da sua cidade: baixe, imprima, coloque e registre.",
    chooseMapCta: "Ver o mapa",
    chooseSendCta: "Colocou um sinal? Conte para nós",
    chooseSeoTitle: "Escolha seu sinal",
    chooseSeoDesc: "Baixe os cartazes oficiais de SINAL/RUÍDO, imprima em A4 e coloque o sinal em uma biblioteca, livraria, café ou universidade da sua cidade.",
    seoTitle: "Mapa dos Sinais",
    seoDesc: "Ajude SINAL/RUÍDO a atravessar o mundo real. Baixe um cartaz, coloque o sinal na sua cidade e participe do Mapa dos Sinais.",
    crumbBack: "Voltar para a página inicial",
  },
  en: {
    path: "/en/world-map-of-signals/",
    lang: "en",
    kicker: "World Map of Signals",
    h1: "Help the signal reach your city.",
    lead1: "SIGNAL/NOISE began as a story about an impossible signal.",
    lead2: "Now the signal is crossing the real world.",
    lead3: "Download one of the official posters, place it in a space in your city, and send us a photo. Every confirmed location can become part of the World Map of Signals.",
    cta1: "Bring the signal to your city",
    cta2: "Explore the map",
    tagline: "A signal began in Brazil. Now it can appear anywhere in the world.",
    statsLabel: "Map numbers",
    statNames: ["Locations tracked", "Cities", "Countries"],
    mapH: "Where the signal is reaching",
    mapLabel: "World map of confirmed locations and negotiations",
    mapHint: "Drag to move, use the + and − buttons to zoom. Hover, tap or press Enter on a marker to see the venue.",
    mapNoJs: "The map needs JavaScript to be displayed.",
    photoAlt: "Poster displayed at",
    mapAttr: "Map: © OpenStreetMap contributors",
    confirmedLabel: "Confirmed signal",
    howKicker: "How to take part",
    howH: "Four steps.",
    steps: [
      ["01", "Download", "Choose one of the official SIGNAL/NOISE posters."],
      ["02", "Print", "A4 is enough. Colour or black and white both work."],
      ["03", "Place the signal", "With permission from the venue, display it in a library, bookstore, café, university, school, cultural centre or another appropriate space."],
      ["04", "Register it", "Take a photo showing the poster at the location and send it to us with the venue name, city and country."],
    ],
    howAfter: "After confirmation, the location may appear on the World Map of Signals.",
    postersKicker: "Official posters",
    postersH: "Choose your signal",
    postersLead: "Direct download, no sign-up. Portuguese files are A4 proportion; English files are 3:4 and fit A4 with small margins.",
    langG: "Language", colorG: "Colour",
    fAll: "All", fColor: "Colour", fBw: "Black & White",
    langNames: { pt: "Português", en: "English" },
    colorNames: { color: "Colour", bw: "Black & White" },
    langEmpty: "Portuguese posters: coming soon.",
    download: "Download", zoom: "Enlarge", close: "Close", dlHint: "PNG",
    sendKicker: "Send your signal",
    sendH: "Placed a signal? Tell us.",
    sendLead: "Fill in the details below. This site stores and sends nothing: it builds the message on your device and you send it through Instagram @sinal_ruido, attaching the photo in the chat. Every submission is manually reviewed before anything appears on the map.",
    f: { name: "Name", email: "Email", venue: "Venue name", city: "City", region: "State/region", country: "Country", type: "Venue type", message: "Message (optional)", consent: "I authorize the submitted photo to be used for the project and the World Map of Signals." },
    types: [["library", "Library"], ["bookstore", "Bookstore"], ["cafe", "Café"], ["university", "University"], ["school", "School"], ["cultural", "Cultural venue"], ["other", "Other"]],
    typeSelect: "Select…",
    make: "Build message",
    outLabel: "Your message",
    outHelp: "Copy it, open Instagram, paste it into a chat with @sinal_ruido and attach the photo of the poster on site.",
    copy: "Copy message", copied: "Message copied", openIg: "Open Instagram",
    required: "Please fill in this field.", badEmail: "Enter a valid email.", needConsent: "You need to authorize the use of the photo.",
    msgHead: "Signal placed (request to be added to the World Map of Signals)",
    msgLabels: { name: "Name", email: "Email", venue: "Venue", type: "Type", city: "City", region: "State/region", country: "Country", message: "Message", consent: "I authorize the submitted photo to be used for the project and the World Map of Signals.", photo: "(photo of the poster on site attached)" },
    choosePath: "/en/world-map-of-signals/choose-your-signal/",
    chooseNav: "Choose your signal",
    chooseKicker: "World Map of Signals",
    chooseLead: "Four steps to bring the signal to a space in your city: download, print, place and register.",
    chooseMapCta: "Explore the map",
    chooseSendCta: "Placed a signal? Tell us",
    chooseSeoTitle: "Choose your signal",
    chooseSeoDesc: "Download the official SIGNAL/NOISE posters, print them on A4 and place the signal in a library, bookstore, café or university in your city.",
    seoTitle: "World Map of Signals",
    seoDesc: "Help SIGNAL/NOISE cross into the real world. Download a poster, place the signal in your city and join the World Map of Signals.",
    crumbBack: "Back to the home page",
  },
};

export const MAPA_SEO = {
  pt: { title: T.pt.seoTitle, description: T.pt.seoDesc, path: T.pt.path },
  en: { title: T.en.seoTitle, description: T.en.seoDesc, path: T.en.path },
};
export const ESCOLHA_SEO = {
  pt: { title: T.pt.chooseSeoTitle, description: T.pt.chooseSeoDesc, path: T.pt.choosePath },
  en: { title: T.en.chooseSeoTitle, description: T.en.chooseSeoDesc, path: T.en.choosePath },
};

function posterList() {
  return postersData.posters.filter((p) => existsSync(join(root, "public", p.file)) && existsSync(join(root, "public", p.thumb)));
}

function typeLabel(t, key) {
  const f = t.types.find(([k]) => k === key);
  return f ? f[1] : t.types[t.types.length - 1][1];
}

function posterCard(t, p) {
  const name = p.name[t.lang];
  const alt = p.alt[t.lang];
  return `<li class="poster-card" data-lang="${p.lang}" data-color="${p.color}">
      <button type="button" class="poster-card__open" data-poster-open data-full="${escapeHtml(p.file)}" data-alt="${escapeHtml(alt)}" data-name="${escapeHtml(name)}" aria-label="${escapeHtml(`${t.zoom}: ${name}`)}">
        <img src="${escapeHtml(p.thumb)}" alt="${escapeHtml(alt)}" width="${p.thumbW || 360}" height="${p.thumbH || 480}" loading="lazy" decoding="async" />
      </button>
      <div class="poster-card__body">
        <h4>${escapeHtml(name)}</h4>
        <p class="mono">${escapeHtml(t.langNames[p.lang])} · ${escapeHtml(t.colorNames[p.color])}</p>
        <a class="btn btn--primary poster-card__dl" href="${escapeHtml(p.file)}" download>${escapeHtml(t.download)}<span class="sr-only"> ${escapeHtml(name)}</span></a>
      </div>
    </li>`;
}

function chip(group, value, label, pressed) {
  return `<button type="button" class="buy-chip poster-chip" data-poster-filter="${group}" data-filter-value="${value}" aria-pressed="${pressed}">${escapeHtml(label)}</button>`;
}


function signalDirectory(t, list) {
  const en = t.lang === 'en';
  const approximate = en ? 'Approximate city location; venue address not yet provided.' : 'Localização aproximada na cidade; endereço do local ainda não informado.';
  const keys = ['photo', 'waiting-photo', 'installation', 'negotiation'];
  const labels = keys.map(key => ({key, ...signalStatus({status: key === 'negotiation' ? 'in_negotiation' : key === 'installation' ? 'accepted_waiting_installation' : 'confirmed', foto: key === 'photo' ? 'photo' : null}, t.lang)}));
  return `<p class="signal-directory__intro">${en ? 'Confirmed locations and ongoing negotiations. Negotiations do not mean a poster is already installed.' : 'Locais confirmados e negociações em andamento. Em negociação não significa que o cartaz já esteja instalado.'}</p>
    <ul class="signal-legend" aria-label="${en ? 'Location status legend' : 'Legenda dos status'}">${labels.map(({key,label}) => `<li class="signal-status signal-status--${key}">${escapeHtml(label)} · ${list.filter(s => signalStatus(s,t.lang).key === key).length}</li>`).join('')}</ul>
    <p class="signal-directory__note">${escapeHtml(approximate)}</p>
    <details class="signal-directory" open><summary>${en ? 'All locations and their status' : 'Todos os locais e seus status'} (${list.length})</summary>
      <ul class="signal-directory__grid">${list.map(s => {const status = signalStatus(s,t.lang); return `<li><h3>${escapeHtml(en ? s.nome_en : s.nome)}</h3><p>${escapeHtml([s.cidade,s.estado_sigla || s.estado,en ? s.pais_en : s.pais].filter(Boolean).join(' — '))}</p><p class="signal-status signal-status--${status.key}">${escapeHtml(status.label)}</p>${s.coord_precision === 'area' ? `<small>${escapeHtml(approximate)}</small>` : ''}<button type="button" class="btn" data-signal-focus="${escapeHtml(s.id)}">${en ? 'View on map' : 'Ver no mapa'}</button>${s.foto ? `<a href="${escapeHtml(s.foto)}">${en ? 'View photo' : 'Ver foto'}</a>` : ''}</li>`;}).join('')}</ul></details>`;
}

export function mapaBody(lang) {
  const t = T[lang];
  const list = publicSignals();
  const st = stats(list);
  const nums = [st.signals, st.cities, st.countries];

  return `
    <section class="mapa-hero grid-texture">
      <div class="container--medium mapa-hero__inner">
        <span class="kicker">${escapeHtml(t.kicker)}</span>
        <h1 class="mapa-hero__title">${escapeHtml(t.h1)}</h1>
        <p class="mapa-hero__tagline">${escapeHtml(t.tagline)}</p>
        <p class="mapa-hero__lead">${escapeHtml(t.lead1)}<br />${escapeHtml(t.lead2)}</p>
        <p class="mapa-hero__lead mapa-hero__lead--muted">${escapeHtml(t.lead3)}</p>
        <div class="home-hero-book__actions">
          <a class="btn btn--primary" href="${t.choosePath}">${escapeHtml(t.cta1)}</a>
          <a class="btn" href="#mapa">${escapeHtml(t.cta2)}</a>
        </div>
      </div>
    </section>

    <section class="mapa-stats" aria-label="${escapeHtml(t.statsLabel)}" data-signal-stats>
      <dl class="container--medium mapa-stats__grid">
        ${t.statNames.map((n, i) => `<div><dt class="mono">${escapeHtml(n)}</dt><dd class="mapa-stats__num" data-stat="${["signals", "cities", "countries"][i]}">${nums[i]}</dd></div>`).join("")}
      </dl>
    </section>

    <section class="section" id="mapa">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">${escapeHtml(t.kicker)}</span><h2>${escapeHtml(t.mapH)}</h2></div></div>
        <div class="signal-map" id="signal-map" data-signal-map data-src="/data/signals.public.json" data-lang="${lang}" data-confirmed="${escapeHtml(t.confirmedLabel)}" data-photo-alt="${escapeHtml(t.photoAlt)}" role="region" aria-label="${escapeHtml(t.mapLabel)}"></div>
        <noscript><p class="mono" style="margin-top:10px">${escapeHtml(t.mapNoJs)}</p></noscript>
        <p class="mono signal-map__hint">${escapeHtml(t.mapHint)} <span>${escapeHtml(t.mapAttr)}</span></p>
        ${signalDirectory(t, list)}
      </div>
    </section>

    <section class="section section--divider" id="envie">
      <div class="container--medium">
        <span class="kicker">${escapeHtml(t.sendKicker)}</span>
        <h2 style="margin-top:10px">${escapeHtml(t.sendH)}</h2>
        <p style="margin-top:10px;color:var(--muted);max-width:66ch">${escapeHtml(t.sendLead)}</p>
        ${signalForm(t)}
      </div>
    </section>`;
}

export function escolhaBody(lang) {
  const t = T[lang];
  const posters = posterList();
  const langs = ["pt", "en"];
  const groups = langs.map((l) => {
    const items = posters.filter((p) => p.lang === l);
    return `<div class="poster-group" data-poster-group="${l}">
        <h3 class="poster-group__title">${escapeHtml(t.langNames[l])}</h3>
        ${items.length ? `<ul class="poster-grid">${items.map((p) => posterCard(t, p)).join("")}</ul>` : `<p class="poster-group__empty mono">${escapeHtml(t.langEmpty)}</p>`}
      </div>`;
  }).join("");

  return `
    <section class="mapa-hero grid-texture">
      <div class="container--medium mapa-hero__inner">
        <span class="kicker">${escapeHtml(t.chooseKicker)}</span>
        <h1 class="mapa-hero__title">${escapeHtml(t.postersH)}</h1>
        <p class="mapa-hero__lead">${escapeHtml(t.chooseLead)}</p>
        <div class="home-hero-book__actions">
          <a class="btn btn--primary" href="#cartazes">${escapeHtml(t.download)}</a>
          <a class="btn" href="${t.path}">${escapeHtml(t.chooseMapCta)}</a>
        </div>
      </div>
    </section>

    <section class="section section--divider" id="como-participar">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">${escapeHtml(t.howKicker)}</span><h2>${escapeHtml(t.howH)}</h2></div></div>
        <ol class="mapa-steps">
          ${t.steps.map(([n, h, p]) => `<li class="mapa-step"><span class="mapa-step__n mono">${n}</span><h3>${escapeHtml(h)}</h3><p>${escapeHtml(p)}</p></li>`).join("")}
        </ol>
        <p class="mapa-steps__after">${escapeHtml(t.howAfter)}</p>
      </div>
    </section>

    <section class="section section--divider" id="cartazes">
      <div class="container">
        <div class="section-heading"><div><span class="kicker">${escapeHtml(t.postersKicker)}</span><h2>${escapeHtml(t.postersH)}</h2></div></div>
        <p style="color:var(--muted);max-width:62ch">${escapeHtml(t.postersLead)}</p>
        <div class="poster-filters" data-poster-filters>
          <div role="group" aria-label="${escapeHtml(t.langG)}" class="buy-chips">
            ${chip("lang", "all", t.fAll, "true")}${chip("lang", "pt", t.langNames.pt, "false")}${chip("lang", "en", t.langNames.en, "false")}
          </div>
          <div role="group" aria-label="${escapeHtml(t.colorG)}" class="buy-chips">
            ${chip("color", "all", t.fAll, "true")}${chip("color", "color", t.fColor, "false")}${chip("color", "bw", t.fBw, "false")}
          </div>
        </div>
        <p class="mono" style="color:var(--muted);font-size:11px;margin-top:10px">${escapeHtml(t.dlHint)}</p>
        <div class="poster-groups" data-poster-groups>${groups}</div>
      </div>
      <dialog class="book-dialog poster-dialog" data-poster-dialog aria-label="${escapeHtml(t.postersH)}">
        <div class="book-dialog__inner">
          <div class="book-dialog__bar"><button type="button" class="book-dialog__close" data-poster-close aria-label="${escapeHtml(t.close)}">×</button></div>
          <img class="poster-dialog__img" data-poster-img alt="" />
          <p class="mono poster-dialog__name" data-poster-name></p>
          <p><a class="btn btn--primary" data-poster-dl href="#" download>${escapeHtml(t.download)}</a></p>
        </div>
      </dialog>
    </section>


    <section class="section section--divider">
      <div class="container--medium" style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn--primary" href="${t.path}#envie">${escapeHtml(t.chooseSendCta)}</a>
        <a class="btn" href="${t.path}#mapa">${escapeHtml(t.chooseMapCta)}</a>
      </div>
    </section>`;
}

function signalForm(t) {
  const f = t.f;
  const field = (id, label, extra = "") => `<div class="sf-field"><label for="sf-${id}">${escapeHtml(label)}</label><input id="sf-${id}" name="${id}" ${extra} /></div>`;
  return `<form class="signal-form" data-signal-form novalidate autocomplete="on"
      data-lang="${t.lang}" data-ig="https://www.instagram.com/sinal_ruido/"
      data-head="${escapeHtml(t.msgHead)}" data-labels='${escapeHtml(JSON.stringify(t.msgLabels))}' data-types='${escapeHtml(JSON.stringify(Object.fromEntries(t.types)))}'
      data-copied="${escapeHtml(t.copied)}" data-copy="${escapeHtml(t.copy)}"
      data-err-required="${escapeHtml(t.required)}" data-err-email="${escapeHtml(t.badEmail)}" data-err-consent="${escapeHtml(t.needConsent)}">
      <div class="signal-form__grid">
        ${field("name", f.name, 'type="text" required maxlength="80" autocomplete="name"')}
        ${field("email", f.email, 'type="email" required maxlength="120" autocomplete="email" inputmode="email"')}
        ${field("venue", f.venue, 'type="text" required maxlength="120"')}
        <div class="sf-field"><label for="sf-type">${escapeHtml(f.type)}</label>
          <select id="sf-type" name="type" required><option value="">${escapeHtml(t.typeSelect)}</option>${t.types.map(([k, v]) => `<option value="${k}">${escapeHtml(v)}</option>`).join("")}</select></div>
        ${field("city", f.city, 'type="text" required maxlength="80" autocomplete="address-level2"')}
        ${field("region", f.region, 'type="text" maxlength="80" autocomplete="address-level1"')}
        ${field("country", f.country, 'type="text" required maxlength="80" autocomplete="country-name"')}
      </div>
      <div class="sf-field"><label for="sf-message">${escapeHtml(f.message)}</label><textarea id="sf-message" name="message" rows="3" maxlength="600"></textarea></div>
      <div class="sf-check"><input type="checkbox" id="sf-consent" name="consent" required /><label for="sf-consent">${escapeHtml(f.consent)}</label></div>
      <p class="sf-error" role="alert" data-sf-error hidden></p>
      <button type="submit" class="btn btn--primary">${escapeHtml(t.make)}</button>
      <div class="signal-form__out" data-sf-out hidden>
        <label for="sf-output">${escapeHtml(t.outLabel)}</label>
        <textarea id="sf-output" data-sf-output rows="11" readonly></textarea>
        <p class="mono" style="color:var(--muted);font-size:12px">${escapeHtml(t.outHelp)}</p>
        <div class="home-hero-book__actions">
          <button type="button" class="btn btn--primary" data-sf-copy>${escapeHtml(t.copy)}</button>
          <a class="btn" href="https://www.instagram.com/sinal_ruido/" target="_blank" rel="noopener">${escapeHtml(t.openIg)}</a>
        </div>
        <p class="mono" role="status" data-sf-status style="font-size:12px;color:var(--verified)"></p>
      </div>
    </form>`;
}

export function homeCallout(lang) {
  if (lang === "en") {
    return `<section class="section section--tight section--divider home-map-callout">
      <div class="container" style="display:flex;gap:20px;flex-wrap:wrap;align-items:center;justify-content:space-between">
        <p class="home-map-callout__text">The signal has started appearing in the real world.<br /><a href="/en/world-map-of-signals/">Explore the World Map of Signals.</a></p>
      </div>
    </section>`;
  }
  return `<section class="section section--tight section--divider home-map-callout">
      <div class="container" style="display:flex;gap:20px;flex-wrap:wrap;align-items:center;justify-content:space-between">
        <p class="home-map-callout__text">O sinal já começou a aparecer no mundo real.<br /><a href="/mapa-dos-sinais/">Veja o Mapa dos Sinais.</a></p>
      </div>
    </section>`;
}
