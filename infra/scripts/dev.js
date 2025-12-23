const { spawn } = require('node:child_process');
const { exec } = require('node:child_process');

spawn('node', ['node_modules/next/dist/bin/next', 'dev'], { stdio: 'inherit' });

const shutdown = () => {
  if (process.platform === 'win32') {
    exec('npm run services:stop');
    return;
  }

  console.log('Encerrando...');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
