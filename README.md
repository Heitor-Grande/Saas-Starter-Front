# SaaS Starter — Frontend

## Visão geral

O SaaS Starter é um template genérico e reutilizável para o desenvolvimento de aplicações SaaS.

Seu objetivo é fornecer uma base visual e funcional para futuros produtos, evitando a necessidade de reconstruir componentes, layouts e interfaces comuns a cada novo projeto.

O template não pertence a nenhum segmento de negócio específico e deve permitir personalização e expansão conforme as necessidades de cada produto.

## Tecnologias

- Next.js
- React
- TypeScript
- React-Bootstrap
- Bootstrap
- Sass (SCSS)

O React-Bootstrap será a biblioteca padrão para construção das interfaces.

## Estilização e identidade visual

O Bootstrap será utilizado como base para os componentes e a estrutura visual da aplicação. Entretanto, **a identidade visual não deve apresentar a aparência padrão do Bootstrap**.

O objetivo é construir uma interface criativa, moderna, elegante e profissional, com identidade própria e foco em **paletas de cores claras**.

Deve ser criado o arquivo `cssGlobal.css`, responsável por centralizar as estilizações personalizadas durante o desenvolvimento.

Diretrizes visuais:

- Priorizar cores claras, suaves e harmoniosas.
- Utilizar fundos claros e elementos com bom contraste.
- Criar uma identidade visual própria, evitando a aparência tradicional do Bootstrap.
- Personalizar componentes como botões, cards, formulários, tabelas e menus.
- Utilizar espaçamentos, bordas e sombras de maneira consistente.
- Priorizar interfaces minimalistas, modernas e intuitivas.
- Centralizar estilos globais e personalizações compartilhadas no `cssGlobal.css`.
- Manter responsividade e acessibilidade.

**O Bootstrap deve servir como fundação dos componentes, não como referência obrigatória para a aparência final da aplicação.**

## Etapas de desenvolvimento

O frontend será desenvolvido em três fases:

1. **Fundação visual:** layouts, navegação, componentes reutilizáveis e telas demonstrativas.
2. **Administração:** interfaces de usuários, organizações, perfis e permissões.
3. **Recursos complementares:** dashboards avançados, notificações, personalização e outras funcionalidades comuns a SaaS.

## Fase 1 — Fundação visual

O objetivo inicial é construir uma aplicação visualmente consistente, responsiva e completamente navegável.

### Funcionalidades

- Layout principal com sidebar e header.
- Navegação entre páginas.
- Dashboard demonstrativo.
- Telas de login, cadastro e recuperação de senha.
- Página de perfil e configurações.
- Biblioteca de componentes reutilizáveis.
- Estados visuais de carregamento, erro e sucesso.
- Páginas de acesso negado e não encontrado.

### Restrições

**Nesta fase, o desenvolvimento será exclusivamente frontend.**

- Não implementar backend ou integração com APIs.
- Não utilizar banco de dados.
- Não implementar autenticação real.
- Utilizar exclusivamente dados fictícios.
- Permitir navegar livremente pelas telas.
- Simular interações quando necessário.
- Não implementar regras de negócio específicas.

## Princípios

- Priorizar simplicidade e reutilização.
- Manter consistência visual.
- Utilizar React-Bootstrap como padrão.
- Desenvolver interfaces responsivas e acessíveis.
- Evitar abstrações e dependências desnecessárias.
- Manter o template genérico e facilmente personalizável.
- Priorizar uma identidade visual criativa, com cores claras e aparência distinta do Bootstrap padrão.

## Resultado esperado

Ao final da Fase 1, o projeto deverá possuir uma interface funcional e navegável, com layouts e componentes reutilizáveis, utilizando apenas dados fictícios.

Essa estrutura servirá como fundação para as próximas fases e para a criação de futuros produtos SaaS.

## Fase 2 — Interfaces administrativas

O objetivo desta fase é desenvolver as interfaces administrativas essenciais para futuros produtos SaaS, aproveitando os layouts, componentes e padrões visuais estabelecidos na Fase 1.

As interfaces devem ser genéricas, reutilizáveis, responsivas e manter a identidade visual personalizada, com predominância de cores claras.

### Funcionalidades

**1. Gerenciamento de usuários**
- Listagem de usuários com busca, filtros e paginação.
- Cadastro, edição e visualização de usuários.
- Ativação e desativação de usuários.
- Associação de usuários a organizações e perfis de acesso.

**2. Gerenciamento de organizações**
- Listagem, cadastro e edição de organizações.
- Visualização dos detalhes de uma organização.
- Gerenciamento de membros.
- Convites demonstrativos para novos membros.
- Alternância entre organizações.

**3. Perfis e permissões**
- Listagem e gerenciamento de perfis de acesso.
- Criação e edição de perfis.
- Associação de permissões aos perfis.
- Associação de perfis aos usuários.
- Visualização de permissões organizadas por módulos e ações.

**4. Perfil e configurações**
- Edição demonstrativa de informações pessoais.
- Alteração visual de senha.
- Configurações gerais da organização.
- Preferências de interface.

### Diretrizes

