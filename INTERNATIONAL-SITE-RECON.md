# INTERNATIONAL-SITE-RECON

Reconhecimento da base atual para a versão global (SIGNAL/NOISE + Crônicas Cosmológicas). Nada foi alterado, removido ou instalado. Único arquivo criado: este relatório.

Data: 2026-09-25. Projeto: `livro/SINAL _RUIDO/webnovo`.

## 1. Estado atual

### Stack
| Item | Situação |
|---|---|
| Build | Vite 8 (`vite.config.js`), Node 22.16.0, ESM |
| Geração de páginas | `scripts/build-pages.mjs` (96 KB, monolito). `npm run build` = `generate` + `vite build` |
| Dados | JSON em `src/data/` (books, book-sheets, cases, collections, media, noticias, sample-chapters, sample-chapters-en, corrections, updates, starmap, nasa-models) |
| Front | JS vanilla modular em `src/js/`, CSS em `src/css/` (tokens, reset, base, layout, components) |
| Dependências | `three`, `animejs`, `@google/model-viewer` (runtime); `vite`, `glob` (dev) |
| Servidor | Cloudflare Pages Functions: `functions/_middleware.js`, `functions/api/comments.js`, `functions/oauth/callback.js` |
| Deploy | Cloudflare Pages, domínio canônico `https://sinalruido.com.br`, output `dist/` |
| Git | Local, branch `master`, sem remote. 102 arquivos modificados, 7 deletados, 5 novos não rastreados |

### Como o site é montado
- As páginas HTML da raiz (`index.html`, `casos/**`, `livro/**` etc.) são **saída gerada** por `build-pages.mjs` e ficam commitadas. Editar o HTML à mão é perdido no próximo `generate`.
- `write(rota, html)` grava `<rota>/index.html`; `writeStatic()` grava sitemap, robots, `_headers` e `_redirects` em `public/`.
- `clean([...])` apaga pastas de rota antes de regerar (lista fixa na linha ~1385). Rotas novas precisam entrar nela.
- O `vite.config.js` usa `glob("**/index.html")` e vira cada um em entrada de build.
- Cabeçalho, navegação e rodapé vêm de `src/js/render/shell.js` (`page()` e constante `NAV`).
- Mobile: menu hambúrguer (`data-mobile-nav-toggle`), sem sistema separado.
- Busca: `command-palette.js` + `public/search-index.json` (gerado no build).

### Rotas existentes (PT)
`/`, `/livro/`, `/livro/amostra/`, `/livro/sample/` (EN, noindex), `/livros/`, `/livros/<slug>/`, `/arquivo/`, `/casos/` + 21 dossiês, `/documentos/`, `/colecoes/`, `/midia/`, `/noticias/`, `/metodo/`, `/correcoes/`, `/leitores/`, `/imprensa/`, `/contato/`, `/privacidade/`, `/r/*` (redirects de campanha), `/cortesia/<token>/`.

### Internacionalização hoje
- **Não existe** estrutura `/en/`, `hreflang`, seletor de idioma nem `lang="en"`. `page()` fixa `<html lang="pt-BR">`.
- Existe uma amostra em inglês: `/livro/sample/` (3 capítulos em `sample-chapters-en.json`, `noindex,follow`).
- `functions/_middleware.js` troca `capa.jpg` por `capa-en.jpg` quando `request.cf.country != BR`, com override `?capa=en|pt`. É o único mecanismo de região e pode ser reaproveitado para o roteador `/buy/`.
- `buyPanel()` já separa "Português" e "English edition".

### Links Amazon existentes (`src/data/books.json`, item `sinal-ruido`)
| Campo | URL |
|---|---|
| `purchaseUrl` | amazon.com.br `B0HKTBMSJ9` (PT) |
| `purchaseUrlEn` | amazon.com `B0HJP3HM7J` |
| `purchaseUrlEnBr` | amazon.com.br `B0HJP3HM7J` |
| `purchaseUrlEnUk` | amazon.co.uk `B0HJQQBS8Q` |
| `purchaseUrlUiclap` | loja.uiclap.com (impresso PT) |

Os links são duplicados literalmente em `index.html` e `livro/index.html` (gerados por `buyPanel`). Todos rotulados "Ebook".

### SEO hoje
- `<title>`, description, canonical e OG por página via `page()`.
- `sitemap.xml`, `robots.txt`, `_headers`, `_redirects` gerados em `buildSeoFiles()`.
- **Não há** JSON-LD (Book, Person, Article, BreadcrumbList) nem `hreflang`.
- Analytics: nenhum script encontrado (os 2 arquivos que casaram o padrão de busca são texto do romance, ex. "plausible"; não verifiquei linha a linha).

### Formulários
- Comentários moderados (`functions/api/comments.js`, D1, `schema/comments.sql`), só na área literária.
- `contatoPage()` ainda contém formulário Web3Forms com chave embutida no código (`build-pages.mjs:1114`).

## 2. Reaproveitável

| O que | Onde | Uso na versão global |
|---|---|---|
| Tokens visuais (`--bg #0b0e14`, `--signal #e8541d`, papel claro) | `src/css/tokens.css` | DNA visual preto/branco/laranja já pronto |
| Linha laranja funcional | `src/js/hero-signal-line.js` (SVG que atravessa o hero) | Elemento "signal" da brief; hoje só no hero do livro |
| `page()`, `write()`, `NAV` | `shell.js`, `build-pages.mjs` | Base de todas as páginas `/en/*` |
| Amostra EN | `sample-chapters-en.json` + `livroSampleEnPage()` | `/en/sample/` (mover ou redirecionar `/livro/sample/`) |
| Ficha de livro | `book-sheets.json` (synopsis, ambientacao, personagens, temas, ficha) + `livroDetailPage()` | Base das páginas de cada Crônica |
| Dossiês de casos | `cases.json`: já existem `operacao-prato-colares` e `varginha`, com `oQueSabemos`, `oQueNaoSabemos`, `contradicoes`, `fontes`, `maturidade` | Base de `/en/archive/colares/`, `/varginha/` |
| Método editorial | `/metodo/`, níveis de maturidade (Registro, Caso indexado, Dossiê revisado) | Regra de verdade do arquivo global |
| Middleware geo | `functions/_middleware.js` | Pré-seleção de região em `/buy/` |
| Press kit | `public/press-kit/` (sinopse.txt, bio-autor.txt, ficha-tecnica.txt) + `/imprensa/` | Ponto de partida de `/en/media/` |
| Capa EN | `public/livro/capa-en.jpg` | Capa da versão global |

## 3. Conflitos encontrados

### A. Brief x canônico dos livros (`books.json`)
| Brief | Base atual |
|---|---|
| I Os Deuses Não Têm Filhos ... X O Último Sinal (10 títulos) | 8 títulos no lugar; **faltam VIII "O Retângulo Negro" e IX "Não Tem a Palavra"**; `/livros/` mostra card "VIII · IX A anunciar" |
| Sem "A Primeira Morte" | `a-primeira-morte` existe em `books.json` e no cronograma; precisa decidir se sai do site global |
| SIGNAL/NOISE não é Crônica I | `books.json` já o trata como `kind: Romance` separado. Sem conflito, confirmar `numeral` |
| Ordem: I Deuses, II Última Testemunha, III Amanhã, IV Universo, V Arquivo, VI Antes, VII Céu, VIII Retângulo, IX Palavra, X Último Sinal | A ordem dos 8 existentes confere. Falta inserir VIII e IX |

