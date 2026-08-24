# PM System — MVP estilo Jira

Sistema de gestão de projetos com kanban, Gantt, apontamento de horas e tarefas com subtarefas.

## Stack
- Backend: NestJS + TypeORM + PostgreSQL + JWT (Passport) para autenticação
- Frontend: Next.js (App Router) + Tailwind + @dnd-kit (kanban) + frappe-gantt (Gantt)

## Como rodar

### 1. Banco de dados
cd backend
docker compose up -d

### 2. Backend
cd backend
cp .env.example .env
# gere um valor próprio para JWT_SECRET no .env (usado para assinar os tokens de login)
npm install
npm run start:dev
# API em http://localhost:3001

### 3. Frontend
cd frontend
npm install
npm run dev
# App em http://localhost:3000

## Autenticação
- Ao abrir o app pela primeira vez, crie uma conta em "Criar conta" (nome, e-mail, senha) — o login é feito automaticamente após o cadastro.
- **A primeira conta criada no sistema vira automaticamente admin.** Todas as contas seguintes (inclusive as convidadas pelo admin) entram como membro comum.
- O token JWT fica salvo no localStorage do navegador (chave `pm_token`) e expira em 7 dias.
- Todas as rotas da API (exceto `/auth/register` e `/auth/login`) exigem o header `Authorization: Bearer <token>`.
- Ainda não há permissões por projeto: qualquer usuário autenticado enxerga e edita todos os projetos.

## Admin
- A tela `/admin` (link "Admin" na navbar) só aparece e só é acessível para o usuário com `role = admin` — membros comuns recebem 403 na API e são redirecionados se tentarem acessar a URL direto.
- O admin convida pessoas do time por lá: nome, e-mail e valor/hora (opcional). Como o sistema ainda não envia e-mail, o "convite" cria a conta na hora e mostra uma senha temporária na tela, que precisa ser repassada manualmente para a pessoa.
- O valor/hora de cada pessoa fica visível e editável só para o admin (endpoint `/admin/members`); a listagem geral de usuários (`/users`, usada nos seletores de responsável) nunca expõe esse valor.

## Estrutura de dados
- User: nome, email, senha (hash com bcrypt), role (`admin` ou `member`) e valor/hora opcional (visível só para admin)
- Project: nome, descrição, data início/fim
- BoardColumn: colunas do kanban por projeto (A fazer, Em andamento, Concluído — criadas automaticamente ao criar o projeto)
- Task: título, datas de início/fim, progresso, coluna (status), responsável,
  e parentTaskId (referência a si mesma — é assim que as subtarefas funcionam)
- TimeEntry: horas apontadas por usuário em uma tarefa, com data e nota

## Próximos passos sugeridos
- Permissões por projeto (hoje a autenticação é só por usuário, sem controle de acesso por projeto)
- Tela de relatório de horas por período (endpoint /time-entries/report já existe)
- Migrations do TypeORM em vez de synchronize:true (que é só para dev)
