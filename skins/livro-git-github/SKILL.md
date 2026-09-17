---
name: livro-git-github
description: "Aplica o fluxo do livro: histórico local, remotos, GitHub, branches, colaboração, conflitos, tags e manutenção do repositório."
user-invocable: true
---

# Controlando versões com Git e GitHub

## Base bibliográfica

- **Obra:** Controlando versões com Git e GitHub — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Controlando versoes com Git e GitHub - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Preservar histórico, facilitar colaboração e tornar mudanças reversíveis e auditáveis.

## Use quando

- Iniciar ou revisar um repositório.
- Organizar commits, branches e remotos.
- Resolver conflitos e integrar trabalho.
- Marcar versões e preparar releases.

## Não use quando

- Usar Git como backup de segredos ou arquivos gerados pesados.
- Misturar várias mudanças independentes no mesmo commit.
- Executar rebase ou reset destrutivo em histórico compartilhado sem compreender o impacto.

## Conteúdo da obra que governa esta skill

- Motivação: histórico, colaboração e recuperação.
- Repositório local: rastreamento, staging, commits, log, diff e desfazer.
- Repositórios remotos e sincronização.
- GitHub como hospedagem e colaboração.
- Branches locais e remotas.
- Merge, conflitos e resolução.
- Tags e versões.
- Modelos de colaboração e contribuição.

## Modelos mentais e técnicas derivados do livro

- Working tree, staging area e repositório são estados diferentes.
- Commit deve representar uma unidade coerente e explicável.
- Branch é um ponteiro móvel para uma linha de desenvolvimento.
- Merge combina históricos; conflito exige decisão semântica, não apenas remoção de marcadores.
- Pull envolve obtenção e integração; as duas ações devem ser compreendidas.
- Tag identifica uma versão; release deve ser reproduzível a partir dela.
- Histórico público deve ser alterado com cautela.

## Procedimento operacional

1. Inspecione status, branches, remotos e histórico antes de agir.
2. Separe arquivos gerados, segredos e configuração local no ignore adequado.
3. Faça mudanças pequenas e revise diff antes de adicionar.
4. Crie commit com mensagem que explique intenção.
5. Sincronize e integre mudanças conscientemente.
6. Resolva conflitos executando testes do comportamento combinado.
7. Marque releases e registre artefato, migration e instruções de rollback.

## Perguntas obrigatórias antes de recomendar

- Este commit contém uma única intenção?
- Algum segredo, backup ou arquivo de ambiente está sendo rastreado?
- A branch parte da base correta?
- O conflito foi resolvido semanticamente e testado?
- É possível reconstruir a versão publicada a partir da tag?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

O projeto deve ter repositório limpo, branches curtas, commits intencionais e tags para pacotes de homologação e produção. O ZIP publicado deve corresponder a um commit identificável.

## Limites de fidelidade e atualização

- Alguns comandos e nomes de branch do livro refletem práticas antigas; use comandos modernos equivalentes quando apropriado.
- Políticas de GitHub e proteção de branches devem ser verificadas na documentação atual.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
