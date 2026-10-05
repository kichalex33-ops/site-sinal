// Troca a capa do livro para a edição em inglês quando o visitante acessa de fora do Brasil.
// Detecção por geolocalização do Cloudflare (request.cf.country); sem cookie, sem armazenamento.
// Override manual para teste/QA: ?capa=en ou ?capa=pt na URL.

class CoverSwap {
  constructor(variant) {
    this.variant = variant;
  }
  element(el) {
    if (this.variant !== "en") return;
    const src = el.getAttribute("src");
    if (src === "/livro/capa.jpg") el.setAttribute("src", "/livro/capa-en.jpg");
    const alt = el.getAttribute("alt");
    if (alt) el.setAttribute("alt", alt.replace("SINAL/RUÍDO", "SIGNAL/NOISE (English edition)"));
  }
}

class CoverSwapRatioFix {
  constructor(variant) {
    this.variant = variant;
  }
  element(el) {
    if (this.variant !== "en") return;
    if (el.getAttribute("width") === "400" && el.getAttribute("height") === "600") {
      el.setAttribute("height", "640");
    }
  }
}

// /buy — filtra a lista de países pelo país real do visitante (request.cf.country), sem cookie.
// ?market=XX escolhe a região manualmente; ?all=1 mostra todos os países de novo.
const MARKET_BY_COUNTRY = {
  US: "US", GB: "UK", DE: "DE", FR: "FR", ES: "ES", IT: "IT", NL: "NL",
  JP: "JP", CA: "CA", MX: "MX", AU: "AU", NZ: "AU", IN: "IN",
};
const MARKET_NAMES = {
  US: "United States", UK: "United Kingdom", DE: "Deutschland", FR: "France", ES: "España",
  IT: "Italia", NL: "Nederland", JP: "日本 (Japan)", CA: "Canada", MX: "México", AU: "Australia", IN: "India",
};

class BuyMarketFilter {
  constructor(market) {
    this.market = market;
  }
  element(el) {
    if (el.getAttribute("data-market") !== this.market) el.remove();
  }
}

class BuyChipsReplace {
  constructor(market) {
    this.market = market;
  }
  element(el) {
    const name = MARKET_NAMES[this.market] || this.market;
    el.before(
      `<p class="mono buy-region-notice" style="margin-top:8px;color:var(--muted)">Showing the edition for ${name}. <a href="?all=1">See all countries</a></p>`,
      { html: true }
    );
    el.remove();
  }
}

export async function onRequest(context) {
  const regionalUrl = new URL(context.request.url);
  const region = regionalUrl.searchParams.get('region') === 'NZ' ? 'NZ' : context.request.cf?.country;
  if (region === 'NZ' && ['/', '/en/', '/en'].includes(regionalUrl.pathname) && regionalUrl.searchParams.get('lang') !== 'pt') {
    return new Response(null, { status: 302, headers: { Location: new URL('/en/christchurch/', regionalUrl).href, 'Cache-Control': 'private, no-store' } });
  }
  let response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const url = new URL(context.request.url);
  const override = url.searchParams.get("capa");
  const country = context.request.cf?.country;
  const variant = override === "en" || override === "pt" ? override : country && country !== "BR" ? "en" : "pt";

  if (variant === "en") {
    response = new HTMLRewriter()
      .on(".home-hero-book__cover img", new CoverSwap(variant))
      .on(".home-hero-book__cover img", new CoverSwapRatioFix(variant))
      .on(".book-hero__cover", new CoverSwap(variant))
      .on(".books-featured img", new CoverSwap(variant))
      .transform(response);
  }

  if (url.pathname === "/buy/" || url.pathname === "/buy") {
    const showAll = url.searchParams.get("all") === "1";
    const marketParam = url.searchParams.get("market");
    const market = (marketParam || (region && MARKET_BY_COUNTRY[region]) || "").toUpperCase();
    if (!showAll && MARKET_NAMES[market]) {
      response = new HTMLRewriter()
        .on("nav.buy-chips", new BuyChipsReplace(market))
        .on("section.buy-market", new BuyMarketFilter(market))
        .transform(response);
    }
  }

  if (region === 'NZ' || region === 'AU') {
    response = new HTMLRewriter()
      .on('a[data-signal-edition]', { element(el) {
        const asin = {kindle:'B0HJP3HM7J',paperback:'B0HJQQBS8Q'}[el.getAttribute('data-signal-edition')];
        if (asin) el.setAttribute('href', 'https://www.amazon.com.au/dp/' + asin);
      } })
      .on('[data-region-entry]', { element(el) { if (region === 'NZ') el.removeAttribute('hidden'); } })
      .on('a[hreflang="pt-BR"]', { element(el) { if (el.getAttribute('href') === '/') el.setAttribute('href', '/?lang=pt'); } })
      .transform(response);
    response = new Response(response.body, response);
    response.headers.set('Cache-Control', 'private, no-store');
  }
  return response;
}
