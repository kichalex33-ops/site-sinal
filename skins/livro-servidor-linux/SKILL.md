---
name: livro-servidor-linux
description: "Aplica o conteúdo do guia: shell, usuários, serviços, rede, SSH, discos, hardening, compartilhamento e Apache, contextualizando privilégios e ambiente."
user-invocable: true
---

# Guia prático do servidor Linux

## Base bibliográfica

- **Obra:** Guia prático do servidor Linux: administração Linux para iniciantes — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Guia pratico do servidor Linux - Administracao Linux para iniciantes - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Administrar um servidor Linux de forma previsível, segura e documentada.

## Use quando

- Inspecionar servidor, serviços, logs e recursos.
- Configurar acesso SSH e permissões.
- Planejar armazenamento, backup e hardening.
- Operar Apache em ambiente sob administração própria.

## Não use quando

- Executar comandos de desligamento, firewall ou disco em hospedagem compartilhada.
- Tratar servidor local, VPS e painel de hospedagem como o mesmo ambiente.
- Alterar configuração sem backup e validação de sintaxe.

## Conteúdo da obra que governa esta skill

- Shell e convenções de prompt.
- Sistema, usuários, grupos e permissões.
- Processos, serviços e inicialização.
- Rede e acesso remoto com SSH.
- Armazenamento, partições, RAID, LVM e quotas.
- Compartilhamento com NFS e Samba.
- Hardening e controle de acesso.
- Serviços de rede e Apache.
- Backup, logs e manutenção.

## Modelos mentais e técnicas derivados do livro

- Prompt indica usuário comum ou privilegiado; isso muda o risco do comando.
- Serviço precisa de configuração, processo, porta, log e política de inicialização.
- SSH deve preferir chaves, menor privilégio e restrição de acesso.
- Alteração de disco é de alto risco e exige inventário e backup.
- Hardening reduz superfície: pacotes, portas, contas, permissões e defaults.
- Configuração do Apache deve ser validada antes de recarregar.
- Reiniciar é último recurso, não método de diagnóstico.

## Procedimento operacional

1. Identifique propriedade do ambiente, distribuição e acesso disponível.
2. Colete inventário de sistema, disco, memória, rede, serviços e logs.
3. Faça backup da configuração antes de alterar.
4. Aplique menor privilégio e restrinja acesso remoto.
5. Valide sintaxe e teste mudança em escopo limitado.
6. Recarregue serviço quando suficiente; reinicie somente quando necessário.
7. Verifique saúde e capacidade após a mudança.
8. Registre procedimento e rollback.

## Perguntas obrigatórias antes de recomendar

- Tenho autorização e privilégio para esta operação?
- O ambiente é VPS, servidor físico ou hospedagem compartilhada?
- Qual log confirma a hipótese?
- A mudança pode cortar meu próprio acesso?
- Existe backup verificável da configuração e dos dados?
- É necessário reiniciar ou basta recarregar?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Na HostGator compartilhada, use apenas recursos expostos pelo painel/SSH permitido. Administração de systemd, firewall, pacotes e reboot só se aplica a VPS sob controle do município.

## Limites de fidelidade e atualização

- Comandos e arquivos variam por distribuição e versão.
- Operações de rede, boot e armazenamento exigem janela, backup e plano de recuperação.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
