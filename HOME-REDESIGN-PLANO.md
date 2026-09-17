# Plano de reestruturação da Home — SINAL/RUÍDO

Status: rascunho para execução por fases. Nada é implantado em produção sem validação e autorização explícita.

## 1. Estado atual (linha de base)

`homePage()` em `scripts/build-pages.mjs:57-216` gera a Home hoje nesta ordem:

1. Hero factual ("O que sabemos / não sabemos / falta encontrar") + busca + stats do acervo
2. Últimas atualizações (`updates.json`)
3. Casos em destaque
4. Biblioteca audiovisual (mídia em destaque)
5. Explorar (modelo NASA DSN 70m) — só renderiza se o modelo existir (`nasaModelBySlug`)
6. PURSUE (coleção institucional)
7. Coleções institucionais (grid)
8. Método (5 passos)
9. Literário (`literary-home` — capa, título, sinopse, CTA "Ler até 3 capítulos" / "Ver os livros")
10. Apoio (QR Pix)

O bloco literário já existe, mas está no final, subordinado ao arquivo. A espec do autor (35 seções, resumidas em 14 blocos) inverte a prioridade: livro primeiro, arquivo como segunda camada na mesma página.

## 2. Mapeamento espec → implementação

| # | Bloco da espec | Fonte de dados | Já existe? | Ação |
|---|---|---|---|---|
| 1 | Hero literário (capa, título, autor, frase, CTA Ler/Conhecer/Comprar) | `books.json` (`featured`) | Parcial — hero atual é factual, não literário | Reescrever hero |
| 2 | Sobre o romance | `books.json.description` / `synopsis` | Sim (usado em `livro-home`) | Mover para logo após hero, expandir com sinopse |
| 3 | Ponte "o que sabemos / não sabemos / falta encontrar" | estático | Sim (é o hero atual) | Rebaixar de H1 para transição visual entre romance e arquivo |
| 4 | CTA "Leia 3 capítulos" → `/livro/amostra/` | `books.json.sampleUrl` | Sim | Manter link, subir para bloco 4 |
| 5 | Comentários dos leitores (só aprovados, sem likes/ranking) | D1 via `/api/comments` | Parcial — API só aceita `chapter_id` único (`chapter-1/2/3`), sem endpoint agregado | Precisa endpoint novo (ver §4) |
| 6 | Ponte "A ficção termina aqui. Os documentos não." | estático | Não existe ainda | Criar bloco de transição |
| 7 | Arquivo factual | `cases.json` | Sim (`Casos em destaque`) | Reposicionar após a ponte |
| 8 | Arquivo audiovisual | `media.json` | Sim (`home-media-section`) | Reposicionar |
| 9 | PURSUE/Pentágono | `collections.json` | Sim (`pursue-home`) | Reposicionar |
| 10 | Coleções institucionais | `collections.json` | Sim | Reposicionar |
| 11 | NASA/Instrumentos (`/explorar/`) | `nasa-models.json` | Sim (`explore-home`), só DSN 70m | Reposicionar, manter escopo atual |
| 12 | Livros (catálogo) | `books.json` | Não existe na Home hoje (só `/livros/`) | Adicionar grid de catálogo (reaproveitar cards de `livrosPage()`) |
| 13 | Apoio (QR Pix) | estático | Sim (`support-home`) | Manter por último antes do footer, sem alterar |
| 14 | Footer | `shell.js` | Sim (global) | Sem alteração |

Regras a preservar em todo bloco: nunca inventar preço/ISBN/data/link de compra (usar "EM BREVE" — hoje `books.json` não tem esses campos, então o CTA "Comprar" do hero deve renderizar como desabilitado/"EM BREVE" até existir dado real); apoio nunca antes do livro; "apoiar" e "comprar" como CTAs distintos, nunca fundidos.

## 3. Ordem final proposta (para `homePage()`)

