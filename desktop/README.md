# PM System — instalação local (desktop)

Empacota o PM System (backend NestJS + frontend Next.js) como um aplicativo
de desktop com o Electron, gerando um instalador `.exe` (NSIS) e `.msi` para
Windows. Não é necessário Node.js, Docker ou Postgres na máquina de quem vai
instalar: o banco de dados é um arquivo SQLite local, criado automaticamente
na pasta de dados do usuário na primeira execução.

## Forma recomendada: build automático via GitHub Actions

Como gerar um `.msi` exige ferramentas do Windows (WiX), o jeito mais
confiável é deixar o workflow `.github/workflows/build-desktop.yml` fazer o
build em uma máquina `windows-latest`:

1. Rode o workflow manualmente (aba **Actions** → **Build desktop installer
   (Windows)** → **Run workflow**), ou crie uma tag `desktop-v1.0.0` e dê
   push — isso também dispara o build.
2. Quando terminar, baixe o artefato `pm-system-desktop-installers` da própria
   execução do workflow: ele contém o `.exe` e o `.msi`.
3. Copie o instalador para a máquina Windows onde ele vai ser instalado e
   rode normalmente (duplo clique) — não abre navegador nem depende de
   internet para funcionar depois de instalado.

## Build local (Windows)

Se preferir gerar o instalador direto em uma máquina Windows com Node.js 20+:

```powershell
cd backend
npm ci
npm run build

cd ..\frontend
$env:NEXT_PUBLIC_API_URL = "http://localhost:3001"
npm ci
npm run build

cd ..\desktop
npm ci
npm run dist
```

Os instaladores ficam em `desktop/dist/` (`*.exe` e `*.msi`).

> Build em Linux/macOS gera o app mas normalmente só produz o `.exe` (NSIS);
> o target `.msi` depende do WiX Toolset, que só existe no Windows.

## Como funciona

- `main.js` sobe o backend (NestJS, com SQLite) e o frontend (`next start`)
  como processos filhos, usando o próprio runtime do Electron como Node —
  por isso não é preciso Node.js instalado na máquina de quem usa o app.
- Os dados ficam em `%APPDATA%/pm-system-desktop` (banco `pmsystem.sqlite` e
  pasta `uploads/`), preservados entre atualizações do app.
- A janela do Electron carrega `http://localhost:3000` (o frontend), que
  fala com o backend em `http://localhost:3001` — tudo local, sem servidor
  externo.
- `scripts/prepare-resources.js` copia os builds de produção do backend e do
  frontend para `desktop/resources/`, incluindo um `npm ci --omit=dev`
  próprio para cada um (garante que dependências nativas, como o
  `better-sqlite3`, sejam compiladas para a plataforma de destino).