### B. Brief x regras do HANDOFF (`CLAUDE-HANDOFF.md`)
O HANDOFF diz "não reintroduzir Web3Forms, newsletter, lead capture, comentários ou cadastro" e "nenhum formulário público no MVP". O brief pede:
- formulário em `/en/review-copy/` (nome, e-mail, país, tipo);
- seção "Follow the signal" (newsletter futura);
- coleta de dados pessoais.

**Decisão necessária do autor**: a regra do HANDOFF vale só para o arquivo factual PT, ou se estende ao global? Sugestão: review copy por `mailto:`/e-mail dedicado no primeiro momento e newsletter como texto "em breve" sem coleta, até haver política de privacidade em inglês.

### C. Inconsistência já existente
- O HANDOFF diz que Web3Forms e `/contato` foram removidos/convertidos em redirect. O código atual ainda gera `/contato/` com formulário Web3Forms e a NAV aponta para `/contato/`. Estado real diverge do documentado.

### D. Amazon
- ASINs do brief: Kindle `B0HJP3HM7J`, Paperback `B0HJQQBS8Q`, Hardcover `B0HJTSWF6J`.
- Base atual rotula `B0HJQQBS8Q` como **Ebook** em amazon.co.uk. Pelo brief, esse ASIN é **Paperback**. Um dos dois está errado; corrigir antes de publicar o roteador.
- `B0HJTSWF6J` (Hardcover) não existe hoje em nenhum arquivo.
- `B0HKTBMSJ9` (PT, amazon.com.br) não consta no brief e deve ser preservado no site PT.
- O brief lista JP/CA/AU sem hardcover, MX/IN só Kindle. O roteador deve esconder edições sem link (regra do brief).

### E. Sample e homologação
- `/livro/sample/` e `/livro/amostra/` estão `noindex` e fora do sitemap "até homologar o texto final". A capa PT ainda tem o nome antigo na arte (HANDOFF). Publicar `/en/sample/` indexável depende dessas duas decisões editoriais.

### F. Pouco material para "Author" e "Media"
- **Não há foto do autor** em `public/` ou `src/`. Nenhum press release. Bio em `press-kit/bio-autor.txt` (não li o conteúdo).
- "Santa Maria" (brief) **não existe** como caso em `cases.json`. O nome só aparece dentro de textos de `books.json`/`book-sheets.json`/samples (provavelmente referência do romance, não caso documentado). Não criar página factual sem pesquisa.

### G. Casos do brief x `cases.json`
| Brief | Estado |
|---|---|
| Colares / Operation Saucer (Operação Prato) | Existe `operacao-prato-colares` (dossiê) |
| Varginha | Existe `varginha` |
| Brazilian UFO Files | Existe coleção `arquivo-nacional-fundo-ovni` |
| Radio Signals | Existe `sinal-wow` (só um caso; "radio signals" seria agrupador novo) |
| Textos em inglês | **Nenhum caso está em inglês.** Todo o texto factual é PT. Traduzir exige revisão de fontes, não tradução mecânica |

## 4. Duplicações e sujeira

| Item | Problema | Risco |
|---|---|---|
| `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/` (78 `index.html`, 2 MB) | Cópia antiga do projeto dentro dele | **`vite.config.js` só ignora `node_modules` e `dist`**, então esses 78 HTML entram como entradas de build. Pode gerar chaves duplicadas e conteúdo velho no `dist/` |
| `SINAL_RUIDO_A_ULTIMA_TESTEMUNHA_.epub` (4 MB) e `capa_epub_a_ultima_testemunha.jpg` na raiz | Arquivos soltos; o mesmo epub em `public/livro/` foi deletado no working tree | Epub estava público no commit `71c0fb3`; a remoção não está commitada |
| `preview.log`, `.wrangler/` | Temporários | Baixo. `*.log` já é ignorado |
| 15 `.md` de relatório na raiz | Histórico de rodadas | Nenhum; não misturar com este |
| Páginas removidas no working tree (`brinde/`, `explorar/`, `mapa-estelar`, `sistema-solar`) | Deleções não commitadas | Confirmar que são intencionais antes do commit |
| Nomes duplicados no `cortesia` | Token fixo em `CORTESIA_TOKEN` no script | Já coberto na revisão anterior |

## 5. Estrutura sugerida

Mesma stack, mesmo repositório, mesmo build. Sem framework novo.

```
/en/                       home global
/en/signal-noise/          obra de origem (não numerada)
/en/sample/                amostra (mover de /livro/sample/, manter redirect)
/en/chronicles/            Origem + I–X
/en/chronicles/<slug>/     páginas por livro (reusa livroDetailPage)
/en/universe/
/en/archive/               índice
/en/archive/colares/       espelha operacao-prato-colares
/en/archive/varginha/
/en/archive/brazilian-ufo-files/
/en/archive/operation-saucer/  ver nota: mesmo caso que colares (decidir 1 página ou 2)
/en/archive/radio-signals/
/en/why-brazil/
/en/author/
/en/media/
/en/partners/
/en/review-copy/
/en/contact/
/buy/                      roteador região + edição
/signal/  e  /s/           redirects curtos (QR), via _redirects gerado
```

Notas:
- "Operation Saucer" e "Colares" são o mesmo caso (Operação Prato). Sugiro **uma página** `/en/archive/colares/`, com `/en/archive/operation-saucer/` como redirect.
- Cada página de arquivo segue o esqueleto do brief (The case / documented / reported / disputed / unknown / why it matters / in SIGNAL/NOISE / sources). O `cases.json` já tem `oQueSabemos`, `oQueNaoSabemos`, `contradicoes`, `fontes`, `bookNote`, então o esqueleto mapeia quase 1:1.
- Menu global: HOME, SIGNAL/NOISE, CHRONICLES, ARCHIVE, AUTHOR, MEDIA + botão READ / BUY. Novo `NAV_EN` ao lado de `NAV`.

## 6. Arquivos que precisariam ser alterados

| Arquivo | Mudança |
|---|---|
| `scripts/build-pages.mjs` | Funções `enHomePage()`, `enSignalNoisePage()` etc.; incluir `en`, `buy`, `signal`, `s` na lista de `clean()`; entradas em `routes`; sitemap com `hreflang`; `_redirects` com `/signal`, `/s`, `/en/archive/operation-saucer` |
| `src/js/render/shell.js` | `page()` aceitar `lang`, `nav`, `footer` por idioma; `hreflang` alternates; bloco JSON-LD opcional |
| `src/data/books.json` | Campos em inglês (`titleEn`, `tagline`, `numeral`, `status`), decidir `a-primeira-morte`, adicionar VIII e IX, links Amazon por região/formato |
| `src/data/book-sheets.json` | Campos EN (synopsis, setting, characters, question, phenomenon) |
| `src/data/cases.json` | Campos EN só para os casos escolhidos e com fonte verificável |
| `vite.config.js` | Ignorar `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/**` e `.claude/**` |
| `functions/_middleware.js` | Opcional: pré-selecionar região em `/buy/` (já lê `cf.country`) |
| `src/css/components.css` | Blocos novos (linha do tempo das Crônicas, cards de arquivo) |
| `_headers` (gerado em `buildSeoFiles`) | Cache e noindex do que for privado (review copy) |

