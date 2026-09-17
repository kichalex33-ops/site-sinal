---
name: livro-rest-apis
description: "Aplica os conceitos do livro sobre recursos, URIs, métodos HTTP, parâmetros, headers, media types, status codes e hipermídia."
user-invocable: true
---

# REST: construa APIs inteligentes

## Base bibliográfica

- **Obra:** REST: construa APIs inteligentes de maneira simples — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Rest - Construa APIs inteligentes de maneira simples - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Projetar APIs que usem corretamente a semântica da Web e apresentem contratos previsíveis.

## Use quando

- Nomear recursos e desenhar endpoints.
- Escolher método, status, headers e representação.
- Revisar idempotência, cache e erros.
- Evoluir contratos entre painel e aplicativo.

## Não use quando

- Transformar toda ação em verbo na URI.
- Usar PUT apenas porque uma ação parece repetível.
- Retornar 200 para qualquer resultado ou esconder erro em campo interno.

## Conteúdo da obra que governa esta skill

- Motivação e restrições arquiteturais de REST.
- Recursos e identificadores.
- Representações e media types.
- Métodos HTTP e suas propriedades.
- Parâmetros de caminho, query e corpo.
- Headers e negociação.
- Status codes.
- Links e hipermídia.

## Modelos mentais e técnicas derivados do livro

- URI identifica recurso; representação é uma forma de seu estado.
- GET deve ser seguro; métodos idempotentes podem ser repetidos sem efeito adicional esperado.
- POST cria ou processa conforme contrato; PUT substitui estado conhecido; PATCH aplica alteração parcial.
- Query costuma filtrar, ordenar, paginar ou selecionar visualização.
- Status code descreve o resultado no protocolo.
- Erro deve ter estrutura estável, código de domínio, mensagem segura e correlação.
- ETag e condicionais podem reduzir conflito e tráfego.
- Hipermídia pode orientar transições, mas deve resolver uma necessidade real.

## Procedimento operacional

1. Modele recursos, identidades e relações antes das rotas.
2. Defina operações e escolha método pela semântica.
3. Especifique request, response, erros e status.
4. Defina paginação, filtros, ordenação e limites.
5. Trate autenticação e autorização por recurso.
6. Planeje compatibilidade, versionamento e depreciação.
7. Documente em contrato executável e escreva testes de contrato.

## Perguntas obrigatórias antes de recomendar

- A URI representa substantivo/recurso ou uma ação arbitrária?
- A repetição da requisição é segura e/ou idempotente?
- O status HTTP corresponde ao resultado real?
- O cliente consegue diferenciar validação, conflito, ausência e falha interna?
- Como a API evita criação duplicada após retry?
- A alteração quebra cliente antigo?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Padronize APIs de painel e motorista, especialmente sync, ativação, viagens e anexos. Use idempotency key em operações sujeitas a repetição offline e contratos de erro consistentes.

## Limites de fidelidade e atualização

- A obra apresenta REST de forma prática; detalhes de segurança, OpenAPI e idempotency keys podem exigir fontes complementares.
- Não confunda REST com obrigação de HATEOAS completo em todo endpoint.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
