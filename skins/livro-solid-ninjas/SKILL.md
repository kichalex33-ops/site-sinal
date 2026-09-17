---
name: livro-solid-ninjas
description: "Aplica o conteúdo do livro sobre coesão, encapsulamento, acoplamento, SRP, OCP, LSP, ISP, DIP, composição e sinais de degradação do design."
user-invocable: true
---

# Orientação a Objetos e SOLID para Ninjas

## Base bibliográfica

- **Obra:** Orientação a Objetos e SOLID para Ninjas: projetando classes flexíveis — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Orientacao a Objetos e SOLID para Ninjas Projetando classes flexiveis - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Projetar classes flexíveis e localizar responsabilidades mal distribuídas sem transformar SOLID em ritual.

## Use quando

- Revisar classes extensas ou frágeis.
- Separar regra, infraestrutura e apresentação.
- Reduzir condicionais de variação e dependências concretas.
- Avaliar herança, composição e interfaces.

## Não use quando

- Contar métodos ou dependências como prova automática de violação.
- Criar abstração sem cliente ou variação real.
- Confundir teste de integração com falha do DIP.

## Conteúdo da obra que governa esta skill

- Coesão e Single Responsibility Principle.
- Encapsulamento e proteção de invariantes.
- Acoplamento e Dependency Inversion.
- Open/Closed Principle e pontos de variação.
- Herança, composição e Liskov Substitution.
- Interfaces específicas e Interface Segregation.
- Separação de modelo, infraestrutura e arquitetura.
- Maus cheiros e métricas como pistas.

## Modelos mentais e técnicas derivados do livro

- Responsabilidade é um motivo de mudança, não uma tarefa minúscula.
- Encapsular significa proteger estado e decisões, não apenas usar getters/setters.
- DIP faz políticas dependerem de contratos adequados, não de detalhes.
- OCP é alcançado em pontos de variação conhecidos, não em todo lugar.
- Subtipo deve preservar expectativas do contrato e não surpreender o cliente.
- Composição costuma permitir variação mais local que herança.
- Interface deve refletir necessidades do cliente e não a totalidade da implementação.
- Métrica orienta inspeção; não substitui julgamento.

## Procedimento operacional

1. Descreva responsabilidades e motivos de mudança da classe.
2. Mapeie dependências, efeitos e dados que ela controla.
3. Proteja invariantes dentro do objeto apropriado.
4. Identifique variações reais e escolha composição ou estratégia.
5. Revise contratos de herança e substituição.
6. Divida interfaces por clientes e casos de uso.
7. Adicione testes que comprovem comportamento antes da extração.
8. Verifique se o número total de conceitos ficou menor.

## Perguntas obrigatórias antes de recomendar

- Quantos motivos independentes podem alterar esta classe?
- O objeto impede estado inválido ou apenas expõe dados?
- Qual política depende de qual detalhe?
- A subclasse pode ser usada sem condições especiais?
- A interface força cliente a depender de método que não usa?
- A abstração resolve uma variação observada?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Separe autenticação, viagens, sincronização, notificações e persistência quando houver motivos de mudança distintos. Evite transformar cada endpoint em várias interfaces sem benefício mensurável.

## Limites de fidelidade e atualização

- SOLID orienta design orientado a objetos, não determina arquitetura completa.
- Classes simples de dados e integrações podem justificar decisões diferentes do exemplo didático.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