## 7. Arquivos novos realmente necessários

| Arquivo | Motivo |
|---|---|
| `src/data/buy-router.json` | Matriz região x edição x URL (única fonte para `/buy/`, home e `/en/signal-noise/`); evita URL Amazon espalhada |
| `src/data/pages-en.json` (ou seções equivalentes) | Copy EN de home, universe, why-brazil, author, partners, media. Evita texto EN dentro do script de 96 KB |
| `src/js/buy-router.js` | Lógica de região/edição no cliente (pequeno, sem dependência) |
| `public/en/…` (foto do autor, capa 1200x630 para OG) | Assets que hoje não existem |
| `public/press-kit/` (release, bio longa) | Só quando o autor fornecer o texto |

Nenhum HTML `/en/*` é criado à mão: todos nascem do `build-pages.mjs`. Nenhum `index-new`, `style-copy` ou variante.

## 8. Riscos de regressão

1. **Edição manual de HTML gerado**: será sobrescrita no próximo build. Mudar sempre o script/dados.
2. **Build com a pasta duplicada** entrando no Vite (seção 4). Corrigir o `ignore` antes de qualquer trabalho grande.
3. **`clean()` apagando rotas**: adicionar `en` à lista faz o build recriar tudo; não colocar arquivos manuais em `/en/`.
4. **Rota `/livro/sample/` já publicada**: manter redirect, não quebrar links já enviados.
5. **Middleware de capa**: troca `/livro/capa.jpg` para não-BR em toda página HTML. Em `/en/*` a capa EN já deve ser a padrão para não depender do geo.
6. **Regras do HANDOFF** (sem lead capture, sem estética alien, sem ficção como fato): o global tem de respeitar ou o autor deve revogar explicitamente.
7. **Working tree sujo (114 mudanças)**: qualquer fase nova mistura com mudanças anteriores não commitadas. Commitar ou separar antes.
8. **Fatos em inglês sem fonte**: o `cases.json` tem fontes em PT/oficiais; o texto EN só pode reaproveitar o que já tem fonte.

## 9. Plano em fases

| Fase | Entrega | Depende de |
|---|---|---|
| 0 | Limpeza segura: ajustar `ignore` do Vite; commitar/estabilizar working tree; decidir "A Primeira Morte", VIII e IX; conferir ASIN Paperback x Ebook | Decisões do autor (itens 3.A, 3.B, 3.D) |
| 1 | Infra i18n: `page()` com `lang`/`nav`/`hreflang`, JSON-LD base, `NAV_EN`, `buy-router.json` | Fase 0 |
| 2 | `/buy/` (roteador) + `/signal/` e `/s/` (redirects) | Fase 1 |
| 3 | `/en/` home + `/en/signal-noise/` + `/en/sample/` | Fase 1; homologação da amostra e da capa |
| 4 | `/en/chronicles/` + páginas por livro (só as com ficha pronta, o resto "coming") | `books.json` corrigido |
| 5 | `/en/archive/` + Colares, Varginha, Brazilian UFO Files, Radio Signals | Tradução com fontes verificadas |
| 6 | `/en/author/`, `/en/media/`, `/en/why-brazil/`, `/en/universe/` | Foto do autor, bio final, textos do autor |
| 7 | `/en/review-copy/`, `/en/partners/`, `/en/contact/` | Decisão B (formulários) e política de privacidade em inglês |
| 8 | SEO final: sitemap com hreflang, OG 1200x630, schema Book/Person/Article/Breadcrumb, QA mobile | Fases anteriores |

## 10. Perguntas para o autor antes da Fase 0

1. Regra "sem formulários/newsletter" do HANDOFF vale para o site global? (define review copy e "Follow the signal")
2. `A Primeira Morte` continua no cronograma? Onde entram "O Retângulo Negro" e "Não Tem a Palavra" (VIII, IX)?
3. `B0HJQQBS8Q` é Paperback ou Ebook? (a base atual e o brief divergem)
4. Existe foto do autor e bio longa em inglês? Onde estão?
5. A amostra em inglês e a capa EN já estão homologadas para indexar?
6. "Santa Maria" refere-se a qual caso documentado? Sem isso não há página factual.
7. O `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/` pode ser removido do projeto (é cópia antiga)?

---

# ADENDO 2026-09-25 (rodada 2): decisões do autor e auditoria

Somente inspeção. Nenhum arquivo do projeto foi alterado, removido ou enviado. Extrações temporárias (docx/epub) ficaram na pasta de rascunho da sessão, fora do projeto.

## A. Decisões do autor incorporadas

| Tema | Decisão | Efeito no plano |
|---|---|---|
| Formulários | A regra do HANDOFF vale também para o global. MVP sem formulário, cadastro, newsletter, comentários públicos ou lead capture | Media, Partners, Review Copy e Contact existem como páginas, com contato direto/link. A arquitetura de Review Copy e Partners fica preservada, sem formulário |
| Cortesia | Pode registrar eventos técnicos agregados de acesso/download, sem exigir dados pessoais | Depende da política de privacidade; nada a implementar agora |
| A Primeira Morte | Projeto independente, fora das Crônicas e fora do mapa principal | Não entra em `/en/chronicles/`. Uma área de "obras independentes" só depois de instrução |
| Canônico | Origem + I a X, com VIII = O Retângulo Negro, IX = Não Tem a Palavra | Confirmado pelos 11 docx recebidos (`Cronicas_Cosmologicas_Textos_Site_DOCX.zip`) |
| ASINs | `B0HJP3HM7J` Kindle, `B0HJQQBS8Q` Paperback, `B0HJTSWF6J` Hardcover | Corrige a base atual, que rotula `B0HJQQBS8Q` como Ebook (UK) |
| Santa Maria | Cenário e contexto da obra, não caso documentado | Aparece em Why Brazil, SIGNAL/NOISE, setting e autor. Nenhuma página em THE ARCHIVE sem fonte documental |
| Pasta COMENTARIOS | Não remover ainda; classificar | Ver seção D |
| Repo privado | Sem URL confirmada | Não criar, não trocar remote, não enviar |

## B. Git: estado real

| Item | Valor |
|---|---|
| `.git` existe | Sim |
| `git remote -v` | **Vazio (nenhum remote)** |
| Branch atual | `master` |
| Upstream | Nenhum |
| Stash | 0 |
| Staged | 0 |
| Últimos commits | `71c0fb3` (2026-09-17), `ce0f964` (09-03), `2fd02c7` (09-01), `84ce4cf` (09-01) |

O diretório **não está ligado a nenhum remote**. Os push feitos antes nesta sessão foram para outro projeto (`SINALRUIDOsocial`, worker de posts), em outro repositório local.

## C. CURRENT UNCOMMITTED CHANGES

### C.1 Números reais
| Categoria | Qtde |
|---|---|
| Modificados (unstaged) | 102 |
| Deletados (unstaged) | 7 |
| Não rastreados | 6 (inclui este relatório) |
| Renomeados | 0 |
| Staged | 0 |
| **Total de entradas** | **115** (109 rastreados alterados + 6 novos) |

