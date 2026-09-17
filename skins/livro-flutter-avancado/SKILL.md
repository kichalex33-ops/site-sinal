---
name: livro-flutter-avancado
description: "Aplica o percurso prático do livro Aprofundando em Flutter: widgets, splash, Shared Preferences, menus, animações, BLoC, rotas, formulários, persistência e atualização de listas."
user-invocable: true
---

# Aprofundando em Flutter

## Base bibliográfica

- **Obra:** Aprofundando em Flutter: desenvolva aplicações Dart com Widgets — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Aprofundando em Flutter Desenvolva aplicacoes Dart com Widgets - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Usar os recursos praticados na obra para evoluir um aplicativo Flutter já funcional.

## Use quando

- Criar splash e fluxo inicial.
- Persistir preferências e dados locais simples.
- Implementar menu, Drawer, animações, rotas e formulários.
- Separar eventos e estados com BLoC quando o fluxo justificar.
- Atualizar listas e validar regras de interação.

## Não use quando

- Tratar a arquitetura do aplicativo-exemplo como padrão universal.
- Usar Shared Preferences para dados sensíveis ou relacionais complexos.
- Adicionar BLoC a telas triviais sem ganho de clareza.

## Conteúdo da obra que governa esta skill

- Ambientação e estrutura do projeto Flutter.
- Splash screen e inicialização.
- Persistência simples com Shared Preferences.
- Menus, Drawer e animações.
- BLoC para eventos e atualização de estado.
- Rotas, transições e formulários.
- Persistência de dados e recuperação para listas.
- Remoção, destaque de alterações e atualização de ListView.
- Lógica de interação, validação, vitória e derrota no aplicativo-exemplo.

## Modelos mentais e técnicas derivados do livro

- Widget descreve interface a partir do estado atual.
- Inicialização deve separar carregamento, decisão de rota e apresentação.
- Persistência local precisa de chave, tipo, leitura, escrita e estratégia de erro.
- BLoC separa entrada de eventos da emissão de estados, mas adiciona estrutura.
- Rotas carregam contexto de navegação e devem tratar retorno/cancelamento.
- Atualizar coleção exige manter fonte de verdade e reconstrução previsível da lista.
- Validação deve impedir transição inválida e comunicar o motivo ao usuário.

## Procedimento operacional

1. Localize o estado e a fonte de verdade da funcionalidade.
2. Defina eventos de usuário e estados visíveis.
3. Escolha setState, ValueNotifier ou BLoC conforme complexidade observada.
4. Implemente persistência com contrato de leitura, escrita e falha.
5. Modele navegação, retorno e restauração de contexto.
6. Atualize listas de forma determinística após inserir, editar ou remover.
7. Teste inicialização, rotação, retorno, erro, ausência de dados e ação repetida.

## Perguntas obrigatórias antes de recomendar

- Qual estado realmente precisa sobreviver ao fechamento do app?
- O fluxo possui eventos e estados suficientes para justificar BLoC?
- Quem é a fonte de verdade: widget, BLoC, serviço ou armazenamento?
- O que ocorre ao tocar duas vezes, voltar ou interromper a operação?
- A animação comunica mudança ou apenas enfeita?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Use os conceitos para viagens, checklists, preferências do motorista e filas offline. Dados clínicos, credenciais e operações críticas exigem armazenamento e sincronização mais robustos que Shared Preferences.

## Limites de fidelidade e atualização

- A obra foi escrita para versões antigas de Flutter; APIs concretas precisam ser verificadas na documentação atual.
- O livro ensina por um aplicativo específico; preserve conceitos, não copie sua arquitetura indiscriminadamente.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
