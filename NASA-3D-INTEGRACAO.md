# NASA-3D-INTEGRACAO

Documentação da camada 3D (modelos oficiais NASA) integrada ao SINAL/RUÍDO. Ver também `3D-AUDITORIA.md` (auditoria prévia), `src/data/nasa-models.json` (dados) e `NASA-3D-ASSET-MANIFEST.md` (manifesto de arquivos).

## 1. Modelos usados

| Modelo | Pergunta | Fonte | Crédito | Tamanho | Onde aparece |
|---|---|---|---|---|---|
| Deep Space Network 70-meter | Como ouvimos? | science.nasa.gov/3d-resources/70-meter-dish/ | NASA/Ames Research Center | 2,22 MB | Home (`explore-home`), `/explorar/` |
| Voyager Probe (B) | Como enviamos e recebemos de longa distância? | science.nasa.gov/3d-resources/voyager-probe-b/ | NASA/Michael D. Carbajal | 1,72 MB | `/explorar/` |
| Pioneer 10 | Como deixamos uma mensagem? | github.com/nasa/NASA-3D-Resources (sem página própria no hub atual) | NASA/NASA 3D Resources | 2,05 MB | `/explorar/` |
| Hubble Space Telescope (A) | Como observamos? | science.nasa.gov/3d-resources/hubble-space-telescope-a/ | DigitalSpace Corporation | 1,69 MB | `/explorar/` (grid "Como observamos") |
| James Webb Space Telescope (B) | Como observamos em infravermelho? | science.nasa.gov/3d-resources/james-webb-space-telescope-b/ | NASA/Christopher R. Meaney | 1,00 MB | `/explorar/` (grid) |
| Kepler (A) | Como detectamos planetas por variações de luz? | science.nasa.gov/3d-resources/kepler-a/ | NASA/Brian E. Kumanchik; NASA/Christian A. Lopez | 2,00 MB | `/explorar/` (grid) |
| TESS (A) | Como procuramos exoplanetas? | science.nasa.gov/3d-resources/transiting-exoplanet-survey-satellite-tess-a/ | NASA/Christopher R. Meaney | 0,21 MB | `/explorar/` (grid) |

Todos em `/explorar/fontes/` com hash SHA-256, data de download e link para a fonte oficial.

## 1.1 Seção "Como observamos"

Implementada a seção 4 da especificação: grid de 4 cards (`.explore-instrument-grid` / `.explore-instrument-card`, classes que já existiam em `components.css` desde a auditoria inicial mas estavam sem uso) com Hubble, James Webb, Kepler e TESS lado a lado — cada um com poster próprio, carregamento sob demanda e crédito específico. Reaproveita o mesmo `nasaModelViewer()` usado nos blocos grandes, só que dentro de um card menor (`aspect-ratio:1/1; max-height:280px`).

## 2. Política de uso

- Nenhum modelo baixado de Sketchfab, TurboSquid, CGTrader ou mirror não oficial — só `science.nasa.gov/3d-resources` e `github.com/nasa`.
- Crédito específico de cada página de origem preservado, nunca substituído por texto genérico. Quando a fonte não tinha crédito individual (Pioneer 10), o `source.json` documenta essa ausência explicitamente em vez de inventar um nome.
- A NASA nunca é descrita como parceira do projeto. `/explorar/` e `/explorar/fontes/` afirmam textualmente que a página é educativa e não estabelece ligação entre NASA e os casos do arquivo factual.
- Nenhum logotipo da NASA foi usado.

## 3. Performance

- `loading="lazy"` + `reveal="manual"` em todo `<model-viewer>`, sem exceção (Home incluída) — o GLB só é baixado quando o visitante clica em "Explorar em 3D →".
- Poster estático (WebP, 1200×900, 4–14 KB) sempre visível antes do clique, renderizado como `<img>` real dentro do slot `poster` (não como CSS `background-image` do próprio componente — ver nota técnica abaixo).
- `auto-rotate="false"` por padrão em todos os modelos; o visitante controla a câmera.
- `interaction-prompt="none"`: removida a dica de "arraste" nativa do `model-viewer`, já que o botão próprio já comunica interatividade — evita um ícone de mão sobreposto ao poster.
- Nenhuma página carrega mais de um GLB automaticamente. A Home carrega só o poster do DSN (14 KB); os GLBs (1,7–2,2 MB cada) só entram na rede sob clique explícito.

