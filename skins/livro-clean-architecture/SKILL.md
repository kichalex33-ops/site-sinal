---
name: livro-clean-architecture
description: "Aplica a Regra da Dependência, entidades, casos de uso, adaptadores, frameworks, fronteiras, componentes e Screaming Architecture conforme Clean Architecture."
user-invocable: true
---

# Clean Architecture

## Base bibliográfica

- **Obra:** Clean Architecture: A Craftsman’s Guide to Software Structure and Design — Robert C. Martin
- **Fonte usada nesta versão:** Síntese da obra e de sua estrutura editorial oficial; o livro não estava entre os EPUBs fornecidos.
- Esta skill é uma síntese operacional em palavras próprias. Ela não reproduz capítulos nem substitui a leitura da obra.

## Finalidade

Proteger regras de negócio contra mudanças em banco, interface, framework e serviços externos.

## Use quando

- Decidir onde uma regra de negócio deve residir.
- Separar casos de uso de HTTP, banco, UI e SDKs.
- Definir fronteiras testáveis e direção de dependências.
- Avaliar estrutura de componentes e limites de deploy.

## Não use quando

- Criar uma interface para cada classe.
- Reescrever toda a aplicação antes de obter testes de caracterização.
- Confundir arquitetura limpa com uma estrutura fixa de pastas.

## Conteúdo da obra que governa esta skill

- Princípios de design de classes e componentes.
- Entidades e regras de negócio mais estáveis.
- Casos de uso específicos da aplicação.
- Interface adapters: controllers, presenters e gateways.
- Frameworks e drivers como detalhes externos.
- Regra da Dependência: código-fonte aponta para políticas mais internas.
- Fronteiras, main component, serviços, testes e detalhes como banco e web.
- Screaming Architecture: a estrutura comunica o domínio do produto.

## Modelos mentais e técnicas derivados do livro

- Políticas de alto nível não devem depender de detalhes de baixo nível.
- Dados que cruzam fronteiras devem usar estruturas simples adequadas ao contrato.
- Controllers traduzem entrada; presenters traduzem saída; casos de uso decidem comportamento.
- Banco de dados e framework web são mecanismos substituíveis, não o centro do sistema.
- Fronteiras completas têm custo; fronteiras parciais podem ser suficientes.
- Componentes devem ser coesos e depender na direção da estabilidade.

## Procedimento operacional

1. Identifique a regra e escreva seu comportamento sem mencionar tecnologia.
2. Localize onde HTTP, SQL, UI ou SDK externo invadem essa regra.
3. Defina entrada, saída e erros do caso de uso.
4. Mantenha entidades e políticas independentes de detalhes externos.
5. Introduza uma porta somente onde a fronteira precisa de isolamento.
6. Implemente adaptadores para persistência, transporte e apresentação.
7. Valide o núcleo com testes rápidos e os adaptadores com integração.

## Perguntas obrigatórias antes de recomendar

- A regra pode ser explicada sem citar framework ou tabela?
- Quem decide: controller, caso de uso ou entidade?
- A dependência aponta para a política mais estável?
- A fronteira traz benefício proporcional ao número de interfaces e DTOs?
- A estrutura de pastas revela o domínio ou apenas a tecnologia?

## Formato obrigatório da resposta

- Diagnóstico direto do problema e da decisão em jogo.
- Evidências observadas no código, fluxo, interface, banco ou operação.
- Leitura do problema pela lente específica da obra, sem misturar autores.
- Recomendações priorizadas por impacto, risco, esforço e reversibilidade.
- Plano incremental com validação, teste e rollback.
- Separação explícita entre princípio do livro, adaptação ao projeto e exigência atual de versão.

## Aplicação ao LogiSaúde/AGSAP

Regras de atribuição, acessibilidade, estados de viagem, aprovações e sincronização devem ser localizáveis fora de controllers e SQL. A implantação pode continuar monolítica; separação lógica não exige microserviços.

## Limites de fidelidade e atualização

- A obra é prescritiva; aplique com proporcionalidade ao tamanho e risco do sistema.
- Não atribua ao livro recomendações específicas de PHP, Flutter, HostGator ou bibliotecas atuais.
- Quando uma recomendação depender de versão, biblioteca, norma, ameaça ou serviço atual, consultar documentação oficial antes de afirmar o detalhe.
- Não transformar exemplos da obra em regra universal; preservar problema, forças, consequências e contexto.
