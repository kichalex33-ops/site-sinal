# Atualização de conversão — SINAL/RUÍDO

Data: 5 de outubro de 2026.

## ALTERADO

- Fonte das páginas: `scripts/build-pages.mjs`. Componentes reutilizados: botões, painel de lojas, vitrine, catálogo, ficha de livro, amostra, compartilhamento e retrato do autor.
- Fonte de catálogo: `src/data/books.json`; os dois livros com links de compra agora têm status “À venda”. Os status das obras futuras foram preservados. A informação de 687 páginas se refere exclusivamente ao Kindle de SINAL/RUÍDO e veio da ficha técnica existente.
- Conteúdo futuro: `src/data/book-conversion.json`, com listas vazias de avaliações e imprensa. A ausência de registros mantém as seções ocultas.
- Estilos: `src/css/components.css`; layout móvel, áreas de toque, foco, contraste, rótulos de lojas e CTA inferior nas páginas de livros disponíveis.
- Interações: `src/js/main.js` (compartilhamento), `src/js/reading.js` (abas por teclado), `src/js/reveal.js` (leitura visível e movimento reduzido), `src/js/conversion.js` (eventos condicionados ao consentimento).
- Páginas regeneradas: home; `/livro/`; `/livro/amostra/`; fichas em `/livros/`; `/leitores/`; índices e fichas em inglês; páginas que reutilizam links de lojas, como autor e compra internacional; índice público de busca. Nenhuma rota pública foi removida.
- Schema Book nas fichas dos livros disponíveis, incluindo título, autor, idioma, imagem, descrição e URL. Metadados de compartilhamento e canonical permanecem no gerador existente.

## CORRIGIDO

- Status “Edição editorial” / “Em desenvolvimento” conflitavam com os links de compra dos livros publicados.
- O fim da amostra exigia voltar ao livro para comprar.
- O cabeçalho sobrepunha controles nas telas pequenas; idioma continua acessível no menu móvel.
- A animação de revelação podia deixar a leitura invisível depois de saltar entre capítulos. A amostra foi excluída desse efeito, e o movimento reduzido é respeitado.
- Rótulos de loja e texto de preço podiam ultrapassar os cards.
- Retorno da amostra recebeu contraste adequado sobre o papel claro.
- Compartilhar usa o canonical, oferece cópia do link e respeita o cancelamento da Web Share API.
- A amostra usa uma única heading principal e abas com setas, Home/End e relações ARIA.

## CONVERSÃO

- Home começa com capa, premissa solicitada, autoria e três escolhas claras: comprar Kindle, comprar impresso e ler três capítulos grátis.
- Informações de formato, idioma, plataformas e páginas conhecidas aparecem próximas à compra. “Ver preço na loja” substitui preços fixos.
- “Este livro é para você se…” e sinopse curta antecedem o conteúdo aprofundado.
- Livros disponíveis antecedem arquivo, mapa e coleção futura. As URLs e os diálogos existentes continuam acessíveis.
- A conclusão da amostra oferece compra Kindle e UICLAP imediatamente, com retorno secundário.
- Fichas dos livros disponíveis incluem autor compacto, compartilhamento e compra persistente discreta no celular. O CTA inferior fica oculto com menu/diálogo aberto e não existe na amostra; há espaço reservado para não cobrir o conteúdo.
- Avaliações e imprensa são módulos editoriais preparados, sem depoimentos ou participações inventadas.

## ANALYTICS

Não foi encontrado provedor de analytics nem gerenciador de consentimento na fonte do projeto. Nenhuma ferramenta adicional foi instalada. Os eventos estão preparados e testados como ponte local, mas NÃO há armazenamento de estatísticas ou painel ativo em produção.

Eventos: `view_book`, `start_sample`, `finish_sample`, `click_buy_kindle`, `click_buy_print`, `click_book_store`, `view_author`.

Campos: `book_id`, `book_title`, `store`, `format` e `page`, quando aplicáveis. O caminho exclui query string, e nenhum dado pessoal é coletado. O formato de Os Deuses Não Têm Filhos não foi presumido: seu clique recebe `click_book_store`, com formato não especificado.

A integração deve ouvir `sinalruido:analytics` e encaminhar o evento ao provedor escolhido somente depois de consentimento real. Para informar consentimento, o gerenciador deverá emitir `sinalruido:consent` com `detail.analytics` igual a true ou false. A ponte também respeita Do Not Track e Global Privacy Control. Os cliques usam captura síncrona e não aguardam requisição para abrir a loja.

Os testes em `qa-conversion/check.mjs` verificam ausência de emissão antes do consentimento, emissão de compra e visualização depois do consentimento, revogação e fim da amostra. Os resultados locais não representam dados reais de visitantes.

## CONTEÚDO FUTURO

Em `src/data/book-conversion.json`, adicionar avaliações reais à lista `reviews` com `book_id`, `name`, `comment` e, opcionalmente, `origin` e `date`. Adicionar registros reais à lista `press` com `book_id`, `title` e `url` HTTPS. Regenerar e publicar o site para exibir o conteúdo.

## PENDÊNCIAS

