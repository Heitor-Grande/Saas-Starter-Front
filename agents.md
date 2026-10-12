# AGENTS.md — SaaS Starter Frontend

## Contexto

Este projeto é um template genérico para o desenvolvimento de futuros produtos SaaS.

Antes de implementar funcionalidades, consulte o `README.md` para compreender os objetivos, o escopo e a fase atual do projeto.

O desenvolvimento deve priorizar simplicidade, reutilização, organização e qualidade visual.

## Stack

- Next.js com App Router
- React
- TypeScript
- React-Bootstrap
- Bootstrap

Não introduza novas bibliotecas sem necessidade justificada.

## Organização do projeto

Utilize a seguinte estrutura como referência:

```text
src/
├── app/          # Rotas, páginas e layouts
│   └── rota/
│       ├── components/ # Componentes usados exclusivamente pela página da rota
│       └── page.tsx
├── components/
│   ├── ui/       # Componentes reutilizáveis
│   └── layout/   # Sidebar, header e layouts
├── config/       # Configurações da aplicação
├── mocks/        # Dados fictícios
├── hooks/        # Hooks reutilizáveis
├── util/         # Funções auxiliares e integrações reutilizáveis
├── styles/       # Estilos complementares
└── types/        # Tipagens compartilhadas
```

Crie diretórios apenas quando forem necessários.

## Regras de desenvolvimento

1. Utilize TypeScript e priorize tipagem explícita em interfaces e contratos.
2. Utilize componentes funcionais React.
3. Mantenha componentes pequenos, legíveis e com responsabilidades bem definidas.
4. Evite duplicação de código.
5. Separe componentes genéricos dos componentes específicos de funcionalidades.
6. Utilize o App Router para navegação.
7. Utilize Client Components somente quando houver necessidade de interatividade.
8. Evite abstrações prematuras e complexidade desnecessária.
9. Não implemente funcionalidades fora do escopo solicitado.
10. Preserve a possibilidade de reutilizar o template em diferentes produtos SaaS.
11. Centralize máscaras de entrada em `src/util/mascaras.ts` e seus removedores em `src/util/removeMascaras.ts`; não crie ou replique máscaras nas páginas.
12. Não utilize a pasta `src/features`. Quando uma `page.tsx` precisar de um componente específico, crie uma pasta `components` no mesmo diretório da página. Mantenha em `src/components` apenas componentes compartilhados entre diferentes páginas.

## Estilização

O React-Bootstrap é a biblioteca padrão de componentes.

Entretanto, **a aplicação não deve possuir a aparência visual padrão do Bootstrap**.

### Diretrizes obrigatórias

- Priorize uma identidade visual moderna, criativa e profissional.
- Utilize predominantemente paletas de cores claras.
- Prefira fundos suaves, superfícies claras e contrastes equilibrados.
- Personalize botões, formulários, cards, tabelas e menus.
- Utilize espaçamentos, bordas arredondadas e sombras sutis de maneira consistente.
- Evite interfaces visualmente genéricas.
- Garanta responsividade e acessibilidade.

### CSS global

Crie e mantenha o arquivo:

`src/styles/cssGlobal.css`

Esse arquivo deverá centralizar:

- Variáveis CSS globais.
- Paleta de cores.
- Tipografia base.
- Estilos globais.
- Personalizações compartilhadas do Bootstrap.
- Padrões visuais reutilizáveis.

Importe o arquivo no layout raiz da aplicação, após os estilos do Bootstrap.

Utilize CSS Modules para estilos específicos de componentes quando necessário.

Evite estilos inline e valores visuais repetidos desnecessariamente.

## Componentes

### Componentes UI padrao

