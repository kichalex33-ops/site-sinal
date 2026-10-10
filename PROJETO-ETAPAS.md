# SINAL/RUÍDO — Reformulação comercial do site (Etapas 1–6)

Documento vivo. Atualizar a cada etapa: o que foi feito, o que falta, decisões pendentes.

## Regras permanentes

- **Toda etapa vale para português E inglês.** Nada é considerado concluído se só uma das versões foi feita.
  - PT: `/`, `/livro/`, `/livros/sinal-ruido/`, `/livro/amostra/`…
  - EN: `/en/`, `/en/signal-noise/`, `/livro/sample/`…
- Capa SINAL/RUÍDO (`/livro/capa.jpg`) só na versão portuguesa; capa SIGNAL/NOISE (`/livro/capa-en.jpg`) só na inglesa.
- Não inventar informação (avaliações, preços, ISBN, datas). Reutilizar os dados de `src/data/`.
- Preservar a identidade: preto/grafite, papel, laranja (`#e8541d`), estética documental. Sem neon, cyberpunk, cards SaaS.
- O site é só escuro. Um modo claro foi testado em 06/10/2026 e **rejeitado pelo autor** (não combina).
- Páginas de cortesia (`/cortesia/<token>/`) são privadas: só quem tem o link. Nunca listar, indexar nem linkar.
- Regras antigas que continuam valendo: ver `CLAUDE-HANDOFF.md` (sem formulários, sem coleta de dados, ficção separada do arquivo factual).

## Fluxo de trabalho

1. Editar a fonte (`scripts/build-pages.mjs`, `src/css`, `src/js`, `src/data`). Os HTML da raiz são gerados.
2. `npm run build` → saída em `dist/`.
3. Testar (`npx vite preview --port 4173`): desktop, tablet, celular, PT e EN, console sem erros.
4. Publicar: `npx wrangler pages deploy dist --project-name sinalruido --branch main --commit-dirty=true`
   (o Cloudflare Pages **não** está ligado ao GitHub; push não publica).
5. Conferir no ar e fazer commit + push em `kichalex33-ops/site-sinal` (privado), para o repositório ficar igual ao site.

Atenção: antes de 06/10/2026 o site no ar tinha arquivos que não estavam no GitHub (EPUB de cortesia, press-kit). Isso foi sincronizado. Nunca publicar de uma cópia que não esteja igual ao GitHub.

## Status das etapas

| Etapa | PT | EN | Publicado |
|---|---|---|---|
| 1 — Auditoria e correções de base | ✅ | ✅ | ✅ 06/10 |
| 2 — Hero e primeira dobra | ✅ | ✅ | ✅ |
| 3 — Fluxo de desejo e amostra | ✅ | ✅ | ✅ |
| 4 — Prova social, autor e segundo livro | ✅ | ✅ | ⏳ aguardando deploy |
| 5 — Universo sem atrapalhar a venda | ✅ | ✅ | ⏳ aguardando deploy |
| 6 — Polimento final e auditoria | ⏳ | ⏳ | — |

### Etapa 5 — Universo (pronta em 09/10, commit local, não publicada)
- "A história começou antes do romance" (PT/EN): o sinal Wow! em quatro fatos — 15/08/1977, Big Ear (Ohio State), 72 s, 6EQUJ5 — com Jerry Ehman e o "Wow!"; links para o caso e o arquivo.
- Mapa dos Sinais: mantido o chamado curto que já existia logo abaixo.
- "O universo continua": a home mostra só II–IV (antes eram II–X) + botão "Ver os dez livros da coleção" (/livros/) / "See all ten books in the series" (/en/chronicles/). As fichas (dialogs) de todos continuam no HTML.
- "Outras edições": já estava discreto (details fechado) desde a Etapa 4; sem mudança.
- Corrigido: capas esticadas no catálogo da home EN (img com height="480"; CSS agora força height:auto).
- Conferido em print: PT e EN, 1280 px e 390 px.

### Etapa 1 — Auditoria (concluída)
- Status de SINAL/RUÍDO já era "À venda" em todas as páginas, PT e EN. Nenhum "Edição editorial"/"Em desenvolvimento" ligado ao livro.
- Corrigido: og:image da página Christchurch PT usava a capa inglesa; og:image:width/height 1200×630 declarado em capas verticais (agora só na imagem padrão do Arquivo).
- Sincronizado com produção: EPUB de cortesia PT (versão revisada de 01/10, 777 KB), press-kit (bio, sinopse, ficha), link Magonia em https.
- Links Amazon, UICLAP, amostra, imagens, canonical e dados estruturados verificados.

### Etapa 2 — Hero (concluída PT + EN)
- Hero novo: eyebrow, título com "/" laranja, gancho de 3 frases, assinatura, capa grande (~40/60), Comprar Kindle (laranja sólido), Comprar impresso (contorno), Ler 3 capítulos grátis.
- PT: Amazon BR + UICLAP. EN: amazon.com Kindle + paperback.
- Edições internacionais saíram do hero e foram para "Outras edições e idiomas" abaixo da amostra.
- Celular: eyebrow → título → gancho → capa → botões.
- Função única `homeHero(b, lang)`; o hero antigo (`cinematicHero`) foi removido.

