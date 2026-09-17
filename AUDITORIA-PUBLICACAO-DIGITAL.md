# AUDITORIA-PUBLICACAO-DIGITAL

Confronto entre `SINAL_RUIDO_COMANDO_MESTRE_CLAUDE_CODE_PUBLICACAO_DIGITAL.docx` (v2.0,
setembro/2026) e o estado real do pacote `webnovo/` nesta data. Gerado antes de qualquer
edição de código desta rodada, conforme exigido na seção 01 do comando.

## 1. Já feito / aproveitável (não refazer)

- Home com a tríade **"O que sabemos. O que não sabemos. O que ainda falta encontrar."**
  já é a frase central (seção 03/05 do comando cumprida na essência).
- Blocos de Home já incluem: destaque de dossiês, biblioteca audiovisual, PURSUE,
  coleções, método, `/livros/`, apoio via Pix — cobre boa parte da narrativa de scroll
  pedida na seção 05 (falta reordenar/nomear conforme a sequência exata do comando).
- `/livro/amostra/` já tem navegação capítulo a capítulo, controle de fonte, modo de
  leitura e retomada por `localStorage` — cobre quase todos os requisitos da seção 06,
  só falta o texto literal do manuscrito v4.0.1 (ainda pendente de importação) e a URL
  canônica devia migrar para `/ler/` (comando pede essa rota; hoje é `/livro/amostra/`).
- Comentários por capítulo com moderação prévia, sem likes/ranking, Cloudflare Pages
  Function `/api/comments` + D1 + Turnstile já desenhados (`COMMENTS-CLOUDFLARE.md`,
  `schema/comments.sql`) — cumpre seção 07 e 16 na arquitetura; falta ativar em produção
  com credenciais reais (ação manual do proprietário).
- `/arquivo`, `/casos/[slug]`, `/documentos/[slug]`, `/colecoes/[slug]`, `/midia/[slug]`,
  `/metodo`, `/correcoes` existem e seguem a tríade sabemos/não sabemos/falta encontrar,
  níveis de maturidade e separação proveniência/integridade/status — cumpre seção 10.
- Dados já separados em `src/data/*.json` (books, cases, collections, media, corrections,
  updates) — cumpre a intenção da seção 15, com nomes de arquivo levemente diferentes do
  exemplo do comando (`documents.json`/`chapters.json` não existem como arquivos próprios;
  documentos hoje vêm embutidos em `cases.json` e são expandidos no build).
- Build gerado por `scripts/build-pages.mjs` (SSG customizado, sem framework pesado) —
  alinhado com a seção 17/18 (não migrar para React/Next só por preferência).
- Regras de não regressão (`CLAUDE-HANDOFF.md`) já proíbem Gray/glitch/estrelas no núcleo
  factual, formulário público, likes/ranking — coerente com seções 05, 07 e 22.
- `npm run build` local roda limpo nesta auditoria: 80 páginas geradas (76 canônicas + 4
  redirects), sem erro.

## 2. Divergências de arquitetura de informação (seção 04)

| Rota pedida pelo comando v2.0 | Estado atual |
| --- | --- |
| `/ler/`, `/ler/capitulo-01/` etc. | Não existe. Equivalente atual é `/livro/amostra/` (capítulos como seções da mesma página, não rotas próprias). |
| `/livro/` | Existe. |
| `/livros/` | Existe. |
| `/arquivo/`, `/casos/`, `/documentos/`, `/colecoes/`, `/midia/`, `/metodo/`, `/correcoes/` | Existem. |
| `/apoio/` | Não existe como rota própria — apoio hoje é só bloco embutido na Home e em `/livro/`. |
| `/imprensa/` | Existe. |
| `/privacidade/` | Existe. |
| `/casos` como catálogo dedicado (distinto de `/arquivo`) | Ainda não separado (nota já registrada no Documento Mestre v1.2, seção "Nota de implementação"). |

Navegação principal sugerida pelo comando (`LER · ARQUIVO · MÍDIA · LIVROS · BUSCAR`)
ainda não foi conferida/aplicada no shell (`src/js/render/shell.js`) nesta auditoria.

