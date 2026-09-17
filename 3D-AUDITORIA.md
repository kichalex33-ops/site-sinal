# 3D-AUDITORIA

Auditoria prévia à integração da camada 3D (modelos oficiais NASA), conforme
especificação recebida do autor. Feita antes de qualquer download ou edição de
código, como exigido na seção 1 da especificação.

## 1. Arquitetura atual relevante

- **Stack**: SSG próprio (`scripts/build-pages.mjs`) + Vite (`vite.config.js`),
  sem framework de componentes (React/Vue). Páginas são strings de template
  literal geradas em build time, montadas por `src/js/render/shell.js` (layout,
  `<head>`, nav, footer) e `src/js/render/cards.js`/`badges.js` (componentes
  reutilizáveis não-visuais-3D).
- **Home** (`homePage()`, `scripts/build-pages.mjs:55-201`): hero editorial →
  atualizações → casos em destaque → biblioteca audiovisual → PURSUE → coleções
  → método → literário (livro) → apoio. Seção nova de "Sinais e instrumentos"
  (DSN 70m) entraria logo após o hero ou após a biblioteca audiovisual — decidir
  na implementação, mas nunca antes do hero editorial.
- **`/arquivo`**: busca geral (`arquivoPage()`), sem 3D previsto.
- **`/midia`**: biblioteca audiovisual (`midiaPage()`, `midiaDetailPage()`),
  já tem página de detalhe por item com metadados/proveniência — é o padrão
  mais próximo do que `/explorar/[slug]` vai precisar (metadados, crédito,
  fonte, fallback).
- **`/colecoes`**: coleções institucionais (PURSUE, AARO, NARA), sem 3D previsto.
- **`/livros`**: catálogo literário, sem relação com 3D.
- **Design system**: tokens em `src/css/tokens.css` (`--bg #0b0e14`, `--surface
  #161b22`, `--signal #e8541d`, `--muted #8b949e`, fontes Oswald/IBM Plex Mono
  via Google Fonts). Componentes em `src/css/components.css`.
- **Scripts de animação**: `src/js/main.js`, `src/js/render/shell.js`,
  `src/js/home-motion.js`, `src/js/reading.js`, `src/js/comments.js`. **Não há
  Anime.js instalado** (`package.json` só tem `three` e `vite` como deps) —
  a especificação pede para "usar Anime.js já existente no projeto", mas ele
  não existe no projeto ainda. Precisa decidir: instalar Anime.js, ou usar CSS/
  IntersectionObserver puro (já é o padrão atual do site).
- **`three`** (`^0.185.1`) já está instalado, usado por `src/js/starmap.js` e
  `src/js/solarsystem.js` (feature nova, ainda untracked no git) — mapa estelar/
  sistema solar na área literária. A especificação pede **não usar Three.js
  diretamente** para os modelos NASA, e sim `<model-viewer>` (Google/web
  component, baseado em Three.js internamente, mas como custom element).
- **Vite**: build simples (`vite build`), sem SSR. `<model-viewer>` é um Web
  Component — funciona bem com HTML estático gerado, basta importar o pacote
  npm `@google/model-viewer` e referenciar `<model-viewer>` no HTML gerado.
- **Assets**: `public/` é servido estático; `webnovo/public/models/nasa/` é
  o destino correto para os GLBs, seguindo o padrão já usado por
  `public/livro/capa.jpg`, `public/press-kit/`, etc.

## 2. Pontos de integração propostos

- Nova rota `/explorar/` gerada por uma função `explorarPage()` em
  `scripts/build-pages.mjs`, no mesmo padrão das páginas existentes.
- Nova entrada de navegação em `shell.js` (`nav` principal ou secundária —
  a decidir: o comando mestre v2.0 já sugere `LER · ARQUIVO · MÍDIA · LIVROS ·
  BUSCAR` como principal; "Explorar" entraria como mais um item ou dentro de
  um submenu, para não sobrecarregar a barra).
