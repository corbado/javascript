import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';

import getPort from 'get-port';
import path from 'path';
import waitPort from 'wait-port';

type PlaygroundType = 'react' | 'web-js' | 'web-js-script';
const PLAYGROUND_TYPE: PlaygroundType = (process.env.PLAYGROUND_TYPE as PlaygroundType) || 'react';

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

function getPlaygroundBuildArgs(): string[] | null {
  switch (PLAYGROUND_TYPE) {
    case 'react':
      return ['run', 'build'];
    case 'web-js':
      return ['run', 'build'];
    case 'web-js-script':
      return null;
    default:
      throw new Error(`Unknown PLAYGROUND_TYPE: ${PLAYGROUND_TYPE}`);
  }
}

function getPlaygroundStartArgs(port: number): string[] {
  switch (PLAYGROUND_TYPE) {
    case 'react':
      return ['run', 'preview', '--', '-p', port.toString()];
    case 'web-js':
      return ['run', 'serve', '--', '-l', port.toString()];
    case 'web-js-script':
      return ['run', 'serve', '--', '-l', port.toString()];
    default:
      throw new Error(`Unknown PLAYGROUND_TYPE: ${PLAYGROUND_TYPE}`);
  }
}

export async function spawnPlaygroundNew(
  projectId: string,
  options: { fixedPort?: number } = {},
): Promise<{
  server: ChildProcess;
  port: number;
}> {
  let port = await getPort();
  if (options.fixedPort !== undefined) {
    const resolved = await getPort({ port: options.fixedPort });
    if (resolved !== options.fixedPort) {
      throw new Error(`Requested fixed port ${options.fixedPort} is not available (resolved ${resolved}).`);
    }
    port = options.fixedPort;
  }

  const playgroundDir = getPlaygroundDir();
  const server = spawn('npm', getPlaygroundStartArgs(port), {
    cwd: playgroundDir,
    env: {
      ...process.env,
      NEXT_PUBLIC_CORBADO_PROJECT_ID: projectId,
    },
    stdio: 'ignore',
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
        const buildCommand = getPlaygroundBuildArgs();
        if (!buildCommand) {
          console.log(`[Global Setup] No build step required for ${PLAYGROUND_TYPE}.`);
          return resolve();
        }
        const buildProcess = spawn('npm', buildCommand, {
          cwd: playgroundDir,
          stdio: 'inherit',
          shell: true,
        });
        buildProcess.on('close', (buildCode: number) => {
          if (buildCode === 0) {
            console.log(`[Global Setup] Playground built successfully in ${playgroundDir}.`);
            resolve();
          } else {
            reject(new Error(`[Global Setup] npm run build failed in ${playgroundDir} with code ${buildCode}`));
          }
        });
        buildProcess.on('error', (err: Error) => {
          reject(new Error(`[Global Setup] Failed to start build process: ${err.message}`));
        });
      } else {
        reject(new Error(`[Global Setup] npm install failed in ${playgroundDir} with code ${code}`));
      }
    });
    installProcess.on('error', (err: Error) => {
      reject(new Error(`[Global Setup] Failed to start npm install process: ${err.message}`));
    });
  });
}
