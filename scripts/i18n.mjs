// Fundacao de idiomas e mercados. Locale != mercado: o idioma (locales.json) e a loja (markets.json)
// sao cadastros separados; um mercado so aponta para um idioma padrao.
// Nenhuma pagina traduzida e gerada a partir daqui: locale com status "planned" nao gera rota.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(dirname(fileURLToPath(import.meta.url)), "../src/data");
const read = (f) => JSON.parse(readFileSync(join(dataDir, f), "utf-8"));

export const localesData = read("locales.json");
export const marketsData = read("markets.json");
export const buyData = read("buy.json");

export function liveLocales() {
  return Object.entries(localesData.locales).filter(([, l]) => l.status === "live").map(([code]) => code);
}

export function marketList() {
  return Object.entries(marketsData.markets).map(([code, m]) => ({ code, ...m }));
}

export function localeForMarket(code) {
  return marketsData.markets[code].defaultLocale;
}

// Links de compra de um mercado: so edicoes listadas em markets.json (link conhecido).
export function buyLinks(code) {
  const m = marketsData.markets[code];
  return buyData.editionOrder
    .filter((ed) => m.editions.includes(ed))
    .map((ed) => ({
      edition: ed,
      label: buyData.editions[ed],
      asin: buyData.asins[ed],
      url: `https://www.${m.amazonDomain}/dp/${buyData.asins[ed]}`,
    }));
}

// <link rel="alternate" hreflang>. Considera apenas locales "live"; sem alternativas, devolve [].
export function hreflangAlternates(pathByLocale, siteUrl) {
  const live = liveLocales().filter((c) => pathByLocale[c]);
  if (live.length < 2) return [];
  const list = live.map((c) => ({ hreflang: localesData.locales[c].htmlLang, href: `${siteUrl}${pathByLocale[c]}` }));
  list.push({ hreflang: "x-default", href: `${siteUrl}${pathByLocale[localesData.default]}` });
  return list;
}

export function validateI18n() {
  const errors = [];
  const { locales } = localesData;
  if (!locales[localesData.default]) errors.push(`locale padrao inexistente: ${localesData.default}`);
  const paths = new Map();
  for (const [code, l] of Object.entries(locales)) {
    for (const k of ["label", "htmlLang", "ogLocale", "path", "status"]) if (!l[k]) errors.push(`locale ${code} sem ${k}`);
    if (paths.has(l.path)) errors.push(`locales ${paths.get(l.path)} e ${code} usam o mesmo path ${l.path}`);
    paths.set(l.path, code);
  }
  for (const [ed, asin] of Object.entries(buyData.asins)) {
    if (!/^B0[A-Z0-9]{8}$/.test(asin)) errors.push(`ASIN invalido em ${ed}: ${asin}`);
    if (!buyData.editions[ed]) errors.push(`edicao sem rotulo: ${ed}`);
  }
  for (const [code, m] of Object.entries(marketsData.markets)) {
    if (!m.amazonDomain) errors.push(`mercado ${code} sem amazonDomain`);
    if (!locales[m.defaultLocale]) errors.push(`mercado ${code}: locale padrao inexistente (${m.defaultLocale})`);
    if (!m.editions.length) errors.push(`mercado ${code} sem edicoes`);
    for (const ed of m.editions) if (!buyData.asins[ed]) errors.push(`mercado ${code}: edicao sem ASIN (${ed})`);
  }
  if (errors.length) throw new Error("i18n/buy invalido:\n- " + errors.join("\n- "));
}
