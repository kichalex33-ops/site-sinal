# SINAL/RUÍDO WEB — HANDOFF PARA CLAUDE CODE

## Estado deste pacote

Este pacote já recebeu a rodada de correções pré-produção solicitada. Preserve a direção visual e a arquitetura atuais. Não redesenhe do zero.

## Correções já aplicadas

- removida a ambiência global de ficção científica do núcleo factual (Gray, estrelas, névoa, glitch e scripts associados);
- manifesto factual restaurado: **“Nem deboche, nem fé. Método.”**;
- **“Nem todo sinal quer ser ouvido.”** reservado à área literária;
- OG global separado da capa do romance (`/og/arquivo.png`);
- navegação factual ampliada com `/documentos` e `/metodo`;
- restauradas/criadas as rotas `/metodo`, `/correcoes`, `/imprensa`, `/documentos` e `/livro/amostra`;
- formulário de contato e integração Web3Forms removidos;
- `/contato` convertido em redirect legado para `/imprensa`;
- texto de `/leitores` corrigido para não tratar documento como sinônimo de fato;
- notícias reposicionadas como **Radar documental / Atualizações institucionais**;
- fontes secundárias como DLA Piper e DefenseScoop não são mais apresentadas como fonte institucional;
- coleção oficial PURSUE adicionada como ponto de entrada de acervo;
- apoio Pix deslocado para baixo na página do livro;
- busca local passa a indexar documentos;
- sitemap, robots, headers e redirects passam a ser gerados no build;
- amostra literária fica `noindex,follow` e fora do sitemap enquanto o texto final não for homologado.

## Pendências deliberadas

### 1. Texto da amostra

A página `/livro/amostra/` está pronta, mas **não publique uma versão antiga do romance**. A fonte literária atual é o manuscrito final editorial v4.0.1. Inserir o capítulo 1 exatamente como homologado, sem reescrever pelo frontend, somente depois da decisão editorial sobre distribuição digital/KDP Select.

### 2. Capa do romance

O JPG atual ainda contém o nome antigo na própria arte. O texto de interface já usa **Alex Jr. Kich**. A capa deve ser atualizada como arte separada e homologada antes da publicação.

### 3. Casos brasileiros prioritários

Não inventar conteúdo. Criar somente após pesquisa WEB documentada:

- Maria Cintra / Lins — 1968;
- Cláudio/MG — 2008;
- Caso do Embornal / Baependi — 1979.

Enquanto não houver pacote factual auditado, não promover esses casos a dossiê revisado.

### 4. Próxima ingestão documental

Priorizar, sempre com proveniência e direitos verificados:

- PURSUE Releases 01–05;
- AARO Official UAP Imagery / case documents;
- NARA RG 615;
- Arquivo Nacional / SIAN;
- Project Blue Book e outros acervos oficiais pertinentes.

### 5. Maturidade editorial

Preservar os níveis:

- NÍVEL 1 — REGISTRO;
- NÍVEL 2 — CASO INDEXADO;
- NÍVEL 3 — DOSSIÊ REVISADO.

NÍVEL 3 exige auditoria factual WEB documentada. Cadastro completo não basta.

## Regras que não podem regredir

- nenhuma estética alienígena/sensacionalista no núcleo factual;
- nenhuma ficção apresentada como fato;
- nenhum formulário público ou coleta de dados pessoais no MVP;
- nenhuma métrica cenográfica;
- documento oficial não significa interpretação extraordinária confirmada;
- “não identificado” não significa “extraterrestre”;
- derivados de mídia nunca substituem o original e devem registrar transformação;
- não reintroduzir Web3Forms, newsletter, lead capture, comentários ou cadastro;
- não colocar `node_modules`, `dist` ou `.git` no pacote/repositório de entrega.

## Deploy

Destino: Cloudflare Pages, domínio canônico `https://sinalruido.com.br`.

Build esperado:

```bash
npm ci
npm run build
```

Output: `dist/`.

A vinculação do domínio deve ser feita pelo projeto Pages após a zona Cloudflare estar ativa. Não inventar registros A/AAAA/CNAME.

---

## Rodada dinâmica + comentários — 03/09/2026

Este pacote recebeu nova Home, biblioteca audiovisual ampliada, destaque PURSUE, página `/livros/`, apoio Pix na Home, amostra de até três capítulos e infraestrutura de comentários moderados.

Leia antes de alterar:
- `IMPLEMENTADO-DINAMICO.md`
- `AMOSTRA-IMPORTAR.md`

> Atualização 25/09/2026: comentários, formulário de contato, mapa estelar, sistema solar e modelos 3D NASA foram removidos (código no histórico, tag `pre-faxina`). Não reintroduzir sem decisão explícita do autor.

### Não regredir
- a frase principal da Home é **“O que sabemos. O que não sabemos. O que ainda falta encontrar.”**;
- não reintroduzir Gray, glitch, nave, estrelas ou efeitos de “site alien” no arquivo factual;
- nenhum comentário público, formulário ou cadastro (regra vigente);
- não criar likes, ranking, views ou recomendação por engajamento;
- não inventar texto para preencher os capítulos: importar da fonte literária homologada;
- PURSUE/AARO/NARA/SIAN devem manter proveniência e limitações explícitas.