O "114" citado antes era a contagem sem este relatório. O git avisa "LF será convertido em CRLF" nos 109 arquivos rastreados alterados; parte é ruído de fim de linha.

Diff dos rastreados: +2451 / -2231 linhas. Ignorando fim de linha, 106 dos 109 arquivos ainda têm mudança de conteúdo.

### C.2 Por área
| Área | Arquivos | Natureza |
|---|---|---|
| `casos/` | 22 | HTML **gerado**: novo menu (grupos com submenu) e bloco "Mídia do caso" |
| `documentos/` | 28 | HTML gerado: só o novo menu |
| `midia/` | 22 M + 2 D | HTML gerado: novo menu; links "Voltar ao caso"; remove mapa-estelar e sistema-solar |
| `colecoes/` | 6 | HTML gerado: só o novo menu |
| Páginas de topo (`index`, `livro/`, `livros/`, `arquivo/`, `imprensa/`, `leitores/`, `metodo/`, `noticias/`, `correcoes/`, `privacidade/`, `contato/`) | 13 | HTML gerado |
| `livro/amostra/index.html` | 1 | +785/-498: texto da amostra PT reescrito |
| `explorar/`, `brinde/` | 3 D | Páginas removidas (também saíram do sitemap) |
| **Código-fonte** (`build-pages.mjs` +175/-59, `shell.js` +47/-12, `components.css` +67, `layout.css` +25, `main.js` +1) | 5 | **Mudanças reais de trabalho** |
| **Dados** (`books.json` +58/-22, `sample-chapters.json` +767/-480) | 2 | Mudanças reais |
| `public/` (`_headers`, `sitemap.xml`, `search-index.json`) | 3 | Gerados no build (headers ganham a regra da cortesia; sitemap perde 5 rotas) |
| `public/livro/a-ultima-testemunha.epub` e `capa-a-ultima-testemunha.jpg` | 2 D | Removidos do download público |
| Não rastreados | 6 | `cortesia/`, `public/cortesia/`, `public/livros/`, `src/data/book-sheets.json`, `src/js/hero-signal-line.js`, este relatório |

### C.3 Classificação
**Parecem intencionais (trabalho real)**
- `shell.js`, `build-pages.mjs` e CSS: novo menu com submenus, páginas `/livros/<slug>/`, página de cortesia, "Mídia do caso".
- `books.json`, `book-sheets.json`, `hero-signal-line.js`, `public/livros/`.
- Cortesia (`cortesia/`, `public/cortesia/`, regra em `_headers`).
- Remoção de `explorar/`, `brinde/`, `mapa-estelar`, `sistema-solar` (coerente com o sitemap e com o novo menu, que já não os lista).

**Gerados por build (a maior parte dos 109)**
- Quase todo HTML modificado (~90 arquivos) reflete só a troca do menu. Podem ser regenerados por `npm run generate`. O repo versiona a saída, então o normal é commitar junto com o código que os gerou.

**Suspeitos / a verificar antes de commitar**
1. `livro/amostra/index.html` e `sample-chapters.json` (~770 linhas cada): a amostra PT mudou muito. O HANDOFF diz que só se publica texto **homologado** (v4.0.1) e que a amostra fica `noindex`. Confirmar que este texto é o homologado.
2. Remoção de `public/livro/a-ultima-testemunha.epub` e da capa: o epub estava público desde o commit `71c0fb3`. Confirmar que a remoção é intencional (o arquivo continua na raiz do projeto e no histórico).
3. **O menu ainda tem "Comentários"** (`/livro/amostra/#comentarios`) e existem `functions/api/comments.js`, `comments.js`, `home-comments.js`, `schema/comments.sql` e `COMMENTS-CLOUDFLARE.md`. Conflita com a regra atual "nenhum sistema público de comentários".
4. `/contato/` continua gerando formulário Web3Forms com a chave no código. Conflita com a regra do MVP e com o HANDOFF.
5. `contato/index.html` e `privacidade/index.html` mudaram (+10/-3 e +17/-6): revisar se a política de privacidade já cobre a cortesia.

**Temporários / lixo provável**
- `preview.log` (ignorado por `*.log`) e `.wrangler/` (não aparece no status).
- `.claude/scheduled_tasks.lock`: nenhum arquivo do `.claude` é versionado.

### C.4 Risco de perder trabalho
- **Alto se nada for feito**: 115 mudanças só existem no disco, sem remote e sem commit.
- **Não há stash** nem segunda cópia. O backup mais próximo é o histórico local (4 commits).
- Nenhuma ação destrutiva foi executada. Recomendação: antes de qualquer fase nova, fazer um **commit-checkpoint local** em duas partes (código-fonte e dados; HTML gerado), sem push. Só executo com autorização.

## D. Pasta `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/`

| Verificação | Resultado |
|---|---|
| Rastreada pelo git | Sim: 139 arquivos, adicionada no commit `71c0fb3` |
| Referências fora da pasta (scripts, vite, package.json, functions, src, docs) | **Nenhuma** (as únicas menções são deste relatório) |
| Estrutura | Contém `SINAL_RUIDO_WEB_DINAMICO/`, uma cópia completa do projeto |
| Comparação arquivo a arquivo com a raiz | 45 idênticos, 94 diferentes, **0 exclusivos**: todo arquivo do pacote tem equivalente na raiz |
| Entra no build? | **Sim**: o Vite globa `**/index.html` e inclui 78 HTML desta pasta |
| Deploy | Não é referenciada por `wrangler` nem por Pages; pode sair no `dist/` por causa do glob |

**Classificação: ARCHIVE** (a evidência favorece SAFE TO DELETE, mas sem aprovação não se remove).
- Não é importada nem usada, é versão anterior da própria raiz, e o histórico git (`71c0fb3`) já preserva o conteúdo.
- Ressalva: guarda a documentação do sistema de comentários (`COMMENTS-CLOUDFLARE.md`, `comments.js`, `schema`). Essa documentação também existe na raiz. Se o autor quiser descartar comentários de vez, é a raiz que precisa de refatoração (item C.3.3).
- Ação sem risco imediato: excluir a pasta do glob do Vite (não apaga nada).

Classificação dos demais itens:

| Item | Classe | Motivo |
|---|---|---|
| `build-pages.mjs`, `shell.js`, `src/data/*` | KEEP | Núcleo do site |
| HTML gerado modificado | KEEP (regenerável) | O repo versiona a saída |
| Código de comentários na raiz (`functions/api/comments.js`, `comments.js`, `home-comments.js`, `schema/`, `COMMENTS-CLOUDFLARE.md`) | REFACTOR | Conflita com a regra atual; decidir remover ou desativar |
| Formulário Web3Forms em `contatoPage()` | REFACTOR | Conflita com a regra atual |
| `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/` | ARCHIVE | Ver acima |
| Epub e capa de A Última Testemunha na raiz | KEEP | Trabalho do autor; não entram no build |
| `preview.log`, `.wrangler/` | SAFE TO DELETE (após aprovação) | Temporários |
| `capa_epub_a_ultima_testemunha.jpg` na raiz | KEEP | Pode ainda ser fonte de arte |

## E. Materiais do autor encontrados

Nada foi escolhido como definitivo.

