---
name: livro-ddia
description: "Aplica os trade-offs de sistemas de dados: confiabilidade, escalabilidade, manutenção, modelos, armazenamento, evolução, replicação, particionamento, transações, consistência e processamento."
user-invocable: true
---

# Designing Data-Intensive Applications

## Base bibliográfica

- **Obra:** Designing Data-Intensive Applications — Martin Kleppmann; considerar a edição disponível
- **Fonte usada nesta versão:** Síntese dos conceitos centrais e da estrutura editorial oficial; o livro não estava entre os EPUBs fornecidos.
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Avaliar sistemas de dados por propriedades e trade-offs, não por preferência de ferramenta.

## Use quando

- Modelar persistência, sincronização, eventos e histórico.
- Analisar confiabilidade, carga, latência e evolução de esquema.
- Projetar idempotência, deduplicação e recuperação após falhas.
- Comparar processamento transacional, analítico, batch e stream.

## Não use quando

- Introduzir distribuição, filas ou replicação sem necessidade demonstrada.
- Tratar consistência eventual como desculpa para dados incorretos.
- Escolher tecnologia por popularidade sem caracterizar carga e falhas.

## Conteúdo da obra que governa esta skill

- Confiabilidade, escalabilidade e manutenibilidade.
- Modelos de dados e linguagens de consulta.
- Estruturas de armazenamento, índices e recuperação.
- Codificação, compatibilidade e evolução de esquemas.
- Replicação e particionamento.
- Transações, níveis de isolamento e anomalias.
- Falhas distribuídas, relógios, consenso e consistência.
- Processamento em lote, streams e sistemas derivados.

## Modelos mentais e técnicas derivados do livro

- Não existe solução universal; tecnologias fazem compromissos diferentes.
- Carga deve ser descrita por parâmetros mensuráveis, não por adjetivos.
- Latência deve considerar distribuição e percentis, não apenas média.
- Sistema de registro e dados derivados têm papéis diferentes.
- Compatibilidade para frente e para trás orienta evolução de formatos.
- Retries exigem idempotência ou deduplicação.
- Transações evitam certas anomalias, mas o nível de isolamento precisa ser conhecido.
- Falhas parciais são normais em sistemas distribuídos.

## Procedimento operacional

1. Defina dados autoritativos, derivados e respectivos proprietários.
2. Caracterize volume, taxa de leitura/escrita, picos, latência e retenção.
3. Liste falhas plausíveis: queda, timeout, repetição, reordenação e concorrência.
4. Escolha modelo de dados e índices a partir das consultas reais.
5. Defina atomicidade, isolamento e consistência exigidos por operação.
6. Projete evolução de esquema e compatibilidade de clientes.
7. Especifique idempotência, deduplicação, retries e reconciliação.
8. Meça comportamento e documente o trade-off aceito.

## Perguntas obrigatórias antes de recomendar

- Qual é a fonte de verdade?
- O que pode ser reconstruído e o que não pode ser perdido?
- Qual anomalia de concorrência seria inaceitável?
- Uma repetição da mesma requisição produz efeito duplicado?
- Como cliente antigo e servidor novo convivem durante atualização?
- Qual percentil de latência importa para o usuário?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Aplique principalmente à sincronização offline do motorista, eventos de viagem, notificações, uploads, relatórios e auditoria. Para a escala municipal atual, um MySQL bem modelado pode ser superior a uma arquitetura distribuída prematura.

## Limites de fidelidade e atualização

- Capítulos e tecnologias variam entre edições; preserve os trade-offs, mas confirme detalhes da edição utilizada.
- Não atribua ao livro decisões específicas sobre MySQL, Flutter ou provedores atuais.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
