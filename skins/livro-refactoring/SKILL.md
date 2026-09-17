---
name: livro-refactoring
description: "Aplica o método de Refactoring: melhorar estrutura interna preservando comportamento observável, por passos pequenos, testes e refatorações nomeadas."
user-invocable: true
---

# Refactoring

## Base bibliográfica

- **Obra:** Refactoring, Second Edition — Martin Fowler
- **Fonte usada nesta versão:** Síntese da obra e do catálogo oficial do autor; o livro não estava entre os EPUBs fornecidos.
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Reduzir custo de mudança sem misturar reorganização estrutural com nova funcionalidade.

## Use quando

- Eliminar duplicação, funções extensas e condicionais complexas.
- Melhorar nomes, limites e distribuição de responsabilidades.
- Preparar código para uma alteração funcional.
- Refatorar legado protegido por testes de caracterização.

## Não use quando

- Chamar reescrita ampla de refatoração.
- Alterar comportamento e estrutura no mesmo passo sem necessidade.
- Aplicar cheiro de código como regra automática.

## Conteúdo da obra que governa esta skill

- Definição e disciplina da refatoração.
- Primeiro exemplo passo a passo.
- Princípios: quando, por que e problemas da refatoração.
- Testes como rede de segurança.
- Catálogo de refatorações e mecânicas.
- Code smells como sinais para investigação.
- Encapsulamento, movimentação de funções, organização de dados e simplificação de condicionais.
- Refatoração de APIs, herança e grandes estruturas.

## Modelos mentais e técnicas derivados do livro

- Refatorar altera estrutura interna sem mudar comportamento observável.
- Passos pequenos reduzem distância até um estado funcionando.
- Testes devem rodar frequentemente.
- Cheiro aponta onde investigar; contexto decide se há problema.
- Extract Function torna intenção explícita.
- Move Function aproxima comportamento dos dados ou responsabilidades corretas.
- Replace Conditional with Polymorphism pode ajudar quando variações são estáveis e relevantes.
- Encapsulate Variable ou Record controla acesso e evolução.
- Change Function Declaration melhora o contrato público.

## Procedimento operacional

1. Defina o comportamento que deve permanecer e crie teste de caracterização.
2. Escolha um cheiro e uma refatoração pequena.
3. Faça uma alteração mecânica por vez.
4. Execute testes após cada passo relevante.
5. Mantenha commits pequenos e reversíveis.
6. Só depois implemente a nova funcionalidade em mudança separada.
7. Compare contratos, dados e efeitos observáveis antes de concluir.

## Perguntas obrigatórias antes de recomendar

- Qual comportamento precisa permanecer idêntico para o usuário ou cliente da API?
- Existe teste que falha se esse comportamento mudar?
- Qual refatoração nomeada descreve o passo?
- A mudança pode ser menor?
- O código foi movido para perto dos dados e decisões que utiliza?
- A API pública mudou inadvertidamente?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Antes de dividir classes grandes do backend, proteja autenticação, viagens, sync e relatórios com testes de caracterização. Faça extrações incrementais sem alterar payload, status ou transação no mesmo commit.

## Limites de fidelidade e atualização

- Refatoração não substitui redesenho quando requisitos mudam radicalmente.
- Ferramentas automáticas ajudam, mas não compreendem todo comportamento externo.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
