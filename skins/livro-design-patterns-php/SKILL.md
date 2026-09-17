---
name: livro-design-patterns-php
description: "Aplica os padrões e princípios apresentados em Design Patterns com PHP 7, escolhendo o padrão pelo problema e pelas forças envolvidas."
user-invocable: true
---

# Design Patterns com PHP

## Base bibliográfica

- **Obra:** Design Patterns com PHP 7 — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Design Patterns com PHP 7 - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Reconhecer problemas recorrentes de criação, composição e colaboração entre objetos e aplicar padrões sem transformar o catálogo em obrigação.

## Use quando

- Variar algoritmos, integrações ou formas de criação.
- Encapsular adaptação entre contratos incompatíveis.
- Compor responsabilidades sem subclasses explosivas.
- Modelar estados, comandos, eventos e fluxos extensíveis.

## Não use quando

- Escolher o nome do padrão antes de entender o problema.
- Usar Singleton como atalho para dependência global.
- Aplicar padrões de classes a código procedural sem justificar a mudança.

## Conteúdo da obra que governa esta skill

- Princípios de orientação a objetos e SOLID como base.
- Recursos de PHP usados para tipos, contratos, herança e composição.
- Padrões de criação.
- Padrões estruturais.
- Padrões comportamentais.
- Boas práticas de legibilidade, encapsulamento e dependências.

## Modelos mentais e técnicas derivados do livro

- Factory Method e Abstract Factory isolam decisões de criação.
- Builder organiza construção gradual quando muitos parâmetros ou etapas existem.
- Adapter traduz um contrato externo para o contrato esperado.
- Decorator adiciona comportamento por composição.
- Facade oferece uma entrada mais simples para um subsistema.
- Strategy varia um algoritmo sem condicional central crescente.
- Observer distribui reações a eventos, aceitando o custo de fluxo menos explícito.
- Command representa uma ação e pode facilitar fila, histórico ou desfazer.
- State desloca comportamento dependente de estado para objetos específicos.
- Template Method fixa um esqueleto e permite variações controladas.

## Procedimento operacional

1. Descreva o problema, participantes, variações e forças sem nomear padrão.
2. Localize condicionais, criação espalhada ou acoplamento a integração.
3. Compare solução simples, função/composição e padrão formal.
4. Escolha o menor padrão que resolva a variação real.
5. Defina contratos e responsabilidades antes das classes concretas.
6. Implemente um caso representativo e teste substituição/extensão.
7. Revise se o padrão reduziu complexidade total.

## Perguntas obrigatórias antes de recomendar

- O que realmente varia: criação, estrutura ou comportamento?
- A variação já existe ou é apenas especulação?
- Uma função ou composição simples resolveria?
- O fluxo continuará rastreável após Observer, Command ou eventos?
- O padrão cria dependência global ou esconde estado?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Strategy pode variar notificações; Adapter pode encapsular APIs externas; State pode representar etapas da viagem; Factory pode escolher drivers. Use apenas quando houver mais clareza que a alternativa direta.

## Limites de fidelidade e atualização

- A obra usa PHP 7; sintaxe e recursos devem ser atualizados para a versão PHP instalada.
- O catálogo não substitui Clean Architecture, modelagem de domínio ou testes.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