- Publicação concluída em 05/10/2026, no Cloudflare Pages, projeto sinalruido, branch de produção main. Domínio: https://sinalruido.com.br. Deploy: https://ab64320c.sinalruido.pages.dev. Reutilizada a sessão Cloudflare e a ferramenta Wrangler já armazenada no computador, sem instalação de pacote. O projeto usa publicação direta, sem integração automática com GitHub.
- Confirmar ISBN e edição das duas obras; confirmar formatos e número de páginas de Os Deuses Não Têm Filhos. Esses campos não foram inventados.
- Avaliações e participações reais em imprensa dependem de registros editoriais.
- Conectar a ponte de eventos a um provedor e ao consentimento real antes de consultar estatísticas de conversão.
- A Amazon impediu a verificação externa automatizada da página de produto. Os destinos existentes foram preservados e os links foram testados no HTML, mas disponibilidade, preço e checkout não foram confirmados. A consulta à UICLAP não retornou conteúdo suficiente para validar a ficha ou a compra.
- Android físico, Web Share API nativa e variações de geolocalização do middleware ainda precisam de validação. A resposta 404 e o redirecionamento /r/livro foram verificados em produção.
- Core Web Vitals reais dependem de dados de produção; os indicadores registrados aqui são de laboratório local.
- O projeto não contém newsletter. O formulário do Mapa dos Sinais não sofreu alteração e sua submissão externa não foi validada. Não houve cadastro, envio ou teste de comunicação com destinatários.

## TESTES

- Compilação de produção: aprovada; 138 páginas geradas pelo script e 139 arquivos HTML no dist, incluindo a página 404.
- Matriz: Chrome e Edge instalados, em modo headless; larguras 1440, 768, 393 e 320 pixels. Pixel 5 emulado para o caso móvel; não é teste em aparelho Android físico.
- Rotas da matriz: /, /livro/, /livros/sinal-ruido/, /livros/os-deuses-nao-tem-filhos/, /livro/amostra/, /leitores/, /autor/, /arquivo/, /mapa-dos-sinais/, /contato/, /livros/ e /404.html.
- 96 verificações de página, sem pageerror, resposta local HTTP com erro ou overflow horizontal detectado. Schema Book, status, links de compra no fim da amostra e ausência de CTA persistente na amostra passaram.
- Compartilhamento: fallback de copiar canonical testado com área de transferência simulada. A caixa nativa de compartilhamento não foi testada.
- Mais 24 verificações visuais em Chrome, nas quatro larguras; navegação por teclado das abas, próximo capítulo, menu móvel e CTA persistente passaram. Capturas por seção evitam limitações de screenshots muito longos.
- Auditoria estática de 139 HTMLs: todos os destinos internos de href/src encontrados existem no pacote gerado.
- Imagens e fontes das páginas verificadas carregaram sem falhas observadas de requisição; as imagens mantêm os recursos do projeto. Leaflet e formulário do mapa continuam em carregamento separado. Não houve instalação de dependências.
- Bundle principal final: aproximadamente 33 kB de JavaScript antes de gzip, 11,3 kB gzip. Anime.js e Leaflet continuam separados. O log completo está em build-conversion.log.
- Dados de teste: qa-conversion/results.json, qa-conversion/visual-audit.json e qa-conversion/internal-links.json. Os indicadores de LCP/CLS são medições locais, sem equivalência com uma auditoria de campo.

## REVISÃO DO PERCURSO

A: busca → título, premissa e autoria → ficha ou compra.

B: Reel → capa e descrição inicial → sinopse curta → amostra ou loja.

C: botão “Ler 3 capítulos grátis” → amostra e navegação entre capítulos.

D: capítulo 3 → compra direta Kindle ou impresso.

E: tela pequena → botões empilhados; nas fichas, CTA inferior com acesso à escolha de formato.

F: comprar impresso → UICLAP, com preço consultado na loja.

Esses percursos foram exercitados no ambiente local; a compra externa completa não foi realizada.

## ARQUIVOS GERADOS ALTERADOS

- `autor/index.html`
- `buy/index.html`
- `en/chronicles/a-ultima-testemunha/index.html`
- `en/chronicles/amanha-nao-existe/index.html`
- `en/chronicles/antes-de-nascermos/index.html`
- `en/chronicles/index.html`
- `en/chronicles/nao-tem-a-palavra/index.html`
- `en/chronicles/o-arquivo-dos-mortos/index.html`
- `en/chronicles/o-ceu-esta-errado/index.html`
- `en/chronicles/o-retangulo-negro/index.html`
- `en/chronicles/o-ultimo-sinal/index.html`
- `en/chronicles/o-universo-nao-responde/index.html`
- `en/chronicles/os-deuses-nao-tem-filhos/index.html`
- `en/index.html`
- `en/signal-noise/index.html`
- `index.html`
- `leitores/index.html`
- `livro/amostra/index.html`
- `livro/index.html`
- `livros/a-ultima-testemunha/index.html`
- `livros/amanha-nao-existe/index.html`
- `livros/antes-de-nascermos/index.html`
- `livros/nao-tem-a-palavra/index.html`
- `livros/o-arquivo-dos-mortos/index.html`
- `livros/o-ceu-esta-errado/index.html`
- `livros/o-retangulo-negro/index.html`
- `livros/o-ultimo-sinal/index.html`
- `livros/o-universo-nao-responde/index.html`
- `livros/os-deuses-nao-tem-filhos/index.html`
- `livros/sinal-ruido/index.html`
- `public/search-index.json`

## VERIFICAÇÃO APÓS PUBLICAÇÃO

- 11 verificações HTTP no domínio real: home, livro, duas fichas, amostra, leitores, arquivo, mapa, autor, /r/livro e URL inexistente.
- Páginas existentes: HTTP 200; URL inexistente: HTTP 404; /r/livro: destino /leitores/ confirmado.
- 8 verificações de navegador no domínio real: home, duas fichas e amostra, em Chrome com larguras de 393 e 1440 pixels, sem erro JavaScript, falha local HTTP ou overflow horizontal detectado.
- Fim da amostra: dois destinos de compra confirmados no HTML e no navegador.
- Resultado registrado em qa-conversion/publicado.json; capturas publicado-*.png mantidas localmente.
- Publicação anterior registrada: ccc73f55-a07a-456f-8ba3-658a13c37835.

