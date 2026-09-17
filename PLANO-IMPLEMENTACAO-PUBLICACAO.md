# PLANO-IMPLEMENTACAO-PUBLICACAO

Baseado em `AUDITORIA-PUBLICACAO-DIGITAL.md`. Ordem de execução para fechar as
divergências entre o Comando Mestre v2.0 e o estado atual do `webnovo/`. Trabalho
100% local nesta janela (sem push/deploy) — ver seção 6 da auditoria.

## Fase 1 — Arquitetura (rotas e navegação)

- [ ] Criar `/ler/` como rota canônica do leitor (sumário + capítulos), migrando a
      lógica hoje em `/livro/amostra/`. Manter `/livro/amostra/` como redirect legado
      (mesmo padrão já usado para `/contato/` → `/imprensa/`).
- [ ] Criar `/apoio/` como página própria (QR Pix + explicação), mantendo os blocos
      menores já existentes na Home e em `/livro/` como chamada para essa página.
- [ ] Revisar `shell.js` para a navegação principal `LER · ARQUIVO · MÍDIA · LIVROS ·
      BUSCAR`, com Método/Correções/Imprensa/Apoio/Privacidade em menu secundário/footer.
- [ ] Avaliar separar `/casos/` de `/arquivo/` como catálogo dedicado (pendência já
      registrada desde o Documento Mestre v1.2).

## Fase 2 — Home

- [ ] Reordenar/renomear seções da Home para a sequência exata da seção 05 do comando:
      hero → amostra → ponte factual → dossiês/documentos → audiovisual → coleções →
      livros → apoio → footer.

## Fase 3 — Leitor

- [ ] Confirmar fonte do manuscrito v4.0.1 com o autor antes de importar qualquer
      capítulo (gate editorial da seção 06 — não reescrever, não usar versão antiga).
      Enquanto não houver fonte confirmada, manter marcação PENDENTE DE IMPORTAÇÃO.

## Fase 4 — Comentários

- [ ] Confirmar com o autor se D1/Turnstile já têm credenciais reais para produção;
      caso não, manter desabilitado (regra da Fase 4 do comando).

## Fase 5 — Livros/Apoio

- [ ] `/apoio/` (ver Fase 1) com explicação de apoio ≠ compra, sem urgência artificial.

## Fase 6 — Arquivo/Mídia

- [ ] Auditar `three.js`/mapa estelar/sistema solar (arquivos untracked) e confirmar que
      ficam restritos à camada literária, nunca no núcleo factual.
- [ ] Seguir backlog de `BACKLOG-WEB.md` para ingestão documental (não antecipar sem
      pesquisa WEB auditada).

## Fase 7 — Motion

- [ ] Levantar onde JS vanilla atual já cobre o pedido (stagger, scroll reveal) antes de
      decidir se vale introduzir Anime.js, ou se o CSS/JS existente já resolve (comando
      pede não adicionar biblioteca se o que já existe cobrir o requisito).

## Fase 8 — Produção

- [ ] `npm ci && npm run build` limpo (checar registry, que falhou antes por timeout).
- [ ] Lighthouse, headers, CSP, sitemap/robots/canonical.
- [ ] Gerar `RELATORIO-FINAL-PUBLICACAO.md` e `CHECKLIST-PRODUCAO.md` ao final.

## Observação de sequenciamento

Antes da Fase 1, a única ação combinada para deploy imediato é a página "em breve"
(`em-breve/`, ver auditoria seção 6) — que não faz parte deste plano de produto e não
deve ser confundida com as fases acima.
