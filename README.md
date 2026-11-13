# TrabWEB1

Sistema web de controle financeiro pessoal. O front-end foi feito apenas com HTML, CSS e JavaScript puros, e o back-end com Node.js e Express, usando SQLite como banco de dados.

Projeto baseado nos repositórios:
- Front: https://github.com/ksio237/Trabalho-Front -> https://github.com/aflucasgabriel/meu-norte-app-front
- Back: https://github.com/ksio237/Trabalho-Back -> https://github.com/aflucasgabriel/meu-norte-app-back

## Tecnologias

- **Front-end:** HTML, CSS e JavaScript (módulos ES), Bootstrap Icons e ECharts (gráficos)
- **Back-end:** Node.js (>= 22.13), Express, `cors`, `dotenv`
- **Banco de dados:** SQLite (módulo nativo `node:sqlite`)
- **Autenticação:** JWT (`jsonwebtoken`) e `bcrypt` para o hash das senhas
- **Desenvolvimento:** `nodemon`

## Como rodar

1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie o servidor:
   ```
   npm run dev
   ```
3. Acesse `http://localhost:3000` (abra sempre pelo servidor Node, não pelo arquivo direto nem por extensões como o Live Server).

O arquivo do banco (`data/app.db`) e as tabelas são criados automaticamente na primeira execução. Para começar, crie uma conta na tela de cadastro.

> Dependendo da versão do Node, pode aparecer um aviso `ExperimentalWarning` sobre o SQLite. Ele não afeta o funcionamento.

## Estrutura de pastas

```
TrabWEB1/
├── .env.example               # modelo das variáveis de ambiente
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── data/                      # banco SQLite (gerado automaticamente, ignorado pelo Git)
├── public/                    # front-end, servido pelo Express
│   ├── index.html             # login
│   ├── registro.html          # cadastro
│   ├── css/
│   │   ├── auth.css           # estilos de login e cadastro
│   │   ├── dashboard.css      # estilos das telas internas
│   │   └── globals.css        # variáveis de tema, cores e componentes comuns
│   ├── img/
│   │   └── favicon.ico
│   ├── dashboard/
│   │   ├── painel.html        # resumo e gráficos
│   │   ├── transacoes.html    # receitas e despesas
│   │   ├── orcamentos.html    # limites por categoria
│   │   ├── relatorios.html    # gráficos anuais e exportação em CSV
│   │   └── perfil.html        # (desabilitada, veja "Tela de perfil")
│   └── js/
│       ├── main.js            # alternância de tema claro/escuro
│       ├── sessao.js          # token, logout e proteção de páginas
│       ├── guard.js           # exige login nas páginas do dashboard
│       ├── redirecionar.js    # leva ao painel quem já está logado
│       ├── login.js
│       ├── registro.js
│       ├── dashboard.js       # menu lateral e botão de sair
│       ├── painel.js
│       ├── transacoes.js
│       ├── orcamentos.js
│       ├── relatorios.js
│       ├── perfil.js          # (desabilitada)
│       └── modules/
│           ├── api.js         # chamadas à API do servidor
│           ├── mensagem.js    # mensagens de erro (vermelho) e sucesso (verde)
│           └── utils.js       # formatação, categorias e gráficos
└── src/                       # back-end
    ├── app.js                 # servidor Express, middlewares e rotas
    ├── config/
    │   ├── database.js        # conexão SQLite e criação das tabelas
    │   └── jwt.js             # configuração do token
    ├── routes/
    │   ├── authRoutes.js
    │   ├── transacaoRoutes.js
    │   └── orcamentoRoutes.js
    ├── middlewares/
    │   ├── autenticar.js      # valida o token JWT
    │   ├── validarAuth.js     # validação de login e cadastro
    │   ├── validarFinanceiro.js # validação de transações e orçamentos
    │   ├── notFound.js        # 404 para rotas /api inexistentes
    │   └── errorHandler.js    # tratamento central de erros
    ├── controllers/           # recebem a requisição e devolvem a resposta
    │   ├── authController.js
    │   ├── transacaoController.js
    │   └── orcamentoController.js
    ├── services/              # regras de negócio
    │   ├── authService.js
    │   ├── transacaoService.js
    │   └── orcamentoService.js
    ├── repositories/          # único ponto de acesso ao banco
    │   ├── usuarioRepository.js
    │   ├── transacaoRepository.js
    │   └── orcamentoRepository.js
    └── utils/
        ├── AppError.js        # erro com status HTTP
        ├── asyncHandler.js    # repassa erros de funções async ao errorHandler
        ├── categorias.js      # categorias aceitas pelo servidor
        └── token.js           # geração e verificação do JWT
```

O fluxo de uma requisição no back-end é: **rota → validação → controller → service → repository → banco**.

## Funcionalidades