- Utilizar React-Bootstrap como biblioteca padrão.
- Manter as personalizações visuais centralizadas no `cssGlobal.css`.
- Preservar a identidade visual moderna, criativa e baseada em cores claras.
- Reutilizar componentes desenvolvidos na Fase 1.
- Utilizar tabelas, formulários, modais, filtros e confirmações padronizados.
- Permitir navegação entre todas as telas administrativas.
- Simular operações de cadastro, edição, exclusão e alteração de status com dados fictícios.
- Apresentar feedback visual para as operações demonstrativas.

### Restrições

**A Fase 2 continuará sendo exclusivamente frontend.**

- Não implementar backend ou integração com APIs.
- Não utilizar banco de dados.
- Não implementar autenticação ou autorização real.
- Não realizar persistência em serviços externos.
- Não implementar regras de negócio específicas de um SaaS.
- Utilizar dados fictícios e estados locais para simular operações.

### Resultado esperado

Ao final da Fase 2, o SaaS Starter deverá possuir uma área administrativa completa em termos de interface, permitindo navegar e interagir com os módulos de usuários, organizações, perfis, permissões e configurações.

Todas as operações deverão funcionar de maneira demonstrativa, sem dependência de backend, mantendo a aplicação preparada para integrações futuras.

## Fase 3 — Administração e configurações globais

O objetivo desta fase é consolidar a estrutura administrativa do SaaS Starter, oferecendo interfaces centralizadas para gerenciamento, monitoramento e configuração da aplicação.

O sistema terá **um único painel administrativo**, sem separação entre administradores da plataforma e administradores das organizações nesta etapa.

### Estrutura de menus

A sidebar deverá ser organizada em três grupos:

**Visão Geral**
- Dashboard Geral

**Administração**
- Usuários
- Perfis e Permissões
- Organizações
- Planos e Assinaturas

**Sistema**
- Logs e Auditoria
- Configurações Globais

### Funcionalidades

**1. Dashboard Geral**
- Indicadores de usuários e organizações.
- Resumo das atividades da aplicação.
- Cards e gráficos demonstrativos.
- Informações gerais sobre a utilização do sistema.

**2. Usuários**
- Cadastro, edição e listagem de usuários.
- Ativação e desativação.
- Associação a organizações e perfis de acesso.
- Reutilização das interfaces desenvolvidas na Fase 2.

**3. Perfis e Permissões**
- Cadastro e gerenciamento de perfis.
- Associação de permissões aos perfis.
- Associação de perfis aos usuários.
- Visualização das permissões por módulo e operação.
- Reutilização das interfaces desenvolvidas na Fase 2.

**4. Organizações**
- Cadastro e gerenciamento de organizações.
- Ativação e desativação de organizações.
- Gerenciamento de membros.
- Formulário de cadastro e edição organizado em abas:
  - **Dados Gerais:** informações cadastrais da organização.
  - **Membros:** usuários vinculados à organização.
  - **Configuração:** parâmetros e preferências exclusivos da organização.
- As configurações individuais de cada organização não devem ser incluídas no menu de Configurações Globais.
- Reutilização das interfaces desenvolvidas na Fase 2.

**5. Planos e Assinaturas**
- Cadastro e edição de planos.
- Definição de funcionalidades e limites por plano.
- Listagem demonstrativa de assinaturas.
- Visualização de status e informações dos planos.

**6. Logs e Auditoria**
- Histórico de atividades da aplicação.
- Identificação do usuário responsável.
- Data e horário das operações.
- Identificação da organização relacionada.
- Filtros por usuário, período, operação e organização.
- Visualização detalhada dos registros.

**7. Configurações Globais**

Centralizar as configurações gerais aplicáveis a todas as organizações.

Organizar as configurações em abas:

- **Geral:** nome da aplicação e parâmetros globais.
- **SMTP:** servidor, porta, remetente e configurações de envio de e-mails.

As configurações globais devem permanecer separadas das configurações individuais de cada organização.

### Diretrizes

- Manter um único painel administrativo.
- Organizar a sidebar em Visão Geral, Administração e Sistema.
- Reutilizar as interfaces e componentes das fases anteriores.
- Evitar duplicação dos módulos já desenvolvidos.
- Utilizar React-Bootstrap como biblioteca padrão.
- Manter a identidade visual personalizada, moderna e baseada em cores claras.
- Centralizar personalizações compartilhadas no `cssGlobal.css`.
- Garantir navegação funcional entre todos os menus.
- Utilizar dados fictícios e simulações para representar as operações.

### Restrições

**A Fase 3 continuará sendo exclusivamente frontend.**

- Não implementar backend ou integração com APIs.
- Não utilizar banco de dados.
- Não implementar autenticação ou permissões reais.
- Não realizar envio real de e-mails.
- Não armazenar credenciais SMTP reais.
- Não implementar cobranças ou pagamentos reais.
- Não implementar separação entre painéis administrativos.

### Resultado esperado

Ao final da Fase 3, o SaaS Starter deverá possuir uma interface administrativa completa e navegável, contemplando usuários, organizações, permissões, planos, auditoria e configurações globais.

Todas as funcionalidades deverão operar de maneira demonstrativa, utilizando dados fictícios e sem dependência de backend.