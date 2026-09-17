---
name: livro-testes-automatizados
description: "Aplica o guia prático do livro: testes de unidade, classes de equivalência, builders, TDD, mocks, integração, sistema, Page Objects e testes de serviços web."
user-invocable: true
---

# Testes automatizados de software

## Base bibliográfica

- **Obra:** Testes automatizados de software: um guia prático — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Testes automatizados de software - Um guia pratico - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Construir uma estratégia equilibrada de testes que dê confiança sem acoplar a suíte à implementação.

## Use quando

- Definir casos de unidade e equivalência.
- Escolher mocks e testes de integração.
- Automatizar fluxos de sistema.
- Testar APIs e organizar dados de teste.

## Não use quando

- Automatizar somente pela interface quando uma camada menor detecta o erro.
- Mockar DAO e concluir que o banco está testado.
- Confundir cobertura alta com risco baixo.

## Conteúdo da obra que governa esta skill

- Testes de unidade e casos especiais.
- Convenções, legibilidade, classes de equivalência e Test Data Builders.
- TDD e seus efeitos no design.
- Mock Objects e isolamento.
- Testes de integração com DAO e banco.
- Testes de sistema, Page Objects, formulários e limpeza de dados.
- APIs de criação de cenários.
- Testes de serviços web e JSON.
- Equilíbrio com testes manuais e outros tipos.

## Modelos mentais e técnicas derivados do livro

- Classe de equivalência reduz combinações escolhendo representantes de comportamentos iguais.
- Teste deve ter isolamento suficiente para falha diagnóstica.
- Builder cria dados relevantes com defaults claros.
- Mock verifica colaboração quando essa interação é parte do contrato.
- Integração valida componentes reais juntos, incluindo banco.
- Page Object encapsula interação com página, não assertions de negócio.
- Teste de API verifica status, headers, contrato, corpo e efeitos.
- Teste manual exploratório continua útil para riscos não antecipados.

## Procedimento operacional

1. Liste riscos e comportamentos por camada.
2. Escolha casos válidos, limites, inválidos e equivalências.
3. Escreva unidades rápidas para regra isolável.
4. Use integração para SQL, transação, arquivos e serviços.
5. Use sistema/E2E somente nos fluxos críticos.
6. Crie builders e mecanismos confiáveis de reset de dados.
7. Teste contrato de API e efeitos persistidos.
8. Acompanhe tempo, flakiness e capacidade de diagnóstico da suíte.

## Perguntas obrigatórias antes de recomendar

- Qual falha este teste detecta melhor que outro nível?
- O caso representa uma classe de equivalência relevante?
- O mock está verificando detalhe interno frágil?
- O banco é limpo e reproduzível entre testes?
- O teste E2E cobre um fluxo crítico ou duplica muitos testes menores?
- A falha aponta claramente para o problema?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Monte matriz por perfil: gestor, operador e motorista; cubra unidades de regras, integração MySQL/API, contratos de sync e poucos E2E críticos. No Flutter atual, use integration_test, não flutter_driver.

## Limites de fidelidade e atualização

- Ferramentas citadas na obra podem ser específicas de Java e de sua época; adapte o princípio ao PHP, Playwright e Flutter atuais.
- Não há pirâmide universal; a distribuição depende do risco e da arquitetura.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
