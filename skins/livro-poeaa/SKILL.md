---
name: livro-poeaa
description: "Aplica o catálogo POEAA para camadas, lógica de domínio, fonte de dados, mapeamento objeto-relacional, apresentação web, concorrência e distribuição."
user-invocable: true
---

# Patterns of Enterprise Application Architecture

## Base bibliográfica

- **Obra:** Patterns of Enterprise Application Architecture — Martin Fowler et al.
- **Fonte usada nesta versão:** Síntese do livro e do catálogo oficial de padrões do autor; o livro não estava entre os EPUBs fornecidos.
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Nomear e comparar soluções recorrentes de aplicações corporativas intensivas em dados.

## Use quando

- Escolher organização da lógica de negócio.
- Separar apresentação, domínio e fonte de dados.
- Avaliar gateways, Active Record, Data Mapper e Repository.
- Tratar identidade, transações, concorrência e sessão.

## Não use quando

- Misturar vários padrões concorrentes sem uma escolha consciente.
- Adotar Domain Model complexo para CRUD simples.
- Usar Repository como nome genérico para qualquer classe SQL.

## Conteúdo da obra que governa esta skill

- Layering e organização de aplicações corporativas.
- Domain Logic: Transaction Script, Domain Model, Table Module e Service Layer.
- Data Source: gateways, Active Record, Data Mapper, Unit of Work, Identity Map, Repository e Query Object.
- Object-relational mapping: identidade, relacionamentos, herança e metadados.
- Web Presentation: controllers, views, templates e page controllers/front controllers.
- Distribution e data transfer.
- Offline concurrency e session state.

## Modelos mentais e técnicas derivados do livro

- Transaction Script organiza uma operação por procedimento e funciona bem para lógica simples.
- Domain Model reúne dados e comportamento quando regras e interações são complexas.
- Service Layer define a fronteira de operações da aplicação.
- Table Data Gateway trabalha por tabela; Row Data Gateway por registro.
- Active Record combina registro, persistência e algum comportamento.
- Data Mapper mantém domínio independente do banco.
- Unit of Work acompanha alterações e coordena persistência.
- Identity Map evita múltiplos objetos conflitantes para o mesmo registro.
- Repository oferece uma coleção conceitual para o domínio, geralmente sobre mapeamento mais elaborado.
- Optimistic Offline Lock detecta conflito; Pessimistic Offline Lock tenta impedi-lo.

## Procedimento operacional

1. Classifique complexidade da lógica de domínio.
2. Escolha um padrão principal de lógica de negócio.
3. Escolha estratégia de acesso e mapeamento de dados compatível.
4. Defina fronteira transacional e identidade dos objetos.
5. Modele apresentação sem duplicar regra de negócio.
6. Identifique operações concorrentes e estratégia de conflito.
7. Valide se a solução reduz complexidade em vez de apenas adicionar camadas.

## Perguntas obrigatórias antes de recomendar

- O fluxo é CRUD simples ou possui regras interdependentes?
- A transação pertence a uma operação de aplicação claramente definida?
- O objeto de domínio sabe demais sobre SQL?
- Existe mais de uma representação em memória do mesmo registro?
- Dois operadores podem editar ou atribuir o mesmo recurso ao mesmo tempo?
- O padrão escolhido é consistente no módulo?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Transaction Script pode ser adequado a endpoints simples; regras de atribuição e estados podem justificar Service Layer ou Domain Model. Use lock otimista em conflitos reais e mantenha transações curtas.

## Limites de fidelidade e atualização

- O catálogo descreve padrões, não uma arquitetura obrigatória.
- Exemplos tecnológicos envelhecem; o problema, as forças e as consequências são o núcleo.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
