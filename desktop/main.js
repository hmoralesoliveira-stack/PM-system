const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const BACKEND_PORT = 3001;
const FRONTEND_PORT = 3000;
// Primeira execução costuma ser bem mais lenta (antivírus escaneando os
// arquivos recém-instalados, disco lento etc.), então damos uma folga
// generosa antes de desistir.
const START_TIMEOUT_MS = 5 * 60 * 1000;

const isPackaged = app.isPackaged;
const resourcesDir = isPackaged ? process.resourcesPath : path.join(__dirname, 'resources');
const backendDir = path.join(resourcesDir, 'backend');
const frontendDir = path.join(resourcesDir, 'frontend');

const logsDir = path.join(app.getPath('userData'), 'logs');
fs.mkdirSync(logsDir, { recursive: true });
const backendLog = fs.createWriteStream(path.join(logsDir, 'backend.log'), { flags: 'a' });
const frontendLog = fs.createWriteStream(path.join(logsDir, 'frontend.log'), { flags: 'a' });

let backendProcess;
let frontendProcess;
let mainWindow;

function waitForHttp(url, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timeout aguardando ${url}`));
        } else {
          setTimeout(tryOnce, 500);
        }
      });
    };
    tryOnce();
  });
}

// Roda um script Node usando o próprio binário do Electron como runtime,
// assim o instalador não depende de o usuário ter Node.js instalado.
function spawnNode(scriptPath, args, cwd, env) {
  return spawn(process.execPath, [scriptPath, ...args], {
    cwd,
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', ...env },
    stdio: 'pipe',
  });
}

function startBackend() {
  const userDataDir = app.getPath('userData');
  const env = {
    PORT: String(BACKEND_PORT),
    DB_TYPE: 'sqlite',
    DB_SQLITE_PATH: path.join(userDataDir, 'pmsystem.sqlite'),
    UPLOADS_DIR: path.join(userDataDir, 'uploads'),
    JWT_SECRET: process.env.JWT_SECRET || 'pm-system-local-desktop-secret',
  };
  backendProcess = spawnNode(path.join(backendDir, 'dist', 'main.js'), [], backendDir, env);
  backendProcess.stdout.on('data', (d) => backendLog.write(d));
  backendProcess.stderr.on('data', (d) => backendLog.write(d));
  backendProcess.on('error', (err) => backendLog.write(`[spawn error] ${err.stack}\n`));
  backendProcess.on('exit', (code, signal) =>
    backendLog.write(`[exit] code=${code} signal=${signal}\n`),
  );
}

function startFrontend() {
  // "next start" via o CLI do Next.js, usando o server já buildado em .next
  const nextBin = path.join(frontendDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  const env = {
    PORT: String(FRONTEND_PORT),
    NEXT_PUBLIC_API_URL: `http://localhost:${BACKEND_PORT}`,
  };
  frontendProcess = spawnNode(nextBin, ['start'], frontendDir, env);
  frontendProcess.stdout.on('data', (d) => frontendLog.write(d));
  frontendProcess.stderr.on('data', (d) => frontendLog.write(d));
  frontendProcess.on('error', (err) => frontendLog.write(`[spawn error] ${err.stack}\n`));
  frontendProcess.on('exit', (code, signal) =>
    frontendLog.write(`[exit] code=${code} signal=${signal}\n`),
  );
}

const LOADING_HTML = `data:text/html;charset=utf-8,${encodeURIComponent(`
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>PM System</title>
<style>
  body { font-family: system-ui, sans-serif; height: 100vh; margin: 0;
         display: flex; align-items: center; justify-content: center;
         background: #0f172a; color: #e2e8f0; }
  .box { text-align: center; }
  .spinner { width: 36px; height: 36px; margin: 0 auto 16px;
             border: 4px solid #334155; border-top-color: #38bdf8;
             border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
  <div class="box">
    <div class="spinner"></div>
    <div>Iniciando o PM System local…</div>
    <div style="font-size:12px;color:#94a3b8;margin-top:8px">
      Pode levar até alguns minutos na primeira vez.
    </div>
  </div>
</body>
</html>`)}`;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });
  await mainWindow.loadURL(LOADING_HTML);

  try {
    await waitForHttp(`http://localhost:${BACKEND_PORT}`, START_TIMEOUT_MS);
    await waitForHttp(`http://localhost:${FRONTEND_PORT}`, START_TIMEOUT_MS);
    await mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
  } catch (err) {
    dialog.showErrorBox(
      'PM System — erro ao iniciar',
      `Não foi possível iniciar a aplicação local.\n\n${err.message}\n\n` +
        `Logs para diagnóstico:\n${logsDir}`,
    );
    app.quit();
  }
}

app.whenReady().then(() => {
  startBackend();
  startFrontend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

function stopChildren() {
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
}

app.on('window-all-closed', () => {
  stopChildren();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', stopChildren);
