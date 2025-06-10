import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';

import getPort from 'get-port';
import path from 'path';
import waitPort from 'wait-port';

type PlaygroundType = 'react' | 'web-js' | 'web-js-script';
const PLAYGROUND_TYPE: PlaygroundType = (process.env.PLAYGROUND_TYPE as PlaygroundType) || 'react';

// function getRootDir(): string {
//   return path.resolve(__dirname, '../../../../..');
// }

function getPlaygroundDir(): string {
  switch (PLAYGROUND_TYPE) {
    case 'react':
      return path.resolve(__dirname, '../../../../../playground/react');
    case 'web-js':
      return path.resolve(__dirname, '../../../../../playground/web-js');
    case 'web-js-script':
      return path.resolve(__dirname, '../../../../../playground/web-js-script');
    default:
      throw new Error(`Unknown PLAYGROUND_TYPE: ${PLAYGROUND_TYPE}`);
  }
}

function getPlaygroundArgs(port: number): string[] {
  switch (PLAYGROUND_TYPE) {
    case 'react':
      return ['run', 'build-and-preview', '--', '--port', port.toString()];
    case 'web-js':
      return ['run', 'build-and-preview', '--', '-l', port.toString()];
    case 'web-js-script':
      return ['run', 'build-and-preview', '--', '-l', port.toString()];
    default:
      throw new Error(`Unknown PLAYGROUND_TYPE: ${PLAYGROUND_TYPE}`);
  }
}

export async function spawnPlaygroundNew(projectId: string): Promise<{
  server: ChildProcess;
  port: number;
}> {
  const port = await getPort();

  const playgroundDir = getPlaygroundDir();
  const server = spawn('npm', getPlaygroundArgs(port), {
    cwd: playgroundDir,
    env: {
      ...process.env,
      VITE_CORBADO_PROJECT_ID_ManualTesting: projectId,
    },
    stdio: 'inherit',
    shell: true,
  });
  const ok = await waitPort({ host: 'localhost', port, timeout: 15_000, output: 'silent' });
  if (!ok) {
    server.kill();
    throw new Error(`Server never came up on port ${port}`);
  }

  return { server, port };
}

export function killPlaygroundNew(server: ChildProcess) {
  server.kill();
}

export default async function installPlaygroundDeps() {
  // const rootDir = getRootDir();
  //
  // const lernaBuildProcess = spawn('npm', ['run', 'build'], {
  //   cwd: rootDir,
  //   stdio: 'inherit',
  //   shell: true,
  // });
  //
  // await new Promise<void>((resolve, reject) => {
  //   lernaBuildProcess.on('close', (code: number) => {
  //     if (code === 0) {
  //       console.log(`[Global Setup] 'lerna run build' completed successfully.`);
  //       resolve();
  //     } else {
  //       reject(new Error(`[Global Setup] 'lerna run build' failed with code ${code}`));
  //     }
  //   });
  //   lernaBuildProcess.on('error', (err: Error) => {
  //     reject(new Error(`[Global Setup] Failed to start 'lerna run build' process: ${err.message}`));
  //   });
  // });

  const playgroundDir = getPlaygroundDir();

  const installProcess = spawn('npm', ['install'], {
    cwd: playgroundDir,
    stdio: 'inherit',
    shell: true,
  });

  await new Promise<void>((resolve, reject) => {
    installProcess.on('close', (code: number) => {
      if (code === 0) {
        console.log(`[Global Setup] Dependencies installed successfully in ${playgroundDir}.`);
        resolve();
      } else {
        reject(new Error(`[Global Setup] npm install failed in ${playgroundDir} with code ${code}`));
      }
    });
    installProcess.on('error', (err: Error) => {
      reject(new Error(`[Global Setup] Failed to start npm install process: ${err.message}`));
    });
  });
}
