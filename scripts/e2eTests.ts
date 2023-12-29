import { exec, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function importEnv(appDir: string) {
  const envPath = path.join(appDir, 'playwright.env.ts');
  const envModule = await import(envPath);
  return envModule.config;
}

async function checkServerHealth(url: string) {
  let isReady = false;
  const fetch = (await import('node-fetch')).default;

  while (!isReady) {
    try {
      const response = await fetch(`${url}/`);
      if (response.ok) {
        isReady = true;
      }
    } catch (error) {
      console.log(error);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function serveAndTestApp(appDir: string) {
  const envConfig = await importEnv(appDir);

  const server = spawn('npm.cmd', ['run', 'serve'], { cwd: appDir, stdio: 'inherit' });

  await checkServerHealth(envConfig.PLAYWRIGHT_TEST_URL);

  const { stdout, stderr } = await execAsync('npm run test:e2e', { cwd: appDir, env: { ...envConfig } });
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);

  server.kill();
}

async function serveAndTestApps() {
  const playgroundDir = path.join(path.resolve(), 'playground');
  const dirs = await fs.readdir(playgroundDir);

  const promises = dirs.map(dir => {
    const appDir = path.join(playgroundDir, dir);
    return serveAndTestApp(appDir);
  });

  await Promise.all(promises);
}

void serveAndTestApps();