### Fotos
| Achado | Caminho | Avaliação |
|---|---|---|
| **Nenhuma foto do autor identificada** | Varredura de 1.312 arquivos por nome (autor, author, alex, kich, foto, retrato, perfil, profile, headshot) | Só 2 correspondências, e nenhuma é foto do autor: `LIVRO/02_CAPA_KINDLE_..._ALEX_JR_KICH_1600x2560.jpg` (é capa) e `webnovo/public/casos/maria-cintra/contato-fotos-e-desenho-original.webp` (é documento do caso Maria Cintra) |
| Limite da busca | | Só nomes e extensões. Fotos com nome genérico (`IMG_*`, `WhatsApp*`) e imagens dentro de PDF/DOCX **não** foram inspecionadas |

### Bios
| Achado | Caminho | Observação |
|---|---|---|
| Placeholder | `webnovo/public/press-kit/bio-autor.txt` | ~100 bytes: "Bio factual do autor (rascunho) [conteúdo placeholder]". Não é bio |
| **Bio PT (5 parágrafos)** | EPUB de cortesia (`EPUB/text/autor.xhtml`); `sinal ruido capa nova/SINAL_RUIDO final.docx` (linha 10067); `LIVRO/SINAL_RUIDO_CLUBE_DOS_AUTORES_FINAL.docx` (linha 10740) | Mesmo texto nos três. Nasceu em Santa Catarina, vive no Rio Grande do Sul, Licenciatura em Geografia, leituras (Asimov, Tolkien, C. S. Lewis, Sagan), interesse pelo inexplicado, menciona SIGNAL/NOISE e VALANDOR |
| **Bio EN (5 parágrafos)** | `LIVRO/SIGNAL_NOISE_KDP_KINDLE_MANUSCRIPT_FINAL.docx` (seção "ABOUT THE AUTHOR", linha 13477) | Tradução do texto PT, datada de 2026-09-14. É a única bio em inglês encontrada |
| Bio longa e curta separadas | Não encontradas | O brief pede as duas; hoje só existe uma versão |

Pontos editoriais para o autor validar: a bio cita formação, local de nascimento e residência (dados pessoais a confirmar para publicação global) e menciona VALANDOR, que é outro projeto.

## F. Materiais em inglês: amostra, edição e capas

### F.1 Edição inglesa (fonte mais atual)
| Arquivo | Data | Observação |
|---|---|---|
| `LIVRO/SIGNAL_NOISE_KDP_KINDLE_MANUSCRIPT_FINAL.docx` | 2026-09-14 12:11 | Manuscrito EN **completo**: 45 capítulos ("The Bad File" até "From Here"), ~164.000 palavras, com "A Note on Fact and Fiction", dedicatória e "About the Author" |
| `LIVRO/SIGNAL_NOISE_KDP_PAPERBACK_INTERIOR_FINAL.pdf`, `..._HARDCOVER_7x10_INTERIOR_FINAL.pdf` | 09-14 13:27 | Interiores KDP (não abertos) |

### F.2 Amostra em inglês no site
| Item | Situação |
|---|---|
| Fonte | `src/data/sample-chapters-en.json` (2026-09-14), 3 capítulos: "The Bad File", "Known Error", "The Machine Against Itself" |
| Confere com o manuscrito? | Sim: o parágrafo inicial dos 3 capítulos aparece literalmente no manuscrito KDP EN de 14/09 |
| Publicada em | `/livro/sample/`, `noindex,follow`, fora do sitemap |
| "Parts I–II / Chapters 1–16" | **Não encontrada** em JSON, Markdown, HTML ou scripts do projeto. Não pesquisei dentro de PDFs/EPUBs. O manuscrito não tem marcadores "Part" no texto extraído |
| Versões concorrentes | Não há segunda amostra EN. Para o PT há duas gerações (`sample-chapters.json` alterado hoje e o texto de 09/03) |

Conclusão: existe **uma** amostra EN de 3 capítulos, coerente com o manuscrito de 14/09. Não há evidência de que seja a "vigente homologada". **Não indexar.**

### F.3 Capas
| Arquivo | Dimensão | Data | Observação |
|---|---|---|---|
| `webnovo/public/livro/capa-en.jpg` | 1000x1600 | 09-14 | **Idêntica** (mesmo hash) a `LIVRO/signal noise.jpeg`. É a capa EN usada hoje pelo middleware |
| `webnovo/public/livro/capa.jpg` | 1050x1512 | 09-24 | Capa PT do site |
| `sinal ruido capa nova/capa sinal.jpeg` | 1002x1600 | 09-23 | Mais recente que `capa-en.jpg`; não sei se é PT ou EN, nem se substitui a atual |
| `sinal ruido capa nova/SINAL_RUIDO_CAPA_FRONTALdefinitiva.jpg` | 350x504 | 09-23 | O nome diz "definitiva", mas 350 px é miniatura e não serve como master |
| `sinal ruido capa nova/SIGNAL_NOISE_CAPA_COMPLETA_KDP.pdf` | n/a | 09-23 13:01 | Capa completa KDP, **posterior** ao `SIGNAL_NOISE_KDP_PAPERBACK_COVER_FINAL.pdf` de 09-14 |
| `LIVRO/SIGNAL_NOISE_HARDCOVER_COVER.pdf` | n/a | 09-14 | Capa dura |
| `livro/capa-antiga-backup.jpg` | 1024x1536 | 09-24 | Backup da capa antiga |
| `LIVRO/02_CAPA_KINDLE_..._1600x2560.jpg` | 1600x2560 | 09-02 | Versão anterior (HANDOFF: arte com nome antigo) |
| `livro/livros novos/Cronicas_Cosmologicas_capas_tratadas (1)/...zip` | 28 MB | 09-24 | Capas das Crônicas (não aberto) |

Capa internacional vigente: **indeterminada**. Candidatas em ordem de data: `SIGNAL_NOISE_CAPA_COMPLETA_KDP.pdf` (09-23), `capa sinal.jpeg` (09-23) e `capa-en.jpg` (09-14). O autor precisa apontar qual é a atual antes de qualquer uso no site global.

## G. Cortesia: estado

| Item | Situação |
|---|---|
| Página | `cortesia/55okhxeexdf9m1/index.html`, gerada por `cortesiaPage()` (token fixo em `CORTESIA_TOKEN`) |
| Arquivo | `public/cortesia/55okhxeexdf9m1/SINAL_RUIDO_cortesia.epub`, 494 KB, hash idêntico ao original de 09-23 |
| Conteúdo do epub | Edição **PT** completa (47 xhtml: capítulos e "Sobre o Autor"), `language pt-BR`, copyright "Todos os direitos reservados" nos metadados, uma imagem (capa, 102 KB) |
| Proteção atual | `noindex` no HTML, `X-Robots-Tag` e `Cache-Control: private, no-store` em `_headers`, fora do sitemap |
| **Lacuna: EPUB com URL direta** | O epub fica em `/cortesia/<token>/SINAL_RUIDO_cortesia.epub`, sob o mesmo token e sem senha. O token é a única barreira; o requisito "sem URL pública facilmente descoberta" só se cumpre enquanto o token não vazar |
| `robots.txt` | `Allow: /` sem bloquear `/cortesia/`. O `X-Robots-Tag` cobre a indexação, mas o caminho aparece como permitido |

