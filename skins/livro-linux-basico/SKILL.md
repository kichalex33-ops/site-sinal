---
name: livro-linux-basico
description: "Aplica o percurso do livro: shell, arquivos, compactação, hierarquia, usuários, permissões, APT, stack web, processos e shell scripts."
user-invocable: true
---

# Começando com Linux

## Base bibliográfica

- **Obra:** Começando com o Linux: comandos, serviços e administração — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Comecando com o Linux - Comandos, servicos e administracao - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Executar tarefas básicas de Linux com compreensão de arquivos, permissões, processos e automação.

## Use quando

- Navegar e manipular arquivos no terminal.
- Gerenciar usuários, grupos e permissões.
- Instalar pacotes em Debian/Ubuntu quando houver privilégio.
- Inspecionar processos e criar scripts simples de backup.

## Não use quando

- Executar comandos destrutivos sem confirmar caminho e backup.
- Presumir acesso administrativo em hospedagem compartilhada.
- Copiar comandos de pacote para distribuição diferente.

## Conteúdo da obra que governa esta skill

- Introdução ao Linux e instalação.
- Shell, diretórios, arquivos, ajuda e localização.
- Editores e visualização de conteúdo.
- Compactação com tar, gzip e zip.
- Hierarquia de diretórios, /proc e /sys.
- Usuários, grupos e permissões.
- Gerenciamento de pacotes com APT.
- Instalação de Apache, PHP e MySQL.
- Processos, sinais e prioridades.
- Shell script, estruturas de controle, backup e configuração.

## Modelos mentais e técnicas derivados do livro

- Caminho absoluto e relativo têm efeitos diferentes.
- Permissões se aplicam a proprietário, grupo e outros.
- Diretórios exigem permissão de execução para travessia.
- Processo possui identificador, usuário, estado e sinais possíveis.
- Compactação e arquivamento são operações distintas.
- Script deve validar entradas, falhar de forma visível e usar caminhos seguros.
- Backup só é confiável após teste de restauração.

## Procedimento operacional

1. Identifique ambiente, distribuição, usuário e privilégios.
2. Inspecione caminho e arquivos antes de alterar.
3. Use comandos de leitura antes dos comandos de escrita/destruição.
4. Aplique menor privilégio em usuários e permissões.
5. Registre comandos repetitivos em script com validação e log.
6. Crie backup e valide restauração.
7. Documente diferenças entre local, VPS e hospedagem compartilhada.

## Perguntas obrigatórias antes de recomendar

- Em qual diretório e usuário o comando será executado?
- O comando expande curingas ou variáveis perigosamente?
- Há permissão suficiente sem usar root?
- O pacote e o gerenciador correspondem à distribuição?
- O backup foi restaurado em teste?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Use para ambiente local Linux e VPS. Na HostGator compartilhada, concentre-se em arquivos, permissões permitidas, compactação, logs e SSH disponível; não presuma APT, systemd ou root.

## Limites de fidelidade e atualização

- A obra usa Ubuntu e ferramentas de sua época; confirme opções atuais com man pages e documentação da distribuição.
- Comandos administrativos exigem contexto e autorização.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
