---
name: livro-mysql
description: "Aplica o percurso do livro MySQL: modelagem, tipos, integridade, DDL/DML, consultas, funções, procedures, triggers, índices, views, backup e segurança."
user-invocable: true
---

# MySQL na prática

## Base bibliográfica

- **Obra:** MySQL: comece com o principal banco de dados open source do mercado — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: MySQL Comece com o principal banco de dados open source do mercado - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Projetar e operar banco relacional com integridade, consultas corretas e manutenção previsível.

## Use quando

- Modelar tabelas, chaves e relacionamentos.
- Criar e revisar consultas, joins, subconsultas e funções.
- Avaliar índices, views, procedures e triggers.
- Planejar backup, usuários e segurança.

## Não use quando

- Alterar schema automaticamente durante requisições da aplicação.
- Criar trigger ou procedure para esconder regra que deveria ser visível na aplicação.
- Adicionar índice sem examinar consulta, seletividade e custo de escrita.

## Conteúdo da obra que governa esta skill

- Introdução, banco e usuários.
- Tipos de dados e modelagem.
- Criação de tabelas e integridade.
- Inserção, atualização, exclusão e consulta.
- Subqueries, joins e uso de SELECT em outras operações.
- Funções de texto, agrupamento, cálculo e data.
- Stored procedures, functions e event scheduler.
- Triggers.
- Índices e views.
- Backup, importação, variáveis, conexões, ferramentas e segurança.

## Modelos mentais e técnicas derivados do livro

- Tipo de dado deve representar domínio, faixa, precisão e nulabilidade.
- Chaves e constraints protegem invariantes no ponto central dos dados.
- JOIN deve refletir relacionamento conhecido e cardinalidade esperada.
- Índice acelera padrões específicos de leitura e cobra custo em escrita e espaço.
- Transação agrupa operações que precisam confirmar ou falhar juntas.
- Trigger possui efeitos implícitos e deve ser usada com cautela.
- Backup não é proteção enquanto a restauração não for testada.
- Usuário da aplicação deve ter apenas privilégios necessários.

## Procedimento operacional

1. Levante entidades, identificadores, relações e regras de integridade.
2. Escolha tipos, nulabilidade, defaults e constraints.
3. Crie migration versionada e reversível quando possível.
4. Escreva consultas com dados de teste representativos.
5. Analise plano de execução antes de indexar.
6. Defina transações para operações compostas.
7. Documente qualquer procedure, trigger ou event scheduler e seus efeitos.
8. Execute backup, restauração e teste de consistência.

## Perguntas obrigatórias antes de recomendar

- A regra pode ser violada por acesso concorrente ou outra aplicação?
- O tipo suporta todos os valores válidos sem perda?
- A consulta pode multiplicar linhas por cardinalidade inesperada?
- O índice corresponde ao filtro, ordenação e prefixo usados?
- A migration convive com a versão anterior da aplicação?
- A restauração foi realmente ensaiada?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Use migrations idempotentes e versionadas para viagens, passageiros, veículos, notificações e auditoria. Não coloque ALTER TABLE ou criação oportunista de colunas dentro do fluxo HTTP normal.

## Limites de fidelidade e atualização

- Recursos e sintaxe variam por versão de MySQL/MariaDB; confirme no servidor real.
- A obra introduz recursos do banco; a decisão de usar procedure ou trigger deve considerar manutenção do sistema.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