Requisitos pendentes (texto **não** implementado, aguardando a versão aprovada):
1. Texto de divulgação. Hoje a linha 90 diz "Por favor, não divulgue este link publicamente".
2. Prévia do link (OG): hoje "Página privada de cortesia", com imagem 1050x1512 declarada como 1200x630.
3. Aviso de direitos: cópia fornecida para avaliação e conhecimento do projeto, sem redistribuição pública, em tom não ameaçador.
4. Aviso "não divulgue": conciliar com o pedido de divulgação do e-mail (divulgar o livro, não o arquivo).

Nota: a cortesia é a edição PT. Para o público internacional do e-mail, decidir se haverá EPUB EN de cortesia (a fonte existe: o manuscrito KDP EN).

## H. Conflito entre a arquitetura global e o HANDOFF

| Ponto do brief global | Regra atual | Resolução |
|---|---|---|
| Review Copy com formulário | Sem formulário | Página sem formulário; contato direto |
| "Follow the signal" (newsletter) | Sem newsletter | Bloco informativo sem coleta, ou omitir |
| Partners com "discutir parceria" | Sem coleta | Botão de e-mail/link |
| Author photo e press | Sem material homologado | Estrutura pronta, conteúdo depois |
| Nav global com "Media" | Já existe `/imprensa/` | Reaproveitar |
| Comentários na amostra | Regra nova: nenhum | O global **não** herda a seção; o PT precisa de decisão (item C.3.3) |
| Amostra EN indexável | `noindex` até homologar | Manter `noindex` até validar |
| Casos EN sem fonte | Nível 3 exige auditoria factual | Só Colares e Varginha, e só com as fontes já em `cases.json` |
| Santa Maria | Cenário, não caso | Fora de THE ARCHIVE |
| A Primeira Morte fora das Crônicas | `books.json` a inclui ao lado das Crônicas | Tirar do conjunto Crônicas na versão global (o PT fica como está até decisão) |

## I. Proposta de execução segura (nada é tocado até autorização)

| Fase | Ação | Risco |
|---|---|---|
| 0a | **Checkpoint local**: 2 commits (código e dados; HTML gerado), sem push. Sem stash, reset ou clean | Baixo. Preserva o trabalho |
| 0b | Excluir `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/**` e `.claude/**` do glob do Vite (não apaga arquivos) | Baixo |
| 0c | Decisões do autor: qual capa EN é vigente; qual bio e foto; comentários e Web3Forms no PT; epub de cortesia EN | Nenhum (só decisão) |
| 1 | Infra i18n e `buy-router.json` com o mapa de ASIN correto | Baixo |
| 2 | `/buy/`, `/signal/`, `/s/` | Baixo |
| 3 | Home, SIGNAL/NOISE, sample (noindex) | Médio: depende de capa e amostra validadas |
| 4 | Crônicas I–X a partir dos 11 docx, fichas em inglês, com as seções "A face do Arquivo" e "Lugar dentro da coleção" sinalizadas para revisão de spoiler | Médio: tradução e spoilers |
| 5 | Arquivo: Colares e Varginha (fontes do `cases.json`) | Médio: fatos |
| 6 | Author, Media, Why Brazil, Universe | Médio: dados pessoais e foto |
| 7 | Review Copy, Partners, Contact **sem formulário** | Baixo |
| 8 | SEO (hreflang, JSON-LD, sitemap) | Baixo |
| Cortesia | Textos 1 a 4 após a versão aprovada; robots e proteção do epub | Independente do global |
| Repo | Quando o autor fornecer a URL privada: `git remote add` e primeiro push das duas partes do checkpoint | Nenhum antes da URL |

## J. Pendências para o autor

1. Qual é a capa internacional vigente (`capa-en.jpg`, `capa sinal.jpeg` ou a capa completa KDP de 09-23)?
2. Existe foto do autor com nome genérico ou dentro de outro arquivo? Onde?
3. A bio EN de "About the Author" (KDP, 09-14) pode ser a base? Precisa de versão curta e longa?
4. Comentários e Web3Forms no site PT: remover ou manter?
5. O texto da amostra PT alterado hoje (`sample-chapters.json`) é o homologado v4.0.1?
6. A remoção do epub de A Última Testemunha em `public/livro/` é intencional?
7. Autoriza o checkpoint local em dois commits, sem push?
8. Vai haver EPUB de cortesia em inglês?

## K. Atualização (respostas do autor, 2026-09-25)

| Tema | Resposta | Consequência |
|---|---|---|
| Foto do autor | Será disponibilizada futuramente | Página do autor só com estrutura |
| Manuscrito EN | O correto tem **38 capítulos**; o autor deixará a versão certa numa pasta e avisará | **A análise F.1/F.2 usou um manuscrito de 45 capítulos (KDP 14/09) e deve ser refeita** quando a pasta chegar. A conclusão de que a amostra de 3 capítulos "confere com o manuscrito" vale só para aquele arquivo |
| Capa vigente e amostra EN | Ficarão na mesma pasta do manuscrito | Tabela F.3 será substituída pela capa apontada pelo autor |
| Cortesia | Versão PT agora; as outras línguas quando houver tradução | Sem EPUB EN de cortesia por enquanto |
| Comentários e formulário | "Deixe só contatos" | **Executado** no site PT: menu sem "Comentários", amostra e home sem seção de comentários, `/contato/` sem formulário (só Instagram e Imprensa), privacidade ajustada. Nenhum e-mail foi inventado; não há e-mail cadastrado no projeto |

Pendências criadas por essa limpeza:
1. **Instagram bot aponta para `/brinde/`** (`SINALRUIDOsocial/cf-worker/src/index.ts:143`: "Seu brinde está aqui: https://sinalruido.com.br/brinde/"). A página `/brinde/` foi removida do site (checkpoint 2). Se o site for publicado assim, quem comentar "Sinal" recebe um link 404.
2. O backend de comentários continua no repositório e seria publicado: `functions/api/comments.js`, `comments-config.js`, `schema/comments.sql`, `COMMENTS-CLOUDFLARE.md`. Só a interface foi removida.
3. Sem e-mail público de contato: `/contato/` usa Instagram e Imprensa. Quando o autor definir um e-mail, entra como link `mailto:`.

## L. Execução 2026-09-25: /brinde/, legado de comentários, fundação de idiomas e /buy/

Nada foi publicado e nada foi enviado ao GitHub. O commit `7562d9d` foi preservado; a faxina está em `62ca177` (tag `pre-faxina` = `7562d9d`). Os quatro arquivos de "A Última Testemunha" (`SINAL_RUIDO_A_ULTIMA_TESTEMUNHA_.epub`, `capa_epub_a_ultima_testemunha.jpg`, `public/livro/a-ultima-testemunha.epub`, `public/livro/capa-a-ultima-testemunha.jpg`) continuam fora dos commits e não foram tocados. Eram quatro, não dois.

### L.1 /brinde/ (recriada)
| Item | Situação |
|---|---|
| Rota | `/brinde/`, gerada por `brindePage()` em `scripts/build-pages.mjs`; volta ao sitemap |
| Bot do Instagram | `SINALRUIDOsocial/cf-worker/src/index.ts:143` continua apontando para `https://sinalruido.com.br/brinde/`; o link volta a resolver quando o site for publicado |
| Conteúdo | Boas-vindas curtas, amostra (`/livro/amostra/`), livro (`/livro/`), Crônicas (`/livros/#cronicas`), Instagram e "Onde comprar" (reusa `buyPanel`, mesma fonte de links do resto do site) |
| Não tem | Formulário, EPUB, benefício inventado. Não redireciona para `/cortesia/` |
| Diferença para a cortesia | `/brinde/` é público e indexável; `/cortesia/` segue noindex, fora do sitemap, sem link público |

