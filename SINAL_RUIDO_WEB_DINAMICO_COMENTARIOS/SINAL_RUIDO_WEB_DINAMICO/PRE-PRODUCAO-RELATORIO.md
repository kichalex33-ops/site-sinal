# SINAL/RUÍDO WEB — RELATÓRIO PRÉ-PRODUÇÃO

Data da rodada: 03/09/2026

## Resultado executivo

A base está apta para continuar em Claude Code e entrar na etapa final de deploy, com duas pendências externas deliberadas: (1) inserir a amostra literária somente a partir do manuscrito vigente e após decisão de distribuição digital; (2) atualizar a arte da capa para o nome editorial Alex Jr. Kich.

O núcleo factual foi novamente separado da atmosfera do romance. Não há formulário público nem coleta de dados pessoais nesta versão.

## Inventário atual

- 18 casos cadastrados;
- 5 coleções;
- 18 itens de mídia;
- 6 atualizações no radar documental;
- 76 páginas HTML geradas pelo gerador local;
- 4 rotas de campanha com redirect;
- entidade `/documentos` criada a partir dos registros documentais ligados aos casos.

## Correções aplicadas nesta rodada

- retirada da ambiência global de ficção científica (Gray, estrelas, névoa, glitch e scripts correlatos);
- manifesto factual restaurado na Home: “Nem deboche, nem fé. Método.”;
- slogan “Nem todo sinal quer ser ouvido.” mantido apenas no núcleo literário;
- OG global trocado para imagem institucional própria (`/og/arquivo.png`);
- capa do livro reservada às rotas literárias;
- navegação ampliada com Documentos e Método;
- criadas/restauradas as rotas `/documentos`, `/metodo`, `/correcoes`, `/imprensa` e `/livro/amostra`;
- formulário de contato/Web3Forms removido;
- `/contato` preservado somente como redirect legado para `/imprensa`;
- texto de `/leitores` corrigido para não tratar documento como sinônimo de fato;
- notícias reposicionadas como “Radar documental / Atualizações institucionais”;
- DLA Piper e DefenseScoop classificados como fontes secundárias, não institucionais;
- coleção PURSUE adicionada;
- apoio Pix deslocado para depois da apresentação do livro;
- integridade de mídia separa original digital, digitalização institucional, cópia, reprodução, derivado, ilustração e origem incerta;
- busca passa a incluir documentos;
- `robots.txt`, `sitemap.xml`, `_headers` e `_redirects` gerados pelo script;
- `/livro/amostra` está `noindex,follow` e fora do sitemap enquanto o texto não estiver homologado.

## Validações executadas

- `node scripts/build-pages.mjs`: OK;
- gerador: 76 páginas (72 páginas/rotas não-campanha + 4 redirects de campanha);
- varredura de 76 arquivos HTML: 0 links internos ausentes;
- varredura de assets locais: 0 assets ausentes;
- nenhuma rota `/contato` física permanece;
- nenhum uso ativo de `web3forms`, `ambience.js` ou `gray.jpg` no código/site;
- canonical da Home aponta para `https://sinalruido.com.br/`;
- OG factual aponta para `/og/arquivo.png`.

## Build Vite

Não foi possível concluir `npm ci` nesta sandbox porque o ambiente não possui resolução de rede para `registry.npmjs.org` (`EAI_AGAIN`). Isso não é uma falha detectada no código do projeto.

O pacote final deliberadamente NÃO inclui `node_modules` nem `dist`. No ambiente do Claude/Cloudflare, executar:

```bash
npm ci
npm run build
```

O build deve ser a primeira validação antes do deploy.

## Pendências antes da publicação pública

1. Atualizar a arte da capa: a imagem ainda contém o nome antigo. Interface usa `Alex Jr. Kich`.
2. Inserir a amostra a partir do manuscrito vigente, sem reescrita automática, após definir compatibilidade com a estratégia KDP/KDP Select.
3. Auditar e inserir Maria Cintra/Lins 1968, Cláudio/MG 2008 e Embornal/Baependi 1979.
4. Ingerir PURSUE Releases 01–05 em `/documentos` e `/midia`, item por item, com proveniência e direitos.
5. Continuar auditoria factual dos casos antes de promover qualquer conteúdo a NÍVEL 3 — DOSSIÊ REVISADO.
6. Homologar press kit final, ISBN e contato profissional quando disponíveis.

## Regra editorial de lançamento

Catalogar rápido; promover a “revisado” devagar.

Documento oficial comprova proveniência institucional do registro. Não comprova, por si só, uma interpretação extraordinária.
