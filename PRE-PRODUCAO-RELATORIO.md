# Relatório de pré-produção — SINAL/RUÍDO (webnovo)

Data: 2026-09-01

## Build
- `rm -rf node_modules && npm ci` + `npm run build`: OK, sem erros.
- Páginas geradas em `dist/`: 55.
- Checagem de links internos (href/src) contra `dist/`: 0 quebrados.

## Feito nesta rodada
- `public/_redirects` criado (Cloudflare Pages).
- `og:site_name` e `og:locale` adicionados em `src/js/render/shell.js`.
- Maturidade dos casos corrigida: 0 em Nível 3 (Dossiê), 17 em Nível 2 (Indexado), 1 em Nível 1 (Registro); `auditoriaFactualWeb: false` explícito onde não houve auditoria.
- Classificação de integridade dos 21 itens de mídia remapeada para o vocabulário de 7 níveis em `cases.json`/`media.json`.
- `INTEGRITY_CLASS` em `src/js/render/badges.js` atualizado para o vocabulário novo (7 categorias).
- CSS das 7 classes de integridade (`badge--integrity--*`) escrito em `src/css/components.css` — item que havia ficado pendente.

## Pendente (fora do escopo desta rodada, por decisão do usuário)
- `og:image`: ainda aponta para `public/press-kit/capa-placeholder.svg` (placeholder, não é imagem final).
- 3 casos-stub (nomes citados: Maria Cintra, Cláudio, e um terceiro não registrado em nenhum arquivo do projeto) — conteúdo não encontrado em disco, não implementado.
- Entidade `/documentos` — não encontrada em nenhum arquivo do projeto, não implementada.

## Não verificado nesta rodada
- Console do navegador em runtime (não houve sessão de browser).
- Preview visual das novas cores de badge de integridade.
