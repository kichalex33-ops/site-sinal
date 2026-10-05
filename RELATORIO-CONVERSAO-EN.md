# Conversão da versão inglesa — 5 de outubro de 2026

## ALTERADO

- scripts/build-pages.mjs: componentes de compra, autor, avaliações, imprensa e CTA móvel agora aceitam o idioma. Home /en/, ficha /en/signal-noise/, amostra /livro/sample/, catálogo /en/chronicles/, ficha do volume I, compra internacional e /en/readers/ receberam as melhorias correspondentes.
- src/js/render/shell.js: navegação inglesa para amostra, livro, compra, autor, arquivo e mapa; menu móvel reutiliza a implementação existente; a marca retorna à home inglesa.
- src/js/main.js: confirmação e erro do compartilhamento em inglês, com Web Share API e cópia do canonical.
- src/js/conversion.js: títulos localizados nos eventos, identificação das fichas inglesas e registro do fim da amostra quando o consentimento é concedido após chegar ao final.
- src/js/reading.js e src/css/components.css: retorno secundário sem duplicação no capítulo 3, respeitando o atributo hidden; aparência e foco reutilizados.
- As páginas que usam o cabeçalho inglês foram regeneradas. As URLs existentes foram preservadas.

## CORRIGIDO

- A amostra inglesa não tinha as duas compras diretas nem a seção final equivalente à portuguesa.
- A ficha inglesa de SIGNAL/NOISE usava um objeto editorial separado sem os links de compra. Ela agora herda os dados reais do catálogo.
- A disponibilidade editorial é explícita: SIGNAL/NOISE está disponível em inglês; o volume I tem apenas a edição portuguesa confirmada nos dados atuais.
- Não são mostradas 687 páginas como característica da edição inglesa: essa contagem pertence ao Kindle em português.
- Compra internacional agora usa “Check price in store”.
- Dados estruturados Book incluem o idioma da edição efetivamente disponível e o nome correspondente, com o autor e a imagem existentes.

## CONVERSÃO

- Primeira tela inglesa: capa, premissa, autoria, “Buy Kindle”, “Buy paperback” e “Read 3 free chapters”.
- Kindle e paperback principais apontam para os links da Amazon US já presentes nos dados de compra internacional. O acesso “Choose your country and edition” mantém as demais lojas e a capa dura.
- Bloco “This book may be for you if…”, sinopse curta, três capítulos gratuitos, volume I publicado em português, autor compacto, sinal Wow!, arquivo e mapa precedem os livros futuros.
- Final da amostra: “You have reached the end of the sample”, “But the signal continues”, compra Kindle, compra paperback e retorno secundário.
- Fichas dos livros disponíveis têm autor, compartilhamento e CTA móvel, oculto durante menus abertos. A amostra não contém esse CTA persistente.
- /en/readers/ mantém a URL e apresenta “After reading”.
- Prova social e imprensa permanecem ocultas enquanto não houver registros reais. Para conteúdo inglês em src/data/book-conversion.json, usar lang: "en"; registros sem lang continuam destinados ao português.

## ANALYTICS

Os mesmos eventos e a mesma ponte de consentimento são usados nos dois idiomas. book_title reflete o título exibido na versão inglesa. Não foi instalado outro provedor. A coleta real ainda depende da integração com analytics e consentimento, conforme o relatório principal.

## TESTES

- Compilação de produção aprovada; auditoria dos 139 arquivos HTML gerados não encontrou destino interno faltante.
- 100 verificações locais em Chrome e Edge: larguras 320, 393, 768, 1024 e 1440 pixels. Rotas: /en/, /en/signal-noise/, /livro/sample/, /en/chronicles/, /en/chronicles/os-deuses-nao-tem-filhos/, /en/readers/, /buy/, /en/author/, / e /livro/amostra/.
- Sem erro JavaScript, falha local HTTP, imagem carregada quebrada ou overflow horizontal detectado nessa matriz. Verificados idioma, status, schemas, URLs de compra, menu e compartilhamento.
- Eventos: bloqueio sem consentimento; view_book/click_buy_kindle/click_book_store em inglês; finish_sample ao conceder consentimento no fim da leitura. Fallback de compartilhamento verificado com área de transferência simulada.
- Capturas de home, ficha, volume I, leitores e fim da amostra examinadas em 393 e 1440 pixels.
- Verificação complementar da versão final: Chrome/Edge em 320 e 393 pixels, com home, ficha, amostra inglesa e amostra portuguesa; inclui a ausência de retorno duplicado.
- Os aparelhos móveis são emulados; Android físico e diálogo nativo de compartilhamento não foram testados. Checkout, preço e disponibilidade externa de estoque não foram confirmados.
- Resultados em qa-conversion/english-results.json e qa-conversion/english-final-results.json. Capturas e scripts de QA mantidos localmente.

## PENDÊNCIAS

ISBN, edição e contagem de páginas da edição inglesa não estavam confirmados. Não há link confirmado para uma edição inglesa de The Gods Have No Children: sua compra é claramente rotulada “Buy the Portuguese edition”. Avaliações, imprensa e integração real de analytics continuam dependentes de dados/configuração.

## PUBLICAÇÃO

Publicação realizada no projeto Cloudflare Pages sinalruido, branch de produção main. Domínio: https://sinalruido.com.br/en/. Deploy desta atualização: https://c4d8299b.sinalruido.pages.dev. A publicação anterior era https://ab64320c.sinalruido.pages.dev.


Após a publicação, 20 verificações de navegador no domínio real passaram em Chrome, com larguras de 393 e 1440 pixels, incluindo as 10 rotas da matriz. Sem erros JavaScript, respostas HTTP com falha ou overflow horizontal detectado. Dados em qa-conversion/english-live-results.json. O JavaScript principal ficou em 33,39 kB (11,45 kB gzip), e o CSS principal em 76,29 kB (15,36 kB gzip).