### L.2 Legado de comentários
Auditoria (fontes, exceto `node_modules`, `dist`, histórico do git):
| Item | Resultado |
|---|---|
| `functions/api/comments.js`, `schema/comments.sql`, `public/comments-config.js`, `COMMENTS-CLOUDFLARE.md`, `src/js/comments.js`, `src/js/home-comments.js` | Sem imports nem referências ativas; **removidos** no commit `62ca177` |
| `functions/` hoje | Só `_middleware.js` (troca de capa por país) e `oauth/callback.js` (repassa o `code` do OAuth do Instagram para `localhost:8787`). Nenhum tem relação com comentários; **preservados** |
| CSS órfão (`.reader-comment*`, `.comment-form*`, `.comment-honeypot`, `.comment-muted`, `.home-comments__list`) | **Removido** (20 linhas). As classes `.home-comments-support*` ficam: pertencem ao bloco do Pix |
| Documentos históricos que ainda citam comentários (`AUDITORIA-PUBLICACAO-DIGITAL`, `HOME-PUBLICACAO-RELATORIO`, `HOME-REDESIGN-PLANO`, `PLANO-IMPLEMENTACAO-PUBLICACAO`, `PRE-PRODUCAO-RELATORIO`) | Mantidos como registro histórico. `IMPLEMENTADO-DINAMICO.md` foi corrigido |
| Web3Forms, Turnstile, formulários antigos | Nenhuma referência no `dist/` (todas as páginas e assets) |
| Pasta local `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/` | O git já a removeu (139 arquivos); ficou a pasta no disco com resíduos não rastreados. A inspeção foi bloqueada pelo sistema; não foi lida nem removida. Decisão do autor |
| D1 e cron | Nenhum binding, cron, migration ou `wrangler.toml` neste projeto referencia a tabela de comentários. Se existir tabela no D1 remoto do Cloudflare, ela não é gerida por este repositório |

### L.3 /contato/ e privacidade
- `/contato/`: sem formulário; só Instagram `@sinal_ruido` e Imprensa. Nenhum e-mail inventado.
- Privacidade: sem mudança além da rodada anterior. Nenhum resíduo de Web3Forms, comentários ou Turnstile no HTML gerado.

### L.4 Fundação de idiomas (locale != mercado)
Nenhuma tradução, nenhuma página vazia. Locale com status `planned` não gera rota.

| Arquivo (novo) | Função |
|---|---|
| `src/data/locales.json` | pt-BR (live), en-US, en-GB, es, fr, it, de (planned), cada um com `htmlLang`, `ogLocale`, `path`, `status` |
| `src/data/markets.json` | 12 mercados (US, UK, DE, FR, ES, IT, NL, JP, CA, MX, AU, IN) com domínio Amazon, locale padrão e edições com link conhecido |
| `src/data/buy.json` | ASINs e rótulos das edições: Kindle `B0HJP3HM7J`, Paperback `B0HJQQBS8Q`, Hardcover `B0HJTSWF6J` |
| `scripts/i18n.mjs` | `buyLinks()`, `hreflangAlternates()`, `localeForMarket()`, `validateI18n()`; o build falha se houver ASIN inválido, edição sem ASIN ou locale inexistente |

Alteração em `src/js/render/shell.js`: `page()` ganhou `lang`, `ogLocale`, `alternates` (hreflang) e `minimal`. Com os valores padrão, **as 96 páginas atuais saem idênticas byte a byte** (confirmado: só mudaram `index.html` e `livro/index.html`, pela correção L.6).

Escolhas que dependem do autor (marcadas com `localeFallback: true` em `markets.json`): NL, JP, CA, AU e IN não têm locale dedicado; o padrão proposto é en-GB (NL, AU, IN) e en-US (JP, CA). O path de en-GB (`/en-gb/`) também é proposta; o brief só definia `/en/`.

### L.5 /buy/
| Item | Situação |
|---|---|
| Rota | `/buy/`, `buyPage()`; dados de `markets.json` e `buy.json` |
| Estrutura | Chips de região (âncoras) + uma seção por mercado com as edições disponíveis; funciona sem JavaScript |
| JS | `src/js/buy-router.js` (~20 linhas): destaca o mercado sugerido por `?market=xx` ou pela região do idioma do navegador. Não grava nem envia nada |
| Links | 29 links; o HTML gerado bate exatamente com a lista fornecida pelo autor. Edição sem link conhecido não aparece (JP/CA/AU sem Hardcover; MX/IN só Kindle) |
| Indexação | `noindex,follow` e fora do sitemap até a versão global ser validada |
| Casca | `minimal: true` (cabeçalho e rodapé enxutos, `lang="en"`), sem capa: a capa internacional ainda não foi homologada |
| Brasil | Não há mercado BR aqui (a lista do autor não tem); há um link para a edição em português (`/livro/`) |

### L.6 Correção encontrada: rótulo do link da Amazon UK
O link `amazon.co.uk/dp/B0HJQQBS8Q` aparecia como "Ebook". Pelo mapa do autor, `B0HJQQBS8Q` é Paperback. Rótulo corrigido em `buyPanel()`; afeta `index.html` e `livro/index.html`. O link em si não mudou.

### L.7 Achado extra: o site não tinha página 404
No Cloudflare Pages, sem `404.html` o projeto é tratado como SPA e todo endereço inexistente devolve a home com status 200. Isso escondia links quebrados (por exemplo o `/brinde/` removido) e é ruim para SEO. Foi criada `404.html` (gerada por `notFoundPage()`, `noindex`, fora do sitemap) e o `vite.config.js` passou a incluí-la no build. Reversível: apagar a função e a linha do glob.

### L.8 Build e verificações (`npm run build`, saída 0, sem erros)
| Verificação | Resultado |
|---|---|
| Páginas em `dist/` | 98 (`index.html`) + `404.html` |
| 404 | `dist/404.html` existe, `noindex`, conteúdo correto |
| /brinde/ | Existe; título "Brinde · SINAL/RUÍDO"; link para a amostra; sem formulário, sem EPUB, sem `/cortesia`; no sitemap |
| /buy/ | Existe; `lang="en"`; `noindex`; 29 links Amazon únicos; fora do sitemap |
| Comentários | 0 ocorrências de `comment-form`, `data-comments`, `/api/comments`, `comments-config` no `dist/` |
| Web3Forms / Turnstile | 0 ocorrências |
| Backend de comentários exposto | Não: `dist/` sem `api/comments`; `functions/` só tem `_middleware.js` e `oauth/callback.js` |
| Regressão nas páginas PT | Só `index.html` e `livro/index.html` mudaram (rótulo Paperback) |

Limite desta verificação: foi feita sobre o `dist/` local. Não foi testado o comportamento real do Cloudflare Pages (status HTTP do 404 e o `_middleware` em produção), porque nada foi publicado.