- Seção nova na Home, só com o DSN 70m (conforme regra "não colocar vários
  modelos na Home").
- Novo arquivo de dados `src/data/nasa-models.json` (schema já especificado).
- Novo componente de render (função JS, não classe/React) tipo
  `nasaModelViewer({ model, poster, title, alt, credit, source })` em
  `src/js/render/`, retornando o HTML do `<model-viewer>` + metadados/crédito.

## 3. Riscos

- **Rede/ambiente**: não está confirmado que este ambiente consegue baixar
  arquivos binários de `science.nasa.gov`/`github.com/nasa` (GLBs de até ~8MB
  no caso do Juno). Isso precisa ser testado antes de prometer os 10 downloads.
- **Licença/crédito por modelo**: cada página oficial da NASA tem seu próprio
  texto de crédito (ex: "NASA/JPL-Caltech", "NASA/Ames") — não dá para usar um
  crédito genérico; isso exige abrir cada página de origem individualmente
  antes de gravar `nasa-models.json`, o que multiplica o número de fetches.
  Não posso confirmar de antemão que title/URL exatos citados na especificação
  ("Deep Space Network 70-meter", "Voyager Probe (B)" etc.) correspondem
  exatamente ao nome do arquivo/página atual do hub da NASA — isso precisa ser
  verificado item a item, não assumido.
- **`<model-viewer>` via npm + Vite**: precisa confirmar que o pacote
  `@google/model-viewer` empacota sem exigir CDN externo (a especificação pede
  para evitar CDN quando possível).
- **Peso do projeto**: 10+ GLBs (mesmo lazy) mais os posters WebP aumentam
  bastante o repositório Git (`site-sinal`/`webnovo`); n��o há ainda política
  de Git LFS ou equivalente — arquivos binários de alguns MB cada, versionados
  direto no git, vão inchar o histórico rapidamente.
- **Escopo**: esta especificação (32 seções) é comparável em tamanho ao próprio
  Comando Mestre v2.0 ainda pendente (rotas `/ler`, `/apoio`, reordenação da
  Home). Fazer os dois em paralelo sem prioridade clara arrisca deixar as duas
  frentes pela metade.

## 4. Impacto de performance esperado

- Cada `<model-viewer>` com `loading="lazy"` + `reveal="manual"` não baixa o
  GLB até o clique — custo inicial de página é só o poster (WebP) + o script
  do `model-viewer` (bundle ~200-300KB gzip, carregado uma vez, cacheável).
- Meta explícita da especificação: Home não pode baixar todos os GLBs — só
  precisa entregar 1 poster + o carregamento do `<model-viewer>` sob demanda.

## 5. Dependências necessárias

- `@google/model-viewer` (novo pacote npm).
- Anime.js — **decisão pendente**: instalar de verdade ou usar o que já existe
  (CSS transitions / IntersectionObserver, já usado em `home-motion.js`).
- Nenhuma dependência de Three.js adicional (já está instalado, mas não deve
  ser usado para os modelos NASA nesta fase, conforme a própria especificação).

## 6. Estratégia de lazy loading

- `<model-viewer loading="lazy" reveal="manual" poster="...">` em todos os
  modelos, sem exceção — inclusive o do DSN na Home.
- Botão explícito "Explorar em 3D" dispara `modelViewer.dismissPoster()` (ou
  equivalente) para carregar o GLB só então.
- Nenhum modelo com `auto-rotate` ligado por padrão (regra da especificação).

## 7. Ordem recomendada (adaptada da seção 30 da especificação)

Dado o tamanho do pedido, a implementação será feita em lotes verificáveis,
não tudo de uma vez:

1. **Este documento** (feito).
2. Confirmar se o ambiente consegue baixar um arquivo binário de teste do hub
   da NASA (teste de rede antes de prometer os 10 modelos).
3. Se a rede permitir: baixar e validar **1 modelo** (DSN 70m) ponta a ponta —
   download, hash, metadata, `<model-viewer>` funcionando localmente — antes de
   replicar o processo para os outros 9.
4. Só depois expandir para Voyager e Pioneer (prioridade 1 da especificação).
5. Modelos secundários e opcionais ficam para depois da validação dos 3
   prioritários.

Isso evita gastar o orçamento da sessão baixando 10 arquivos antes de saber se
o pipeline (hash, metadata, componente, rota) está correto.
