---
name: livro-devops
description: "Aplica o fluxo do livro DevOps na prática: produção, monitoramento, infraestrutura como código, integração contínua, pipeline, configuração, banco e segurança."
user-invocable: true
---

# DevOps na Prática

## Base bibliográfica

- **Obra:** DevOps na prática: entrega de software confiável e automatizada — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: DevOps na pratica - entrega de software confiavel e automatizada - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Reduzir risco e tempo entre uma mudança de código e sua operação confiável em produção.

## Use quando

- Criar ou revisar pipeline de build, testes e deploy.
- Automatizar ambientes e configurações.
- Planejar monitoramento, alertas e rollback.
- Gerenciar mudanças de banco e segurança na entrega.

## Não use quando

- Confundir DevOps com instalar uma ferramenta.
- Automatizar um processo inseguro sem primeiro entendê-lo.
- Promover deploy automático sem observabilidade e rollback.

## Conteúdo da obra que governa esta skill

- Produção como destino e fonte de feedback.
- Monitoramento e resposta a incidentes.
- Infraestrutura como código e separação entre infraestrutura e aplicação.
- Integração contínua apoiada por controle de versão, build e testes.
- Pipeline de entrega e artefatos reproduzíveis.
- Configuração por ambiente, mudanças de banco, orquestração e segurança.
- DevOps como colaboração, não apenas ferramentas.

## Modelos mentais e técnicas derivados do livro

- Pequenos lotes reduzem risco e tornam falhas localizáveis.
- Ambiente deve ser reproduzível e versionado quando a infraestrutura permitir.
- Um mesmo artefato deve avançar pelos ambientes; configuração muda externamente.
- Monitoramento verifica serviço e resultado de negócio, não só processo ativo.
- Mudança de banco precisa ser compatível com versões em transição.
- Rollback deve ser planejado antes do deploy.
- Pipeline é uma cadeia de evidências, não uma sequência decorativa.

## Procedimento operacional

1. Mapeie o caminho atual da alteração até produção e seus passos manuais.
2. Defina artefato, configuração, segredos e responsabilidades.
3. Automatize validações locais e integração contínua.
4. Construa pipeline com build, testes, análise, empacotamento e promoção.
5. Planeje migration compatível, backup e teste de restauração.
6. Execute deploy com smoke tests, observabilidade e critério de rollback.
7. Registre incidentes e incorpore o aprendizado ao pipeline.

## Perguntas obrigatórias antes de recomendar

- O deploy é repetível por outra pessoa?
- O mesmo artefato é usado em homologação e produção?
- Qual sinal mostra que o usuário realmente consegue concluir a tarefa?
- Como reverter código, configuração e banco?
- Segredos ficam fora do repositório e dos logs?
- Qual etapa manual mais gera erro ou atraso?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Na HostGator, adapte infraestrutura como código aos limites de hospedagem compartilhada. Ainda assim, versionamento, pacote reproduzível, migrations, backup, smoke test e rollback continuam aplicáveis.

## Limites de fidelidade e atualização

- Ferramentas exemplificadas no livro podem estar desatualizadas; preserve o fluxo e consulte documentação atual.
- Não presuma acesso root, containers ou serviços de CI disponíveis.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