### L.9 Pendências
1. Decidir o destino da pasta residual `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/` no disco.
2. Confirmar locales padrão de NL, JP, CA, AU, IN e o path de en-GB.
3. Aguardar a pasta do autor com o manuscrito de 38 capítulos, a capa e a amostra em inglês (seção K): a análise F.1 a F.3 continua a refazer.
4. Foto do autor: apenas espaço/estrutura, ainda não criado (a página do autor faz parte da arquitetura global, próxima etapa).
5. `/brinde/` promete "os três primeiros capítulos": vale conferir se a amostra PT alterada (`sample-chapters.json`) é a homologada v4.0.1.
6. Os quatro arquivos de "A Última Testemunha" seguem fora dos commits.
7. Publicação: nada foi deployado; o bot do Instagram só volta a funcionar quando o site for publicado.

## M. Pasta `F:\SINAL_RUIDO\sinal final` (2026-09-25) e decisões confirmadas

Somente análise; nada da pasta foi copiado para o projeto.

### M.1 Decisões confirmadas pelo autor
| Tema | Decisão |
|---|---|
| Pasta `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/` (resíduo no disco) | O autor a apaga |
| Idioma padrão dos mercados sem locale próprio | Confirmado: NL, AU, IN = en-GB; JP, CA = en-US; en-GB em `/en-gb/` (`markets.json` atualizado) |

### M.2 Conteúdo da pasta
| Arquivo | O que é |
|---|---|
| `SINAL_RUIDO_1EDICAO_FINAL.docx` (507 KB, 09-25 10:38) | **Edição em português, "1ª edição · 2026"**, ~140.900 palavras, ISBN 978-65-02-34537-5, **38 capítulos** (sumário 1 a 38: de "O arquivo ruim" a "Detecção confirmada") |
| `WhatsApp Image 2026-09-22 at 16.54.55.jpeg` (1149x1368) | Retrato em preto e branco com detalhe laranja. Tratado como a foto do autor, conforme informado por ele |
| `todas as capas e contracapas/1.png ... 23.png` (1410x2250 cada) | 11 capas frontais e 12 contracapas, todas em português |

Não há nessa pasta: manuscrito em inglês, amostra em inglês nem capa internacional (SIGNAL/NOISE).

### M.3 Manuscrito de 38 capítulos = a edição em português
- O manuscrito "correto" de 38 capítulos é esta edição PT. O KDP em inglês analisado antes (45 capítulos, 14/09) é uma estrutura anterior.
- Prova: os capítulos 1 a 3 da edição PT são "O arquivo ruim", "Sinal", "O estatuto". Os capítulos 2 e 3 da amostra em inglês publicada (`/livro/sample/`) são "Known Error" e "The Machine Against Itself", que não existem na edição de 38 capítulos. O "The Charter" do sumário EN antigo (posição 8) corresponde a "O estatuto" (posição 3).
- **A amostra em inglês do site está desatualizada em relação à edição final.** Ela continua publicada como `noindex`. Recomendação: retirar `/livro/sample/` e o link "Read sample" do painel em inglês até existir a tradução da edição de 38 capítulos.
- Consequência: as seções F.1, F.2 e F.3 acima ficam **substituídas**. A edição em inglês correta ainda não foi entregue.
- Existe outra cópia do docx final em `livro/sinal ruido capa nova/SINAL_RUIDO final.docx` (09-23), **diferente** (hash distinto, 197 linhas a menos na nova, muitos parágrafos alterados). A de 09-25 é a mais recente; a de 09-23 é versão antiga.

### M.4 Amostra em português (pergunta 5 respondida)
Comparei parágrafo a parágrafo `src/data/sample-chapters.json` com o docx final de 09-25:
| Capítulo | Parágrafos idênticos |
|---|---|
| 1. O arquivo ruim | 302 de 302 |
| 2. Sinal | 269 de 269 |
| 3. O estatuto | 225 de 225 |

A amostra publicada é literalmente o texto da edição final de 09-25. O `/brinde/` pode prometer "os três primeiros capítulos". A amostra continua `noindex,follow` (regra do HANDOFF); liberar indexação é decisão do autor.

### M.5 Capas
| Arquivos | Conteúdo |
|---|---|
| 1 | Origem: SINAL/RUÍDO (frente) |
| 3, 5, 7, 9, 11, 13, 15, 17 | Crônicas I a VIII (frentes) |
| 20, 22 | Crônicas IX e X (frentes) |
| 2, 4, 6, 8, 10, 12, 14, 16, 18, 19, 21, 23 | Contracapas. O pareamento de 18, 19 e 21 com as frentes VIII, IX e X não é óbvio: a ordem numérica muda a partir da VIII |

Pontos de atenção:
1. **Capa II (`5.png`): faixa branca de ~40 px na borda inferior** (linhas y=2210 a 2249, RGB 255,255,255; o resto é preto). Defeito visível, corrigir antes de usar.
2. Todas as capas têm título em português. A capa da Origem mostra "SINAL RUÍDO" e o lema "Nem todo sinal quer ser ruído". Não é a capa internacional SIGNAL/NOISE.
3. As frentes de VIII, IX e X trazem elementos que o autor deve validar quanto a spoiler (ex.: texto bordado no travesseiro da VIII).

### M.6 Foto do autor
Arquivo único, 1149x1368, exportado do WhatsApp (compressão do aplicativo). Serve para a página do autor; para o press kit convém o arquivo original de maior resolução. Não foi copiada para o projeto nem usada em nenhuma página. Falta o autor confirmar que esta é a foto definitiva e a atribuição/crédito.

### M.7 Pendências atualizadas
1. Entregar o manuscrito, a amostra e a capa **em inglês** da edição de 38 capítulos.
2. Decidir sobre retirar a amostra em inglês antiga (`/livro/sample/`).
3. Corrigir a faixa branca da capa II.
4. Confirmar a foto do autor (definitiva? original em alta? crédito?).
5. Apagar a pasta residual `SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/` (autor).
6. Os quatro arquivos de "A Última Testemunha" seguem fora dos commits.

## N. Capa internacional recebida (2026-09-25)

| Item | Situação |
|---|---|
| Arquivo | `F:\SINAL_RUIDO\sinal final\DIGITAL_BOOK_COVER.jpg`, 1600x2560, 696 KB, 09-25 11:53 |
| Conteúdo | "SIGNAL NOISE", lema "Not every signal wants to be heard", "Alex Jr. Kich", radiotelescópio e feixe laranja |
| Diferença para a anterior | Arte nova (hash distinto de `capa-en.jpg` de 09-14 e de `capa sinal.jpeg` de 09-23) |
| Uso no site | Reduzida para 1000x1600 (191 KB, mesma proporção 0,625) e gravada em `public/livro/capa-en.jpg`, o caminho que o `_middleware.js` já usa para visitantes de fora do Brasil. Nenhuma página HTML mudou |
| Master | Permanece em `sinal final/`; não foi copiada para o projeto |

Substitui a lista da seção F.3: a capa internacional vigente é esta.

Manuscrito em inglês: ainda em tradução pelo autor (edição de 38 capítulos). Continuam sem uso o manuscrito KDP de 45 capítulos e a amostra em inglês antiga (`/livro/sample/`, `noindex`), que segue publicada e desatualizada até decisão do autor.