## 3. Pendências explícitas herdadas (já documentadas, ainda válidas)

Do `CLAUDE-HANDOFF.md`:

1. Texto da amostra — manuscrito final v4.0.1 ainda não importado; não usar versão antiga.
2. Capa do romance — arte ainda com nome antigo, precisa homologação separada.
3. Casos brasileiros prioritários (Maria Cintra/Lins 1968, Cláudio/MG 2008, Embornal/
   Baependi 1979) — sem pacote factual auditado, não promover a dossiê revisado.
4. Ingestão documental: PURSUE 01–05, AARO, NARA RG 615, Arquivo Nacional/SIAN, Blue Book
   — ainda em backlog (`BACKLOG-WEB.md`).
5. Maturidade editorial (Nível 1/2/3) — estrutura existe, mas nível NÃO é ainda um campo
   granular por caso (é abordado de forma qualitativa no dossiê, não como badge/status
   dedicado no modelo de dados).

## 4. Itens do comando ainda não auditados a fundo nesta passada

- Motion system (Anime.js/ScrollObserver/AutoLayout/Floating UI/View Transitions,
  seção 13) — hoje o projeto usa JS vanilla (`home-motion.js`, `ambience.js`, `intro.js`,
  `solarsystem.js`, `starmap.js`). Não há Anime.js no `package.json`. Presença de `three`
  (~0.185) para mapa estelar/sistema solar — feature nova (arquivos untracked), preciso
  confirmar se essa ambiência 3D fica restrita à camada literária (permitido) e não vaza
  para o núcleo factual (proibido pela seção 05/22).
- Design system (seção 14): cores `#0B0E14`/`#161B22`/`#E8541D`/`#F3F4EF` — não conferidas
  linha a linha contra `src/css/*.css` nesta auditoria.
- QA de acessibilidade/Lighthouse/CSP/headers (seções 16 e 20) — não executado nesta
  auditoria.
- Deploy real (seção 17): **não há remote git configurado neste checkout** (`git remote -v`
  vazio). O histórico local (`git log`) mostra 3 commits em `master`, com grande volume de
  mudanças não commitadas (rodada dinâmica + comentários) já presente antes desta sessão.
  Não há vínculo automático com Cloudflare Pages a partir deste repositório local.

## 5. Riscos identificados

- Trabalho em andamento (WIP) extenso já estava solto no working tree (não commitado)
  antes desta auditoria — risco de perda se algo for descartado sem cuidado. Não foi
  commitado nem alterado nesta auditoria.
- `three.js` + arquivos de mapa estelar/sistema solar estão **untracked**, ou seja, fora
  de qualquer commit — mesmo risco de perda acidental.
- Ausência de `/ler/` e `/apoio/` como rotas próprias é a maior divergência estrutural
  frente ao comando v2.0; decidir se vale renomear `/livro/amostra/` → `/ler/` (quebra
  URL já indexada, se houver) ou criar `/ler/` como alias novo.

## 6. Ação imediata desta sessão (fora do escopo do comando v2.0)

A pedido do autor, antes de continuar a implementação do comando v2.0, o site público
(`sinalruido.com.br`) deve ser substituído temporariamente por uma página only-fundo +
contagem regressiva de 7 dias, enquanto o trabalho de verdade continua **somente na pasta
local**, sem novo deploy até o autor decidir subir. Essa página está fora das regras da
seção 22 do comando ("não usar contagem regressiva") porque não é um recurso do produto
final — é uma tela de manutenção temporária, não uma técnica de urgência de venda.
Ver `em-breve/` na raiz do projeto e `PLANO-IMPLEMENTACAO-PUBLICACAO.md` para o que vem
depois dela.

**Nota:** este checkout não tem remote git nem credenciais de Cloudflare configuradas.
A publicação da página "em breve" (ou de qualquer build) na Cloudflare Pages depende de
ação manual do autor (deploy manual do diretório, ou push para o repositório que já está
vinculado ao projeto Pages).
