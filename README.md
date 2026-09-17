# PM System — MVP estilo Jira

Sistema de gestão de projetos com kanban, Gantt, apontamento de horas e tarefas com subtarefas.

## Stack
- Backend: NestJS + TypeORM + PostgreSQL + JWT (Passport) para autenticação
- Frontend: Next.js (App Router) + Tailwind + @dnd-kit (kanban) + frappe-gantt (Gantt)

## Instalação local (desktop, sem navegador)

Além da versão web, o repositório tem uma versão desktop empacotada com
Electron, que gera um instalador `.exe`/`.msi` para instalar no Windows sem
depender de servidor, Docker ou Postgres (usa SQLite local). Veja
[`desktop/README.md`](desktop/README.md) para gerar o instalador (o jeito
mais simples é rodar o workflow do GitHub Actions em
`.github/workflows/build-desktop.yml`, que builda em uma máquina Windows e
disponibiliza o `.exe`/`.msi` para download).

## Como rodar (versão web)

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

## Kanban
- Colunas padrão de cada projeto (criadas automaticamente): A fazer, Em andamento, Deploy, QA, Testes Integrados, Dossiê de Teste, Concluído.
- Clicar num card abre um modal para editar título, descrição, datas, coluna e responsável, além da lista de comentários da tarefa.
- Comentários aceitam um anexo (arquivo único, até 10 MB) salvo em `backend/uploads/` e servido em `/uploads/<arquivo>` — **esse endpoint de arquivo não passa pela autenticação JWT**, então não é indicado para anexos sensíveis neste estágio.
- **Apontamento automático de horas:** quando um card entra na coluna "Em andamento", o sistema marca o horário; quando ele é movido para "Concluído", lança automaticamente as horas decorridas como um TimeEntry do responsável da tarefa (só funciona se a tarefa tiver responsável). Essa lógica compara pelo *nome* das colunas — se você renomear "Em andamento" ou "Concluído" no board, a contagem automática para de funcionar para esse projeto.

## Estrutura de dados
- User: nome, email, senha (hash com bcrypt), role (`admin` ou `member`) e valor/hora opcional (visível só para admin)
- Project: nome, descrição, data início/fim
- BoardColumn: colunas do kanban por projeto
- Task: título, datas de início/fim, progresso, coluna (status), responsável, inProgressSince (controle do apontamento automático),
  e parentTaskId (referência a si mesma — é assim que as subtarefas funcionam)
- TimeEntry: horas apontadas por usuário em uma tarefa, com data e nota (inclui as lançadas automaticamente)
- Comment: texto + anexo opcional, vinculado a uma tarefa e a quem comentou

## Próximos passos sugeridos
- Permissões por projeto (hoje a autenticação é só por usuário, sem controle de acesso por projeto)
- Tela de relatório de horas por período (endpoint /time-entries/report já existe)
- Migrations do TypeORM em vez de synchronize:true (que é só para dev)
- Mover anexos de comentário para um storage externo (S3/R2) antes de rodar em produção — hoje ficam em disco local, o que não sobrevive a redeploys em plataformas com filesystem efêmero

## Deploy (Railway)
O projeto está pronto para rodar em qualquer host de Postgres — o backend lê `DATABASE_URL` se ela existir (padrão do Railway/Render), senão usa as variáveis `DB_*` separadas (uso local).

1. Suba o código para um repositório no GitHub (a Railway faz deploy automático a partir dele).
2. Crie um projeto na Railway e adicione 3 serviços: um Postgres (plugin do próprio Railway), um serviço apontando para a pasta `backend/` e outro para `frontend/`.
3. Variáveis de ambiente do serviço **backend**: `DATABASE_URL` (a Railway preenche sozinha ao linkar o Postgres do passo 2), `JWT_SECRET` (gere um valor aleatório), `DB_SSL=true` só se o Postgres exigir SSL (não costuma ser necessário quando os serviços estão no mesmo projeto Railway).
4. Variável do serviço **frontend**: `NEXT_PUBLIC_API_URL` apontando para a URL pública gerada pela Railway para o serviço backend (precisa estar definida *antes* do build, já que o Next.js embute essa variável no bundle).
5. Anexos de comentário ficam em `backend/uploads/` — sem um Volume da Railway montado nesse caminho, os arquivos somem a cada novo deploy. Para persistir de verdade, adicione um Volume no serviço backend ou migre para um storage externo (S3/R2).
