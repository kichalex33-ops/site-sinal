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
  JP: "JP", CA: "CA", MX: "MX", AU: "AU", IN: "IN",
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
    const market = (marketParam || (country && MARKET_BY_COUNTRY[country]) || "").toUpperCase();
    if (!showAll && MARKET_NAMES[market]) {
      response = new HTMLRewriter()
        .on("nav.buy-chips", new BuyChipsReplace(market))
        .on("section.buy-market", new BuyMarketFilter(market))
        .transform(response);
    }
  }

  return response;
}
