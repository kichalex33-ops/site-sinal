---
name: livro-arquitetura-software
description: "Aplica os temas do livro Introdução à Arquitetura e Design de Software: interfaces, composição, imutabilidade, coesão, injeção de dependências, testes, camadas, ORM, integração e REST."
user-invocable: true
---

# Arquitetura e Design de Software

## Base bibliográfica

- **Obra:** Introdução à Arquitetura e Design de Software — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Introducao a Arquitetura e Design de Software - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Analisar decisões de design e arquitetura sem confundir escolha de framework com qualidade estrutural.

## Use quando

- Avaliar divisão de responsabilidades e dependências entre módulos.
- Escolher entre composição e herança, interfaces e implementações concretas.
- Projetar camadas, integração entre sistemas, persistência e comunicação assíncrona.
- Registrar trade-offs de uma decisão arquitetural.

## Não use quando

- Usar o livro como justificativa automática para microserviços ou nuvem.
- Transportar exemplos específicos de Java para PHP ou Dart sem adaptar o mecanismo.
- Criar abstrações apenas porque aparecem no catálogo do livro.

## Conteúdo da obra que governa esta skill

- Plataforma e runtime: conhecer limites da tecnologia adotada.
- Orientação a objetos: programar para interfaces, compor comportamentos, favorecer composição, imutabilidade e simplicidade.
- Separação de responsabilidades: baixo acoplamento, alta coesão e gerenciamento explícito de dependências.
- Testes e automação: testes de unidade, sistema, integração e feedback por integração contínua.
- Decisões arquiteturais: layers versus tiers, MVC, ORM, distribuição, comunicação assíncrona e cloud.
- Integração na Web: contratos, compatibilidade, SOA e REST.

## Modelos mentais e técnicas derivados do livro

- Uma interface reduz acoplamento apenas quando representa um contrato estável e útil.
- Composição permite variar comportamento sem depender da árvore de herança.
- Injeção de dependências torna criação e uso de objetos decisões separadas.
- Camadas são separações lógicas; tiers são separações físicas de execução.
- ORM não elimina a necessidade de compreender SQL, transações e custo das consultas.
- Distribuição adiciona falhas de rede, latência e complexidade operacional.
- Contratos públicos devem evoluir preservando compatibilidade ou oferecendo migração explícita.

## Procedimento operacional

1. Classifique a decisão: implementação local, design de módulo ou arquitetura do sistema.
2. Mapeie responsabilidades, dependências e recursos externos envolvidos.
3. Verifique coesão de cada módulo e direção das dependências.
4. Compare pelo menos duas alternativas e explicite forças, custos e riscos.
5. Avalie testabilidade, compatibilidade, operação e impacto no banco.
6. Escolha a solução mais simples que preserve a evolução esperada.
7. Registre a decisão, hipóteses e condição de revisão.

## Perguntas obrigatórias antes de recomendar

- O problema exige nova abstração ou apenas melhor separação de uma responsabilidade?
- A dependência é conceitual, de implementação ou apenas de construção do objeto?
- A divisão em camadas melhora compreensão ou apenas espalha código?
- Há consulta, transação ou contrato de integração cujo custo está oculto?
- Qual falha nova aparece se o componente for distribuído?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Use esta lente para separar regras de viagem, acesso a dados, HTTP, autenticação e integrações. Não presuma a estrutura atual; primeiro inspecione módulos, dependências, testes e deploy.

## Limites de fidelidade e atualização

- A obra usa fortemente o ecossistema Java; adapte os mecanismos para PHP e Flutter sem perder o princípio.
- Cloud, frameworks e versões mudam; valide detalhes operacionais em documentação oficial atual.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