```
1. home-hero-livro       (era literary-home, adaptado — vira o hero)
2. home-sobre-romance    (sinopse expandida)
3. home-ponte-perguntas  (era o hero factual, rebaixado a transição)
4. home-amostra-cta      (leia 3 capítulos)
5. home-comentarios      (novo — lista comentários aprovados, cross-capítulo)
6. home-ponte-arquivo    (novo — "a ficção termina aqui")
7. home-updates          (mantém, mas pode simplificar)
8. home-case-grid        (mantém)
9. home-media-section    (mantém)
10. explore-home (NASA)  (mantém)
11. pursue-home          (mantém)
12. coleções grid        (mantém)
13. home-livros-catalogo (novo — grid de books.json, reduzido)
14. support-home (Pix)   (mantém, agora após o catálogo, ainda antes do footer)
```

Atualização: a espec completa de 35 seções (recebida na íntegra) confirma a ordem final de 14 blocos sem "Método" — o bloco `method-home` foi removido da Home (a página `/metodo/` continua existindo e acessível pelo menu). O bloco "Últimas atualizações" também foi removido da Home pelo mesmo motivo (não está nos 14 blocos, e a regra "não abrir com dashboard" se estende a não empilhar blocos fora da lista); a rota `/noticias/` permanece intacta e linkada no footer.

## 4. Trabalho de backend necessário (bloco 5 — comentários)

`functions/api/comments.js:24-39` (`onRequestGet`) hoje exige `chapter_id` e responde só daquele capítulo. Para a Home preciso de "últimos N comentários aprovados de qualquer capítulo". Duas opções:

- **A. Novo parâmetro** `?all=1` no mesmo endpoint, com `SELECT ... WHERE status='approved' ORDER BY created_at DESC LIMIT 6` sem filtro de `chapter_id`.
- **B. Endpoint separado** `functions/api/comments-featured.js`.

Recomendação: opção A (menos superfície nova). Isso é mudança de Worker (`functions/`), fora do escopo de `webnovo` puro — testável local só com `wrangler pages dev` + D1 local, ou fica documentado como pendência de deploy até o autor confirmar acesso ao D1 real.

## 5. Motion (Anime.js)

Hoje a Home usa motion artesanal em `src/js/home-motion.js` (CSS transition para as linhas do hero, `requestAnimationFrame` para contador). Não há Anime.js no projeto (`package.json` não lista a dependência). A espec pede Anime.js para "typing suave, sem exagero".

Ponto de decisão para o autor: adicionar `animejs` como dependência nova (troca o motion atual) ou manter o motion artesanal (já funciona, sem novo pacote)? Esta escolha fica pendente — plano assume manter o artesanal salvo instrução em contrário, para não introduzir dependência sem necessidade.

## 6. Fases de implementação

1. **Fase 1** — reordenar blocos existentes (2, 3, 6→ponte, 7, 8, 9, 10, 11, 13) sem criar nada novo. Valida a inversão de prioridade com o mínimo de risco.
2. **Fase 2** — hero literário (bloco 1): adaptar `literary-home` atual para topo, com CTA "Comprar" em estado "EM BREVE" (sem link ativo, sem inventar dado).
3. **Fase 3** — bloco 4 (CTA amostra) e bloco 6 (ponte "a ficção termina aqui") — só HTML/CSS estático, sem dados novos.
4. **Fase 4** — bloco 12 (catálogo de livros na Home) — reaproveitar cards de `livrosPage()` (`scripts/build-pages.mjs:859`).
5. **Fase 5** — bloco 5 (comentários) — depende do endpoint novo (§4). Pode ficar como último item, com fallback "ainda não há comentários" se a API não responder (mesmo padrão de `comments.js:29`).
6. **Fase 6** — motion: aplicar transições/typing ao hero literário e à ponte, decisão de §5 já resolvida.
7. **Fase 7** — build (`npm run build`), QA visual (mobile primeiro), gerar `HOME-PUBLICACAO-RELATORIO.md`.

## 7. QA mínimo antes do relatório

- `npm run build` sem erro.
- Home renderiza no mobile (375px) sem CTA cortado, sem "apoiar" competindo visualmente com "comprar".
- Nenhuma seção factual foi removida das rotas (`/casos/`, `/documentos/`, `/colecoes/`, `/midia/`, `/explorar/`, `/metodo/`, `/livros/`, `/livro/amostra/` continuam existindo e acessíveis pela Home).
- Nenhum preço/ISBN/data de lançamento inventado — conferir texto renderizado do hero literário.
- Sem deploy — trabalho fica local até autorização explícita.
