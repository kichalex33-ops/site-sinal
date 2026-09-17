# RELATORIO-NASA-3D

Relatório desta rodada de implementação da camada 3D. Continuação do que já existia (DSN 70m, catalogado em sessão anterior — ver `3D-AUDITORIA.md`). Sem deploy.

## Modelos baixados (nesta sessão, em duas rodadas)

Rodada 1 (prioridade 1 da especificação):
- **Voyager Probe (B)** — 1,72 MB, `science.nasa.gov/3d-resources/voyager-probe-b/`, crédito NASA/Michael D. Carbajal.
- **Pioneer 10** — 2,05 MB, `github.com/nasa/NASA-3D-Resources` (sem página própria no hub atual), crédito NASA/NASA 3D Resources.

Rodada 2 (seção "Como observamos" da especificação, §15 seção 4):
- **Hubble Space Telescope (A)** — 1,69 MB, `science.nasa.gov/3d-resources/hubble-space-telescope-a/`, crédito DigitalSpace Corporation.
- **James Webb Space Telescope (B)** — 1,00 MB, `science.nasa.gov/3d-resources/james-webb-space-telescope-b/`, crédito NASA/Christopher R. Meaney.
- **Kepler (A)** — 2,00 MB, `science.nasa.gov/3d-resources/kepler-a/`, crédito NASA/Brian E. Kumanchik; NASA/Christian A. Lopez.
- **TESS (A)** — 0,21 MB, `science.nasa.gov/3d-resources/transiting-exoplanet-survey-satellite-tess-a/`, crédito NASA/Christopher R. Meaney.

Já existia: **Deep Space Network 70-meter** (2,22 MB), baixado em sessão anterior.

Total: 7 modelos, ~10,9 MB de GLB, todos com `loading="lazy"` + `reveal="manual"` — nenhum baixado automaticamente pelo visitante.

## Modelos rejeitados / não buscados

Nenhum modelo foi rejeitado por problema de licença ou origem — todos os buscados nesta sessão foram encontrados e baixados com sucesso nas fontes permitidas. Os modelos restantes da especificação (Mars Reconnaissance Orbiter, Galileo, TDRS, e os opcionais Cassini-Huygens, ISS, Juno, SEXTANT/NICER) ainda não foram buscados — ficam para a próxima rodada, um a um, conforme a estratégia definida em `3D-AUDITORIA.md` §7 (não baixar em lote).

## Tamanhos

| Modelo | Tamanho |
|---|---|
| Deep Space Network 70-meter | 2.216.584 bytes |
| Voyager Probe (B) | 1.720.864 bytes |
| Pioneer 10 | 2.049.840 bytes |
| Hubble Space Telescope (A) | 1.694.988 bytes |
| James Webb Space Telescope (B) | 1.004.248 bytes |
| Kepler (A) | 2.003.276 bytes |
| TESS (A) | 206.576 bytes |

Posters: 7 arquivos WebP, 1200×900, 4–44 KB cada.

## Hashes (SHA-256)

- DSN 70m: `36ff56a7a2bfd1c278f6f4774d32128d5931f2c22fe58241d00ee7d1815634bb`
- Voyager: `bd86ded828dd3f459293aee4ffc3cd0998d8db67439317c8299650a1174c3289`
- Pioneer 10: `81443a7fa01cca0dda878cd27692b3307f9c332c4eb8e55a844499d7b350573c`
- Hubble: `e5ba4de15c7d359ac8fa1ab7e286aff42dec09c0fadae3db99252587f39fa384`
- James Webb: `4958e61e5a564f2efcc32cd516b9d36ea0b9bc644f64dbcfe182ce8a422ae526`
- Kepler: `382014d90e2cf3e1f23e931d233547e652fe3629fddfb5acb8a99e2ceb72ff19`
- TESS: `2b82a0191af6f06081368bb59d6cbb63b13ad8f019cd7ad08229e911e5b9ee6a`

Todos verificados contra o arquivo local com `sha256sum` após o download. Detalhe completo em `NASA-3D-ASSET-MANIFEST.md` e na página pública `/explorar/fontes/`.

## Fontes e créditos

