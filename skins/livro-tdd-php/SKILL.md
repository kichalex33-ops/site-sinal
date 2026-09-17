---
name: livro-tdd-php
description: "Aplica o percurso do livro TDD com PHP: testes de unidade, ciclo vermelho-verde-refatora, baby steps, design, qualidade de testes, mocks, acoplamento e integração."
user-invocable: true
---

# Test Driven Development com PHP

## Base bibliográfica

- **Obra:** Test Driven Development: teste e design no mundo real com PHP — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Test Driven Development - Teste e Design no Mundo Real com PHP - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Usar testes como feedback de comportamento e de design durante a construção de código PHP.

## Use quando

- Desenvolver regra nova com comportamento bem definido.
- Projetar classes por exemplos executáveis.
- Reduzir acoplamento indicado por testes difíceis.
- Trabalhar em legado com testes de caracterização.

## Não use quando

- Exigir TDD para toda alteração trivial ou exploratória.
- Criar mocks de tudo.
- Buscar 100% de cobertura como objetivo independente.

## Conteúdo da obra que governa esta skill

- Motivação para testes e definição de unidade.
- Introdução ao TDD.
- Simplicidade e baby steps.
- Influência do TDD no design de classes.
- Qualidade do código de teste, nomes, builders e assertions.
- Coesão, acoplamento, dependências explícitas e mocks.
- Encapsulamento, Tell Don’t Ask e Lei de Demeter.
- Testes de integração e quando não usar mocks.
- Limites, erros comuns e TDD em legado.
- Princípios SOLID como apoio.

## Modelos mentais e técnicas derivados do livro

- Ciclo: escrever teste que falha pelo motivo esperado, implementar o mínimo e refatorar.
- Baby step é instrumento de controle de risco, não lentidão obrigatória.
- Teste é cliente do design e revela contratos difíceis.
- Mock é útil em dependência lenta, não determinística ou externa; não substitui integração real.
- Teste deve comunicar cenário, ação e resultado.
- Builder reduz ruído na criação de dados.
- Cobertura mostra execução, não qualidade das asserções.
- TDD pode ser inadequado em investigação ou interface altamente experimental.

## Procedimento operacional

1. Escolha um comportamento pequeno e observável.
2. Escreva teste com nome e cenário claros.
3. Execute e confirme falha correta.
4. Implemente a solução mínima.
5. Execute toda a suíte.
6. Refatore produção e teste sem alterar comportamento.
7. Adicione integração para banco, HTTP ou serviço real quando necessário.
8. Revise o feedback de coesão, acoplamento e encapsulamento.

## Perguntas obrigatórias antes de recomendar

- O teste falha pelo motivo que pretendo resolver?
- Estou testando comportamento ou implementação interna?
- O mock representa uma fronteira real?
- O teste continua legível após mudança de estrutura?
- A integração real também está coberta onde importa?
- TDD reduzirá incerteza ou estou explorando uma solução ainda desconhecida?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Use TDD em regras de atribuição, estados, cálculo e validação. Para endpoints legados, comece por testes de caracterização. Escolha a versão do PHPUnit compatível com o PHP instalado.

## Limites de fidelidade e atualização

- A versão de PHPUnit do livro não deve ser copiada automaticamente.
- TDD não elimina testes de integração, sistema, segurança ou usabilidade.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
