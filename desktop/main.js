const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const BACKEND_PORT = 3001;
const FRONTEND_PORT = 3000;

const isPackaged = app.isPackaged;
const resourcesDir = isPackaged ? process.resourcesPath : path.join(__dirname, 'resources');
const backendDir = path.join(resourcesDir, 'backend');
const frontendDir = path.join(resourcesDir, 'frontend');

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
function spawnNode(scriptPath, cwd, env) {
  return spawn(process.execPath, [scriptPath], {
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
  backendProcess = spawnNode(path.join(backendDir, 'dist', 'main.js'), backendDir, env);
  backendProcess.stdout.on('data', (d) => console.log(`[backend] ${d}`));
  backendProcess.stderr.on('data', (d) => console.error(`[backend] ${d}`));
}

function startFrontend() {
  // "next start" via o CLI do Next.js, usando o server já buildado em .next
  const nextBin = path.join(frontendDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  const env = {
    PORT: String(FRONTEND_PORT),
    NEXT_PUBLIC_API_URL: `http://localhost:${BACKEND_PORT}`,
  };
  frontendProcess = spawnNode(nextBin, frontendDir, env);
  frontendProcess.stdout.on('data', (d) => console.log(`[frontend] ${d}`));
  frontendProcess.stderr.on('data', (d) => console.error(`[frontend] ${d}`));
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      contextIsolation: true,
    },
  });

  try {
    await waitForHttp(`http://localhost:${BACKEND_PORT}`, 30000).catch(() => {});
    await waitForHttp(`http://localhost:${FRONTEND_PORT}`, 60000);
    await mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
    mainWindow.show();
  } catch (err) {
    dialog.showErrorBox(
      'PM System — erro ao iniciar',
      `Não foi possível iniciar a aplicação local.\n\n${err.message}`,
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
