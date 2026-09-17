# SINAL/RUÍDO WEB

Base estática multipágina para Cloudflare Pages, com catálogo factual separado da área literária.

## Build

```bash
npm ci
npm run build
```

Saída: `dist/`.

## Rodada atual

A Home dinâmica, biblioteca audiovisual, coleção PURSUE, página de livros, apoio Pix, amostra literária e comentários moderados estão descritos em:

- `IMPLEMENTADO-DINAMICO.md`
- `AMOSTRA-IMPORTAR.md`
- `COMMENTS-CLOUDFLARE.md`
- `CLAUDE-HANDOFF.md`

## Comentários

A infraestrutura usa Cloudflare Pages Functions + D1 + Turnstile e existe apenas na área literária. Execute `schema/comments.sql` no D1 e configure os bindings descritos em `COMMENTS-CLOUDFLARE.md`.

## Importante

O texto integral dos três capítulos ainda deve ser importado literalmente do manuscrito homologado. A página `/livro/amostra/` permanece `noindex,follow` até essa etapa editorial.