- Utilize `<div className="audit-page">` como contêiner principal no desenvolvimento de novas `page.tsx`. Essa é a estrutura padrão da aplicação; reutilize seus estilos de layout, espaçamento e altura útil.
- Utilize `src/components/ui/DataTable.tsx` como padrao para tabelas de dados. Estenda suas propriedades quando uma necessidade puder ser compartilhada; nao crie paginacao ou estrutura de tabela duplicada nas paginas.
- Utilize `src/components/ui/FormInput.tsx`, `FormSelect.tsx` e `FormCheckbox.tsx` como padrao para campos de formulario.
- Evite usar `Form.Control`, `Form.Select` e `Form.Check` diretamente nas paginas, salvo quando o componente compartilhado nao suportar um requisito especifico.
- Preserve nos componentes de formulario os rotulos, textos auxiliares, mensagens de erro e atributos de acessibilidade.
- Utilize `src/components/ui/Loading.tsx` como padrao visual durante todas as requisicoes de API. Escolha entre os modos `inline`, `section` e `overlay` conforme a area afetada pela requisicao.
- Utilize `src/components/ui/FeedbackState.tsx` para comunicar sucesso ou erro ao usuario apos operacoes de API que alterem dados, como `POST`, `PUT`, `PATCH` e `DELETE`.
- Evite utilizar `FeedbackState` em consultas `GET`. Para carregamento, erro ou ausencia de dados em operacoes de leitura, prefira `Loading` e estados inline que nao interrompam a navegacao do usuario.
- Evite scroll vertical nas `page.tsx`. Organize o conteudo para caber na area util com paginacao, abas, paineis compactos e modais, mantendo a tela limpa e amigavel.
- Quando todo o conteudo nao puder ser exibido simultaneamente, preserve a pagina sem scroll e limite a rolagem a uma area interna claramente definida, sem esconder acoes essenciais.
- Escreva todos os textos visíveis da interface em português correto, com acentuação, ortografia e pontuação revisadas antes de concluir a implementação.
- Não remova acentos de títulos, rótulos, mensagens, descrições ou textos de acessibilidade. Identificadores técnicos, URLs e chaves de contratos podem permanecer em ASCII.

- Priorize componentes nativos do React-Bootstrap.
- Não recrie componentes que a biblioteca já oferece sem justificativa.
- Crie componentes compartilhados quando houver reutilização real.
- Utilize propriedades para permitir personalização.
- Evite componentes excessivamente acoplados a páginas específicas.
- Mantenha estados de loading, erro, vazio e sucesso visualmente consistentes.

## Navegação

- Todas as páginas da Fase 1 devem ser navegáveis.
- Utilize o roteamento nativo do Next.js.
- A sidebar deve indicar a página ativa.
- Menus e links devem possuir destinos válidos.
- Botões demonstrativos devem executar uma interação visual coerente.
- Não crie navegação que dependa de autenticação real.

## Dados fictícios

Durante a Fase 1:

- Utilize exclusivamente dados locais fictícios.
- Centralize conjuntos reutilizáveis de dados na pasta `mocks/`.
- Não realize requisições HTTP.
- Não configure clientes de API.
- Não implemente persistência em banco de dados.
- Não implemente autenticação ou sessões reais.
- Simule resultados de operações quando necessário.

Os dados fictícios devem ser facilmente substituíveis em fases futuras.

## Qualidade

Antes de concluir uma implementação:

1. Verifique se o código está tipado corretamente.
2. Execute as verificações de lint disponíveis.
3. Verifique se a aplicação compila.
4. Confirme que as rotas implementadas são acessíveis.
5. Verifique responsividade e estados de interface.
6. Evite imports, arquivos e componentes desnecessários.
7. Corrija erros introduzidos pela alteração.

Não considere uma funcionalidade concluída caso apresente erros conhecidos.

## Restrições da Fase 1

Não implementar:

- Backend ou endpoints de API.
- Integrações com serviços externos.
- Banco de dados.
- Autenticação real.
- Autorização real.
- Gerenciamento real de usuários.
- Cobranças e pagamentos.
- Regras de negócio específicas de um produto.

O foco atual é exclusivamente a construção de uma **fundação visual navegável e reutilizável**.

## Comportamento esperado do Codex

Ao receber uma tarefa:

1. Consulte o contexto do projeto.
2. Identifique os componentes existentes que podem ser reutilizados.
3. Implemente a solução mais simples que atenda ao requisito.
4. Preserve os padrões visuais e estruturais existentes.
5. Evite modificar arquivos não relacionados à tarefa.
6. Não adicione dependências ou funcionalidades desnecessárias.
7. Valide as alterações realizadas.
8. Informe resumidamente o que foi implementado e quais verificações foram executadas.

Em caso de ambiguidade que possa afetar significativamente a arquitetura ou o escopo, solicite esclarecimentos antes de implementar.

## Princípio fundamental

**O SaaS Starter deve ser uma fundação reutilizável, não um produto específico.**

Todas as decisões devem favorecer a criação de futuros SaaS independentes, mantendo o código simples, organizado, extensível e visualmente consistente.
