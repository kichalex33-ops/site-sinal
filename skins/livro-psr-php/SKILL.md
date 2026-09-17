---
name: livro-psr-php
description: "Aplica o conteúdo do livro sobre interoperabilidade PHP-FIG: estilo básico, autoload, logging, HTTP e contratos padronizados, distinguindo o conteúdo histórico das normas atuais."
user-invocable: true
---

# PSRs e boas práticas de PHP

## Base bibliográfica

- **Obra:** PSRs: boas práticas de programação com PHP — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: PSRS Boas praticas de programacao com PHP - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Reduzir diferenças arbitrárias e facilitar integração entre componentes PHP.

## Use quando

- Padronizar estilo e organização de namespaces.
- Adotar autoload e Composer.
- Definir logging interoperável.
- Avaliar interfaces HTTP e outros contratos PHP-FIG.

## Não use quando

- Tratar toda PSR como obrigatória para qualquer projeto.
- Misturar regras históricas descontinuadas com o padrão atual sem indicar a diferença.
- Aplicar formatação manual sem ferramenta automatizada.

## Conteúdo da obra que governa esta skill

- Motivação do PHP-FIG e interoperabilidade.
- Padrão básico de código.
- Guia de estilo.
- Autoload por namespaces e caminhos.
- Interface de logger e níveis.
- Contratos HTTP e outras PSRs apresentadas na obra.
- Uso de ferramentas e componentes compatíveis.

## Modelos mentais e técnicas derivados do livro

- PSR é contrato de interoperabilidade; não é certificação geral de qualidade.
- Namespace e autoload eliminam includes espalhados e colisões previsíveis.
- Logger recebe mensagem, contexto e nível; não deve registrar segredos.
- MUST, SHOULD e MAY têm pesos normativos diferentes.
- Estilo deve ser automatizado para não consumir revisão humana.
- Uma PSR histórica pode ter sido substituída; a intenção deve ser preservada na norma atual.

## Procedimento operacional

1. Identifique versão do PHP, Composer e convenções existentes.
2. Mapeie namespaces, caminhos e pontos de inclusão manual.
3. Escolha o conjunto mínimo de PSRs que resolve interoperabilidade real.
4. Configure autoload e ferramenta de estilo.
5. Centralize logging com contexto e política de redaction.
6. Execute análise automática no pipeline.
7. Documente exceções e migre incrementalmente.

## Perguntas obrigatórias antes de recomendar

- A norma escolhida está ativa ou substituída?
- O namespace corresponde ao caminho configurado?
- O log contém senha, token, documento ou dado de saúde?
- A regra é normativa ou preferência local?
- A mudança quebra classes legadas carregadas manualmente?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Adote autoload consistente, estilo automatizado e logging estruturado no backend. Migre módulos sem interromper o deploy compartilhado e mantenha compatibilidade durante a transição.

## Limites de fidelidade e atualização

- A obra retrata o conjunto de PSRs de sua época. Consulte PHP-FIG atual para saber status e substituições.
- O padrão de estilo moderno pode ser PER Coding Style em vez das PSRs históricas do livro.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
