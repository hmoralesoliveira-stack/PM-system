// Monta desktop/resources/{backend,frontend} com o build de produção do
// backend (NestJS) e do frontend (Next.js), prontos para rodar dentro do
// Electron sem depender de Node.js instalado na máquina do usuário.
//
// Pré-requisito: rodar `npm run build` no backend e no frontend antes disto
// (veja desktop/README.md). Este script só empacota o que já foi buildado.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..', '..');
const backendSrc = path.join(root, 'backend');
const frontendSrc = path.join(root, 'frontend');
const resourcesDir = path.join(__dirname, '..', 'resources');
const backendOut = path.join(resourcesDir, 'backend');
const frontendOut = path.join(resourcesDir, 'frontend');

function assertExists(p, hint) {
  if (!fs.existsSync(p)) {
    throw new Error(`Não encontrado: ${p}\n${hint}`);
  }
}

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

function npmInstallProd(dir) {
  execFileSync('npm', ['ci', '--omit=dev', '--ignore-scripts=false'], {
    cwd: dir,
    stdio: 'inherit',
  });
}

function main() {
  fs.rmSync(resourcesDir, { recursive: true, force: true });
  fs.mkdirSync(backendOut, { recursive: true });
  fs.mkdirSync(frontendOut, { recursive: true });

  // --- backend ---
  assertExists(
    path.join(backendSrc, 'dist'),
    'Rode `npm run build` dentro de backend/ antes de empacotar o desktop.',
  );
  copyDir(path.join(backendSrc, 'dist'), path.join(backendOut, 'dist'));
  fs.copyFileSync(path.join(backendSrc, 'package.json'), path.join(backendOut, 'package.json'));
  fs.copyFileSync(
    path.join(backendSrc, 'package-lock.json'),
    path.join(backendOut, 'package-lock.json'),
  );
  npmInstallProd(backendOut);

  // --- frontend ---
  assertExists(
    path.join(frontendSrc, '.next'),
    'Rode `npm run build` dentro de frontend/ (com NEXT_PUBLIC_API_URL=http://localhost:3001) antes de empacotar o desktop.',
  );
  copyDir(path.join(frontendSrc, '.next'), path.join(frontendOut, '.next'));
  if (fs.existsSync(path.join(frontendSrc, 'public'))) {
    copyDir(path.join(frontendSrc, 'public'), path.join(frontendOut, 'public'));
  }
  fs.copyFileSync(path.join(frontendSrc, 'package.json'), path.join(frontendOut, 'package.json'));
  fs.copyFileSync(
    path.join(frontendSrc, 'package-lock.json'),
    path.join(frontendOut, 'package-lock.json'),
  );
  fs.copyFileSync(path.join(frontendSrc, 'next.config.js'), path.join(frontendOut, 'next.config.js'));
  npmInstallProd(frontendOut);

  console.log('Recursos do desktop prontos em desktop/resources/.');
}

main();