- DSN 70m, Voyager, Hubble, James Webb, Kepler, TESS: `science.nasa.gov/3d-resources/`, crédito específico de cada página.
- Pioneer 10: `github.com/nasa/NASA-3D-Resources` — não tem página própria no hub novo; verificado por busca antes de assumir isso (não foi suposição).
- Nenhum modelo de Sketchfab, TurboSquid, CGTrader ou fonte não oficial.

## Páginas alteradas

- `scripts/build-pages.mjs`: `explorarPage()` (Voyager, Pioneer 10 e grid "Como observamos" com Hubble/JWST/Kepler/TESS adicionados, texto de "em catalogação" atualizado a cada rodada); nova `explorarFontesPage()` → `/explorar/fontes/`.
- `src/data/nasa-models.json`: 6 entradas novas (Voyager, Pioneer 10, Hubble, JWST, Kepler, TESS).
- `src/js/render/nasa-model.js`: correção do mecanismo de poster (ver seção "Erros" abaixo) e remoção do hint de interação nativo.
- `src/css/components.css`: novas classes de poster; viewer maior (a pedido do autor); `.explore-instrument-grid`/`.explore-instrument-card` (já existiam desde a auditoria inicial, agora em uso pela primeira vez).
- `src/js/render/shell.js`: não alterado nesta rodada (nav já atualizada em rodada anterior).
- Home (`homePage()`): não precisou de alteração de conteúdo — já usava `nasaModelBySlug("deep-space-network-70m")`; só herdou o CSS maior do viewer.

## Performance

Não executei Lighthouse formal nesta sessão (pendência registrada). Verificação manual:
- Home: só baixa 1 poster (14 KB) por padrão; os 3 GLBs (~6 MB) só entram na rede se o visitante clicar em "Explorar em 3D" em cada seção individualmente.
- `npm run build` sem erro, sem warning novo além do aviso pré-existente de chunk grande (three.js/model-viewer, não relacionado a esta mudança).

## Acessibilidade

- `alt` com título + crédito em todo `<model-viewer>`.
- `<noscript>` com link para a fonte oficial.
- Texto informativo (pergunta, descrição, crédito) sempre presente fora do componente 3D — nunca depende de WebGL/interação.
- Corrigido: hint de "arraste para girar" nativo do model-viewer removido (`interaction-prompt="none"`), já que o próprio botão "Explorar em 3D" já comunica a interatividade — o hint ficava sobreposto ao poster de forma confusa.

## Erros encontrados e corrigidos

1. **Poster não aparecia.** O atributo/propriedade `poster` do `@google/model-viewer@4.3.1` estava correto, mas o navegador nunca chegava a requisitar o arquivo (confirmado via inspeção do shadow DOM: `background-image` nunca era aplicado, mesmo forçando a reatribuição da propriedade). Corrigido renderizando um `<img>` real dentro do slot `poster`, controlado inteiramente pelo nosso próprio CSS — não depende mais do mecanismo interno do componente.
2. **Modelo renderizava em metade da largura do container em `/explorar/`.** Bug pré-existente: o wrapper `explore-section__grid` é um grid de 2 colunas pensado para texto + modelo lado a lado, mas recebia só o bloco do modelo como filho único, então o modelo ocupava só a primeira coluna. Corrigido removendo o wrapper.
3. **Janelas 3D pequenas** (pedido explícito do autor durante a sessão): aumentei `max-height` de 520px para 720px, adicionei `aspect-ratio:16/10` em telas largas, e troquei o container de `/explorar/` de `container--narrow` (760px) para `container--medium` (920px).

## Pendências

- Modelos restantes: Mars Reconnaissance Orbiter, Galileo, TDRS, e os opcionais Cassini-Huygens, ISS, Juno, SEXTANT/NICER.
- Seção "Como os dados viajam" (TDRS + animação SVG relay) da especificação.
- Seção "Como um sensor produz evidência" (Mars Reconnaissance Orbiter, ligação conceitual com documento/testemunho/instrumento/derivado/interpretação) da especificação.
- Cache HTTP longo (`Cache-Control: immutable`) para `/models/*` no Cloudflare — depende de decisão sobre nomes de arquivo versionados/content-hashed.
- Lighthouse antes/depois.
- Teste de acessibilidade com leitor de tela e teste de mobile real (só verificado via CSS/breakpoints herdados do resto do site, não em device físico).
- **Sem deploy.** Todo o trabalho está local em `webnovo/`.
