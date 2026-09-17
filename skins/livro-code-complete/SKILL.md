---
name: livro-code-complete
description: "Aplica as práticas de construção de software de Code Complete: gerenciamento da complexidade, design durante a construção, rotinas, dados, controle, programação defensiva, testes e melhoria."
user-invocable: true
---

# Code Complete

## Base bibliográfica

- **Obra:** Code Complete, Second Edition — Steve McConnell
- **Fonte usada nesta versão:** Síntese da obra e de sua estrutura editorial oficial; o livro não estava entre os EPUBs fornecidos.
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Melhorar a qualidade do código no nível em que ele é realmente construído: classes, rotinas, dados, controle, nomes, tratamento de erros e revisão.

## Use quando

- Revisar código difícil de compreender ou modificar.
- Projetar rotinas, classes, variáveis e estruturas de controle.
- Definir práticas de programação defensiva e tratamento de erros.
- Organizar revisão, depuração e otimização.

## Não use quando

- Transformar heurísticas do livro em limites numéricos rígidos.
- Otimizar antes de medir.
- Substituir requisitos, arquitetura e testes por estilo de código.

## Conteúdo da obra que governa esta skill

- Pré-requisitos da construção: problema, requisitos, arquitetura e ambiente.
- Gerenciamento da complexidade como imperativo técnico central.
- Design durante a construção e escolha consciente de abstrações.
- Classes, rotinas, variáveis, tipos e organização de dados.
- Estruturas de controle, expressões, tabelas e código orientado a fluxo claro.
- Programação defensiva, assertions e tratamento de erros.
- Código colaborativo, layout, documentação, revisão, testes e depuração.
- Otimização quantitativa e evolução do programa.

## Modelos mentais e técnicas derivados do livro

- O código deve reduzir a carga mental necessária para compreender uma mudança.
- Nomes comunicam intenção, escopo e unidade; não apenas tipo.
- Rotinas devem ter propósito coeso, contrato claro e efeitos laterais controlados.
- Variáveis devem viver no menor escopo útil e permanecer válidas pelo menor tempo possível.
- Assertions detectam erros de programação; tratamento de erros lida com condições esperadas em execução.
- A programação defensiva protege fronteiras sem esconder falhas.
- Performance deve ser medida; intuição isolada é pouco confiável.

## Procedimento operacional

1. Confirme requisitos e responsabilidade do trecho antes de reescrever.
2. Descreva a solução em pseudocódigo ou linguagem natural precisa.
3. Escolha nomes, tipos e contratos antes dos detalhes internos.
4. Construa em pequenos passos verificáveis.
5. Revise fluxo de controle, estados, entradas inválidas e efeitos laterais.
6. Execute testes e revisão por outra pessoa ou ferramenta.
7. Meça antes de qualquer otimização e preserve clareza salvo evidência contrária.

## Perguntas obrigatórias antes de recomendar

- Qual complexidade essencial existe e qual foi criada pelo código?
- O nome comunica domínio, unidade e condição?
- A rotina possui uma responsabilidade identificável?
- Há estados inválidos que poderiam ser impossíveis por construção?
- O erro deve ser impedido, detectado por assertion ou tratado em execução?
- Existe medição que justifique a otimização?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Use em revisões de PHP, JavaScript e Dart para reduzir duplicação, nomes vagos, funções extensas, estado compartilhado e tratamento inconsistente de erros. Evite métricas rígidas sem contexto.

## Limites de fidelidade e atualização

- Exemplos de linguagem envelhecem; princípios de construção permanecem.
- Regras atuais de sintaxe, análise estática e ferramentas devem vir da documentação da stack.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
