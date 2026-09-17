---
name: livro-seguranca-web
description: "Aplica as vulnerabilidades e defesas do livro: SQL Injection, XSS, CSRF, mass assignment, sessão, dados sensíveis, redirects, CSP e SRI."
user-invocable: true
---

# Segurança em Aplicações Web

## Base bibliográfica

- **Obra:** Segurança em aplicações Web — Casa do Código
- **Fonte usada nesta versão:** EPUB disponibilizado pelo usuário: Seguranca em aplicacoes Web - Casa do Codigo.epub
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Revisar a aplicação pelo fluxo dos dados e pelos limites de confiança, aplicando defesa em profundidade.

## Use quando

- Revisar formulário, endpoint, sessão, upload e integração.
- Projetar autenticação, autorização e proteção de dados.
- Criar checklist de segurança para código e deploy.
- Analisar configuração de navegador e dependências externas.

## Não use quando

- Tratar limpeza genérica de input como defesa universal.
- Confiar na interface para autorização.
- Registrar credenciais ou dados sensíveis para facilitar depuração.

## Conteúdo da obra que governa esta skill

- SQL Injection.
- Cross-Site Scripting.
- Cross-Site Request Forgery.
- Mass Assignment.
- Session Hijacking.
- Exposição de dados sensíveis.
- Redirects não validados.
- Senhas em texto puro, usuário root, defaults e componentes vulneráveis.
- Content Security Policy.
- Subresource Integrity.

## Modelos mentais e técnicas derivados do livro

- SQL Injection é evitada separando comando e dados.
- XSS é combatido principalmente por codificação contextual de saída e políticas complementares.
- CSRF explora credenciais enviadas automaticamente; tokens e SameSite são camadas de defesa.
- Mass assignment ocorre quando campos externos controlam propriedades não autorizadas.
- Sessão precisa de identificador imprevisível, HTTPS, flags de cookie, rotação e expiração.
- Senha deve ser armazenada com função de hash de senha apropriada, não criptografia reversível.
- Redirect deve aceitar destinos permitidos.
- CSP e SRI reduzem impacto, mas não corrigem a vulnerabilidade de origem.

## Procedimento operacional

1. Mapeie origem, transformação, armazenamento e saída de cada dado.
2. Valide tipo, formato, tamanho e regra de domínio.
3. Use parâmetros vinculados para SQL.
4. Codifique saída conforme contexto.
5. Verifique autorização no servidor para cada objeto e ação.
6. Proteja sessão, CSRF, redirects, uploads e segredos.
7. Configure headers e dependências de terceiros.
8. Registre evento de segurança sem expor conteúdo sensível.

## Perguntas obrigatórias antes de recomendar

- Qual limite de confiança este dado atravessou?
- A consulta mistura comando e dado?
- Em qual contexto o valor será renderizado?
- O usuário pode enviar um campo que a tela não mostra?
- A autorização é por função e por registro?
- O cookie usa Secure, HttpOnly e SameSite adequados?
- O log expõe CPF, token, senha ou dado de saúde?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

A plataforma trata pacientes, viagens e documentos; aplique minimização, controle por perfil, auditoria e redaction de logs. Valide APIs e uploads além da interface web.

## Limites de fidelidade e atualização

- O livro reflete ameaças e navegadores de sua época; complemente com OWASP atual e requisitos legais.
- CSP, SRI e headers devem ser testados no ambiente real para evitar quebra funcional.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
