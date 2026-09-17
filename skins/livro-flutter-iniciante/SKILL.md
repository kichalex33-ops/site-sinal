---
name: livro-flutter-iniciante
description: "Aplica o conteúdo introdutório do livro: proposta do Flutter, ambiente, arquitetura, Dart, widgets, dependências, prototipação, HTTP, banco local e testes de widgets."
user-invocable: true
---

# Iniciando com Flutter Framework

## Base bibliográfica

- **Obra:** Iniciando com Flutter Framework: desenvolva aplicações móveis no Dart Side — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Iniciando Com Flutter Framework Desenvolva Aplicacoes Moveis No Dart Side - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Construir e revisar fundamentos de um aplicativo Flutter antes de introduzir abstrações avançadas.

## Use quando

- Preparar ambiente e entender estrutura do projeto.
- Revisar Dart necessário ao Flutter.
- Construir interface com widgets e layouts.
- Gerenciar dependências, requisições, banco local e testes básicos.

## Não use quando

- Usar exemplos da versão do livro como documentação atual.
- Editar arquivos gerados sem entender a plataforma.
- Introduzir gerenciamento de estado complexo antes de dominar ciclo de vida e widgets.

## Conteúdo da obra que governa esta skill

- Problemas que o Flutter pretende resolver e seus compromissos.
- Ambiente de desenvolvimento e plataformas.
- Arquitetura do framework e papel do Dart.
- Widgets como unidade de composição.
- Dependências e arquivo de configuração do projeto.
- Prototipação e construção visual.
- Aplicativo mais complexo, requisições e organização.
- Banco de dados local.
- Testes automatizados de widgets.
- Ícone, empacotamento e limites do framework.

## Modelos mentais e técnicas derivados do livro

- Tudo na interface é composto por widgets, mas nem todo estado deve permanecer dentro do widget.
- StatelessWidget descreve interface sem estado mutável local; StatefulWidget possui ciclo de vida e estado associado.
- Build pode ser chamado muitas vezes e não deve executar efeitos externos imprevisíveis.
- Dependências devem ser declaradas e versionadas conscientemente.
- Layout é resultado de constraints descendo e tamanhos subindo na árvore.
- Requisição e persistência precisam representar carregamento, sucesso, vazio e erro.
- Teste de widget verifica interação e resultado visual em ambiente controlado.

## Procedimento operacional

1. Confirme versão de Flutter/Dart e execute diagnóstico do ambiente.
2. Leia estrutura, pubspec e ponto de entrada antes de alterar.
3. Modele a tela como árvore de widgets e defina estado mínimo.
4. Implemente primeiro o fluxo visual com dados controlados.
5. Adicione serviço HTTP ou banco atrás de contrato simples.
6. Represente todos os estados de carregamento e falha.
7. Escreva teste de widget para tarefa principal.
8. Valide em dispositivo real e em tamanhos diferentes.

## Perguntas obrigatórias antes de recomendar

- O estado pertence à tela, ao fluxo ou ao domínio?
- Há efeito externo dentro de build?
- A árvore está profunda por necessidade ou por falta de componentes?
- A interface trata ausência de rede e banco vazio?
- A dependência é compatível com a versão do SDK?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

No app motorista, use esta skill para telas, formulários, navegação, HTTP e testes básicos. Para offline, segurança e sincronização, combine com DDIA, segurança e testes.

## Limites de fidelidade e atualização

- A obra usa Flutter 1.x e Dart 2.x; comandos e APIs devem ser confirmados na documentação atual.
- Não trate Flutter como solução universal; avalie restrições de plataforma e operação.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