### Etapa 3 — Fluxo de desejo e amostra (concluída PT + EN)
- Ordem da Home: hero → ruptura ("O que sabemos…") → Sobre o romance → Leia antes de decidir → Outras edições → rótulos do dossiê → resto.
- Sobre o romance: "O sinal existiu. O resto é onde a história começa." / "The signal existed. The rest is where the story begins."
- Leia antes de decidir: 3 capítulos numerados, "Sem cadastro…", "Ler os 3 capítulos".
- Fim da amostra: "Você chegou ao fim da amostra. Mas o sinal continua." + "Quer saber o que esse sinal trouxe para Henrique, Lara, ARGOS e os demais? Adquira o livro aqui:" + Kindle · Amazon e impresso · UICLAP (EN: Amazon) + "Voltar à página do livro". Retorno duplicado abaixo do leitor removido.
- Leitor da amostra: páginas no tamanho de leitura (~65 caracteres por linha, altura da tela até 860 px), rola até a página ao virar.

### Extras feitos fora das etapas
- Mapa dos Sinais: Sappho Books (Sydney, aguardando foto) e Biblioteca Pública Municipal de Jóia (RS, aguardando instalação).
- Home com a ambiência do site (estrelas, névoa, rastro de pixels no cursor). A amostra continua sem efeitos.
- "/" laranja de SINAL/RUÍDO restaurado no cabeçalho.
- Menu: itens com submenu (Livros/Books, Autor/Author) alinhados aos demais.

### Etapa 4 — Confiança (concluída PT + EN, 09/10, ainda não publicada)
- Avaliações: título "O que ficou depois da leitura" / "What stayed after reading", no máximo 3. Continua oculto enquanto `reviews` estiver vazio (sem placeholders).
- Nova função `homeBooks(b, lang)` substitui a vitrine com sinopse na Home PT (`homeShowcase` sem o ramo "Já à venda") e EN (`englishAvailableBooks` continua só em /en/chronicles/):
  - "Continue o sinal" / "Keep following the signal": capa menor, tagline do livro (dados de `book-sheets`), Kindle, impresso, amostra, ficha;
  - bloco menor de Os Deuses Não Têm Filhos (capa, tagline, Comprar na Amazon, Conhecer o livro). EN: "Currently available in Portuguese."
  - âncoras `/#livros` e `/en/#books` apontam para esse bloco; sem id duplicado com o hero.
- Autor: CTA "Conhecer Alex Jr. Kich" / "Meet Alex Jr. Kich" (vale também nas páginas do livro).
- Testado: desktop 1366 e celular 390, PT e EN, sem erros no console e sem rolagem horizontal.

## Situação em 06/10/2026 (fim do dia)

> Atualização: tudo o que estava pendente foi publicado no deploy `2bc4d729` e conferido no ar. Site e GitHub iguais.

- **No ar** (último deploy `ed0050a0`): Etapa 1, Etapa 2 só em PT, os dois pontos novos do mapa, o leitor da amostra no tamanho de leitura e o fim da amostra com o convite e o ARGOS.
- **No GitHub, mas ainda não publicado** (commit `7e14424`): hero em inglês, Etapa 3 em PT e EN, ambiência na Home, "/" laranja no cabeçalho, menu alinhado e a remoção do modo claro (que nunca chegou a ir ao ar).
  Para publicar: `npx wrangler pages deploy dist --project-name sinalruido --branch main --commit-dirty=true` (depois de `npm run build`).
- **Etapa 4 iniciada e pausada a pedido do autor.** Nenhum arquivo foi alterado. Só foi feita a leitura do código:
  - avaliações: `conversionEditorial()` já lê `src/data/book-conversion.json` (`reviews` com nome, comentário, origem e data, hoje vazio) e não mostra nada quando está vazio. Falta trocar o título para "O que ficou depois da leitura" / "What stayed after reading" e limitar a 3 avaliações iniciais;
  - a vitrine atual (`homeShowcase()` em PT, `englishAvailableBooks()` em EN) mostra SINAL/RUÍDO e Os Deuses Não Têm Filhos com a sinopse completa. Deve virar "Continue o sinal" (capa menor, sem sinopse) e um bloco próprio, menor, para Os Deuses Não Têm Filhos;
  - autor: `authorCompact()` já tem foto e texto lado a lado. Falta o CTA "Conhecer Alex Jr. Kich" / "Meet Alex Jr. Kich".

## Decisões pendentes do autor
- [ ] Página canônica do livro: recomendação `/livro/` (hoje `/livro/` e `/livros/sinal-ruido/` fazem a mesma função e as duas são indexadas).
- [ ] Liberar `/livro/amostra/` para o Google (hoje `noindex`; a amostra EN é indexada).
- [ ] Status de Jóia: "aguardando instalação" ou "aguardando foto".
- [ ] Fotos da Sappho Books e da Biblioteca de Jóia.
- [ ] Corrigir no KDP: paperback/hardcover de SIGNAL/NOISE aparecem como "Portuguese Edition" na amazon.com.

## Próximas etapas (resumo do pedido original)
- **4 — Confiança:** "O que ficou depois da leitura" (só com depoimentos reais em `src/data/book-conversion.json`; sem placeholders), "Continue o sinal" (compra com capa menor), Os Deuses Não Têm Filhos (capa, gancho, CTA), Sobre o autor (foto + texto curto, "Conhecer Alex Jr. Kich").
- **5 — Universo:** "A história começou antes do romance" (sinal Wow!: 15/08/1977, Big Ear, 72 s, 6EQUJ5), Mapa dos Sinais curto, "O universo continua" (destaque + II–IV, link para todas), "Outras edições" discreto.
- **6 — Polimento:** menu (Ler, Livros, Arquivo, Mapa, Autor, Busca), cores, tipografia, espaço, animações, performance, acessibilidade, mobile, funil de usuários A–E, teste final de links, auditoria visual. Sem novas funcionalidades.
