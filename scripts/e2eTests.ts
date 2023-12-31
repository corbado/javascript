import { exec } from 'child_process';
import { readdir } from 'fs/promises';
import fetch from 'node-fetch';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function importEnv(appDir: URL) {
  const envPath = join(appDir.toString(), 'playwright.env.ts');
  const envModule = await import(envPath);
  return envModule.config ?? envModule.default.config;
}

async function checkServerHealth(url: string) {
  let isReady = false;

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

async function serveAndTestApp(appDir: URL) {
  const envConfig = await importEnv(appDir);
  const appDirPath = appDir.toString();
  const appName = appDirPath.split('/').pop();

  await execAsync(`pm2 start npm --name "app-${appName}" -- run serve`, { cwd: appDirPath });

  await checkServerHealth(envConfig.PLAYWRIGHT_TEST_URL);

  const { stdout, stderr } = await execAsync('npm run test:e2e:playwright', { cwd: appDir, env: { ...envConfig } });
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);

  await execAsync(`pm2 delete "app-${appName}"`);
}

async function serveAndTestApps() {
  const playgroundDirPath = join(resolve(), 'playground');
  const playgroundDir = pathToFileURL(playgroundDirPath);
  const dirs = await readdir(playgroundDir);

  const promises = dirs.map(dir => {
    const appDirPath = join(playgroundDirPath, dir);
    const appDir = pathToFileURL(appDirPath);
    return serveAndTestApp(appDir);
  });

  await Promise.all(promises);
}

void serveAndTestApps();
