import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';

import getPort from 'get-port';
import path from 'path';
import waitPort from 'wait-port';

type PlaygroundType = 'connect-next' | 'connect-web-js';
const PLAYGROUND_TYPE: PlaygroundType = (process.env.PLAYGROUND_TYPE as PlaygroundType) || 'connect-next';

export type PlaygroundInfo = {
  server: ChildProcess;
  port: number;
};

function getPlaygroundDir(): string {
  switch (PLAYGROUND_TYPE) {
    case 'connect-next':
      return path.resolve(__dirname, '../../../../../playground/connect-next');
    case 'connect-web-js':
      return path.resolve(__dirname, '../../../../../playground/connect-web-js');
    default:
      throw new Error(`Unknown PLAYGROUND_TYPE: ${PLAYGROUND_TYPE}`);
  }
}

function getPlaygroundArgs(port: number): string[] {
  switch (PLAYGROUND_TYPE) {
    case 'connect-next':
      return ['run', 'build-and-start', '--', '--port', port.toString()];
    case 'connect-web-js':
      throw new Error(`Unimplemented: ${PLAYGROUND_TYPE}`);
    default:
      throw new Error(`Unknown PLAYGROUND_TYPE: ${PLAYGROUND_TYPE}`);
  }
}

export async function spawnPlaygroundNew(): Promise<PlaygroundInfo> {
  const port = await getPort();

  const playgroundDir = getPlaygroundDir();
  const server = spawn('npm', getPlaygroundArgs(port), {
    cwd: playgroundDir,
    env: {
      ...process.env,
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
