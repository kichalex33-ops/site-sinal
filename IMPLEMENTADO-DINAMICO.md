# SINAL/RUÍDO WEB — rodada dinâmica aplicada

## Aplicado

- Home refeita com a frase: **“O que sabemos. O que não sabemos. O que ainda falta encontrar.”**
- entrada animada curta, contadores apenas com dados reais do catálogo e revelação progressiva;
- bloco de atualizações, dossiês, biblioteca audiovisual, PURSUE, coleções, método, livros e apoio;
- biblioteca `/midia/` com destaque audiovisual, fila de arquivos relacionados e grade ampla;
- coleção `/colecoes/pursue/` com Releases 01–05 e aviso explícito de proveniência ≠ interpretação;
- nova página `/livros/` para o projeto literário;
- QR Pix de apoio integrado à Home e ao livro sem bloquear conteúdo;
- `/livro/amostra/` preparado para até 3 capítulos consecutivos, com navegação, tamanho de fonte, modo de leitura e retomada via `localStorage`;
- (removido em 25/09/2026) comentários, Function `/api/comments`, D1 e Turnstile: ver README e CLAUDE-HANDOFF;
- página `/privacidade/` criada e mantida.

## Regra editorial preservada

Comentários existem somente na amostra literária. Dossiês factuais continuam sem fórum público.

## Pendente antes de publicar a amostra

O texto integral dos capítulos não foi inventado nem reconstruído por partes. Importar literalmente os capítulos 1–3 da edição editorial vigente do manuscrito e só então remover `noindex` da amostra e incluí-la no sitemap.

## Validação feita aqui

- `node scripts/build-pages.mjs`: OK;
- 78 páginas geradas (74 canônicas + 4 redirects);
- varredura de referências locais: 0 assets/rotas ausentes;
- `npm ci` não pôde ser concluído neste ambiente por indisponibilidade/timeout de acesso ao registry. Repetir em ambiente conectado e então executar `npm run build`.
