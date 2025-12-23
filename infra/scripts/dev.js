const { spawn } = require('node:child_process');
const { exec } = require('node:child_process');

spawn('node', ['node_modules/next/dist/bin/next', 'dev'], { stdio: 'inherit' });

const shutdown = () => {
  console.log('Encerrando...');
  exec('npm run services:stop');
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
