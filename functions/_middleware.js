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

export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const url = new URL(context.request.url);
  const override = url.searchParams.get("capa");
  const country = context.request.cf?.country;
  const variant = override === "en" || override === "pt" ? override : country && country !== "BR" ? "en" : "pt";

  if (variant !== "en") return response;

  return new HTMLRewriter()
    .on(".home-hero-book__cover img", new CoverSwap(variant))
    .on(".home-hero-book__cover img", new CoverSwapRatioFix(variant))
    .on(".book-hero__cover", new CoverSwap(variant))
    .on(".books-featured img", new CoverSwap(variant))
    .transform(response);
}
