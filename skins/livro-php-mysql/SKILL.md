---
name: livro-php-mysql
description: "Aplica a progressão prática do livro: requisição, formulários, sessões, SQL seguro, CRUD, orientação a objetos, MVC, upload e e-mail."
user-invocable: true
---

# Desenvolvimento web com PHP e MySQL

## Base bibliográfica

- **Obra:** Desenvolvimento web com PHP e MySQL — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Desenvolvimento web com PHP e MySQL - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Construir fluxos web PHP completos com segurança básica e organização progressiva.

## Use quando

- Criar formulários e CRUDs.
- Trabalhar com sessão, autenticação e persistência.
- Migrar código procedural para objetos e MVC.
- Implementar upload e envio de e-mail com validação.

## Não use quando

- Concatenar entrada do usuário em SQL.
- Exibir dados sem codificação adequada ao contexto HTML.
- Confiar em validação do navegador como proteção do servidor.

## Conteúdo da obra que governa esta skill

- Ciclo requisição, processamento e resposta.
- Formulários, parâmetros, validação e sessões.
- Conexão e manipulação do MySQL.
- CRUD e consultas.
- Prevenção de SQL Injection.
- Evolução de procedural para orientação a objetos e MVC.
- Uploads, arquivos e e-mail.
- Organização e reutilização do código.

## Modelos mentais e técnicas derivados do livro

- Toda entrada externa é não confiável até ser validada.
- Prepared statements separam comando SQL de dados.
- Codificação de saída depende do contexto em que o valor será inserido.
- Sessão mantém estado no servidor, mas identificador e expiração precisam de proteção.
- PRG evita reenvio acidental de formulários.
- MVC separa entrada/coordenação, regras/dados e apresentação, sem exigir framework.
- Upload exige limite, nome gerado, verificação de conteúdo e armazenamento seguro.

## Procedimento operacional

1. Defina campos, tipos, obrigatoriedade e mensagens.
2. Valide e normalize no servidor.
3. Use prepared statements e transação quando várias operações forem atômicas.
4. Codifique saída conforme HTML, atributo, URL ou JavaScript.
5. Aplique autenticação, autorização e proteção CSRF quando necessário.
6. Separe controller, serviço/modelo e view conforme o fluxo crescer.
7. Teste casos válidos, inválidos, duplicados e concorrentes.

## Perguntas obrigatórias antes de recomendar

- O servidor rejeita dados inválidos independentemente do navegador?
- A consulta usa parâmetros vinculados?
- O valor será exibido em qual contexto?
- A ação modifica estado e precisa de CSRF?
- O usuário autenticado tem permissão sobre este registro específico?
- O upload pode ser executado ou servido como HTML?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Use para telas administrativas e APIs PHP simples, mas não deixe regras de viagem e autorização espalhadas em páginas. Evolua incrementalmente para serviços e contratos testáveis.

## Limites de fidelidade e atualização

- Exemplos da obra podem usar APIs antigas; use PDO/MySQLi e recursos compatíveis com o PHP atual.
- Segurança completa exige combinar com a skill de segurança web.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
