---
name: livro-php-avancado
description: "Aplica a abordagem do livro para componentes PHP: eventos, injeção de dependências, filtros, validadores, segurança, ORM, web services e internacionalização."
user-invocable: true
---

# Programação Web Avançada com PHP

## Base bibliográfica

- **Obra:** Programação Web Avançada com PHP: construindo software com componentes — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Programacao Web Avancada Com Php Construindo Software Com Componentes - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Construir módulos PHP coesos, reutilizáveis e integráveis sem acoplar toda a aplicação a classes utilitárias globais.

## Use quando

- Extrair componentes e serviços de código monolítico.
- Organizar eventos, dependências, validação e conversão.
- Projetar autenticação, autorização e criptografia.
- Integrar ORM, web services e serviços internos.

## Não use quando

- Criar um framework interno completo para resolver uma única tela.
- Usar eventos quando uma chamada direta é mais clara.
- Confundir reutilização com generalização antecipada.

## Conteúdo da obra que governa esta skill

- Desenvolvimento orientado a componentes.
- Eventos e comunicação desacoplada.
- Injeção e gerenciamento de dependências.
- Filtros, conversores e validadores.
- Criptografia, autenticação e permissões.
- Mapeamento objeto-relacional.
- Web services, APIs e serviços internos.
- Internacionalização.

## Modelos mentais e técnicas derivados do livro

- Componente deve ter contrato, responsabilidade e dependências explícitas.
- Evento comunica algo que ocorreu; não deve esconder a ordem crítica do fluxo.
- Injeção separa uso de dependência de sua construção.
- Filtro transforma ou normaliza; validador decide aceitabilidade e explica falha.
- Autenticação identifica; autorização decide permissão.
- Criptografia, hash e codificação resolvem problemas diferentes.
- ORM mapeia objetos e tabelas, mas não elimina transações e SQL.
- Serviço interno deve expor operação coesa e contrato estável.

## Procedimento operacional

1. Identifique responsabilidade e contrato do componente.
2. Liste dependências obrigatórias e opcionais.
3. Defina entrada, saída, falhas e efeitos laterais.
4. Escolha chamada direta, evento ou pipeline pela necessidade real.
5. Separe normalização, validação e regra de negócio.
6. Aplique autenticação e autorização nas fronteiras corretas.
7. Teste o componente isolado e sua integração com banco/serviço.
8. Documente extensão, configuração e ciclo de vida.

## Perguntas obrigatórias antes de recomendar

- O componente pode ser compreendido sem conhecer a aplicação inteira?
- A dependência está explícita ou escondida em global/static?
- Evento melhora extensibilidade ou prejudica rastreabilidade?
- O dado foi normalizado antes de validar?
- A permissão é verificada no servidor e no recurso específico?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Extraia autenticação de motorista, sincronização, notificações e regras de viagem em componentes com contratos claros. Preserve uma composição simples adequada a PHP em hospedagem compartilhada.

## Limites de fidelidade e atualização

- A sintaxe e bibliotecas do livro refletem a versão de sua época; atualize para o PHP instalado.
- O livro apresenta mecanismos; arquitetura e segurança atual devem ser validadas separadamente.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