### Nota técnica: poster via `<img>`, não via atributo `poster`

O componente `@google/model-viewer@4.3.1` deveria aplicar a imagem do atributo `poster` como `background-image` internamente (via Lit `updated()`), mas isso não ocorreu de forma confiável neste ambiente/versão — o atributo e a propriedade JS estavam corretos, mas o navegador nunca chegava a requisitar o arquivo do poster (confirmado via inspeção do shadow DOM e do log de rede). Para não depender desse comportamento interno não confiável, `src/js/render/nasa-model.js` agora renderiza um `<img>` real dentro do slot `poster` (paralelo ao botão "Explorar em 3D"), com CSS (`nasa-model__poster`/`nasa-model__poster-img`) posicionando-o como camada de fundo. Isso garante que o poster sempre apareça, independentemente de peculiaridades da biblioteca.

## 4. Layout

- Corrigido durante esta implementação: `/explorar/` envolvia cada `nasaModelViewer()` num grid de 2 colunas (`explore-section__grid`) pensado para texto+modelo lado a lado, mas só recebia o bloco do modelo como filho único — o modelo renderizava em metade da largura do container por engano. Removido o wrapper; o modelo agora ocupa o container inteiro.
- `.nasa-model__viewer` aumentado (era `max-height:520px` fixo; agora `max-height:720px`, `aspect-ratio:16/10` em telas ≥860px) e os containers de `/explorar/` passaram de `container--narrow` (760px) para `container--medium` (920px), a pedido do autor ("deixe as janelas dos 3d maiores").

## 5. Acessibilidade

- `alt` descreve título + crédito em todo `<model-viewer>`.
- `<noscript>` com link direto para a página oficial da NASA quando JavaScript está desabilitado.
- A informação textual (pergunta, título, descrição, crédito, fonte) nunca depende do 3D carregar — está sempre presente no HTML, fora do `<model-viewer>`.
- `touch-action="pan-y"` evita que o gesto de rotação do modelo trave o scroll da página no mobile.

## 6. Páginas alteradas/criadas

- `scripts/build-pages.mjs`: `explorarPage()` expandida (Voyager, Pioneer 10, link para fontes); nova `explorarFontesPage()` → `/explorar/fontes/`.
- `src/data/nasa-models.json`: 3 entradas (DSN, Voyager, Pioneer 10).
- `src/js/render/nasa-model.js`: poster via `<img>` real; `interaction-prompt="none"`.
- `src/css/components.css`: `.nasa-model__poster`, `.nasa-model__poster-img`; `.nasa-model__viewer` maior.
- `public/models/nasa/{dsn-70m,voyager,pioneer-10}/`: `model.glb`, `poster.webp`, `source.json` cada.

## 7. Pendências

- Modelos restantes (Mars Reconnaissance Orbiter, Galileo, TDRS) e opcionais (Cassini-Huygens, ISS, Juno, SEXTANT/NICER) ainda não baixados — entram um a um, seguindo o mesmo processo (download de fonte oficial → hash → `source.json` → entrada em `nasa-models.json`), não em lote.
- Seção "Como os dados viajam" (TDRS + animação SVG relay) da especificação ainda não implementada — depende do modelo TDRS.
- Seção "Como um sensor produz evidência" (Mars Reconnaissance Orbiter, ligação conceitual com documento/testemunho/instrumento/derivado/interpretação) ainda não implementada — depende do modelo MRO.
- Cache HTTP de `/models/*` no Cloudflare (`Cache-Control: public, max-age=31536000, immutable`) não configurado nesta sessão — depende de decisão sobre versionamento de nome de arquivo (spec pede nomes versionados/content-hashed para cache longo; atualmente os arquivos usam nome fixo `model.glb`).
- Lighthouse (LCP/CLS/JS transferido, antes/depois) não executado nesta sessão.
- Sem deploy — tudo local.