- Cadastro e login com senha criptografada e sessão por token JWT
- Proteção das páginas internas: quem não está logado volta ao login, e quem já está logado é levado ao painel
- Painel com resumo do mês, gráfico de receitas e despesas, divisão das despesas por categoria e últimas atividades
- Cadastro, busca, filtro e exclusão de transações (receitas e despesas)
- Orçamentos mensais por categoria, com barra de uso e alerta ao se aproximar ou ultrapassar o limite
- Relatórios com gráficos do ano e exportação das transações em CSV
- Tema claro e escuro

## API

Respostas de sucesso seguem `{ message, data }` e as de erro seguem `{ message, errors? }`, com o status HTTP adequado (400, 401, 404, 409, 500).

| Método| Rota 					| Descrição 					| Exige login|
|		|						|								|	  |
| POST 	| `/api/signup` 		| Cria uma conta				| Não |
| POST 	| `/api/login` 			| Autentica e devolve o token 	| Não |
| GET 	| `/api/me` 			| Dados do usuário logado 		| Sim |
| GET 	| `/api/transacoes` 	| Lista as transações do usuário| Sim |
| POST 	| `/api/transacoes` 	| Cria uma transação 			| Sim |
| DELETE| `/api/transacoes/:id` | Exclui uma transação 			| Sim |
| GET 	| `/api/orcamentos` 	| Lista os orçamentos			| Sim |
| POST 	| `/api/orcamentos` 	| Cria um orçamento 			| Sim |
| DELETE| `/api/orcamentos/:id` | Exclui um orçamento 			| Sim |

## O que foi feito, do projeto front ate o fim

**Ponto de partida:** o projeto tinha um front-end em HTML, CSS e JavaScript com login, cadastro e as telas do dashboard, guardando os dados no `localStorage` do navegador. O back-end tinha apenas o servidor Express básico, um controller de autenticação que acessava diretamente o PostgreSQL, e as rotas ainda não estavam ligadas ao servidor.

**1. Reestruturação do back-end em camadas.** O código passou a ser dividido em rotas, validação, controllers, services e repositories, cada um com uma responsabilidade. Foram adicionados middlewares de validação de entrada (campos obrigatórios, formato de e-mail, tamanho mínimo da senha), tratamento centralizado de erros com mensagens e status HTTP apropriados (400, 401, 404, 409, 500) e um padrão único de resposta para facilitar a integração com o front.

**2. Integração do login e do cadastro com a API.** As telas deixaram de redirecionar direto e passaram a chamar o servidor. Mensagens de erro aparecem em vermelho e a de sucesso em verde, a confirmação de senha é validada e o formato de e-mail é checado pelo próprio navegador.

**3. Autenticação com JWT.** O login passou a devolver um token, guardado no navegador, e as páginas do dashboard só abrem para quem está logado. A sessão é mantida ao reabrir o navegador, o botão "Sair" encerra a sessão de verdade e quem já está logado é redirecionado ao painel com uma mensagem.

**4. Organização do front-end em módulos.** Funções repetidas foram reunidas em `modules/` (mensagens, utilidades e acesso à API).

**5. Troca do banco para SQLite.** O PostgreSQL foi substituído pelo SQLite, que dispensa instalação e serviço externo. O nome de usuário (`username`) foi removido, e o e-mail é o identificador único. Também foram ajustados o favicon, o `.env.example`, o `.gitignore` e o README.

**6. Dashboard ligado ao banco.** Transações e orçamentos deixaram de usar o `localStorage` e passaram a ser gravados no SQLite pela API. Cada usuário enxerga apenas os próprios dados, os valores são guardados em centavos (evita erros de arredondamento) e o gasto de cada orçamento é calculado pelo banco. O painel e os relatórios passam a ler os dados reais, e os gráficos de exemplo fixos foram removidos. No gráfico de despesas por categoria, as cores passaram a ser fixas por categoria, em tons de vermelho, laranja, amarelo, rosa, roxo e marrom.

## Tela de perfil (desabilitada)

A tela de perfil (`public/dashboard/perfil.html` e `public/js/perfil.js`) foi **desabilitada temporariamente**: o link foi comentado no menu lateral das demais páginas. Os arquivos continuam no projeto, porque ela será refeita depois, já integrada ao banco e à autenticação.

## Limitações conhecidas

- A recuperação de senha da tela de login ainda é uma simulação, e nenhum e-mail é enviado
- O token fica no `localStorage`, o que é aceitável para este trabalho, mas um cookie `httpOnly` seria mais seguro
- A lista de categorias existe no front (`public/js/modules/utils.js`) e no back (`src/utils/categorias.js`) e precisa ser mantida igual nos dois
- O painel e os relatórios somam os totais no navegador, o que é suficiente para poucos dados
- O SQLite grava em um arquivo local, então hospedagens com disco temporário apagam os dados a cada deploy


