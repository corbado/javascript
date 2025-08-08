import type { ChildProcess } from 'node:child_process';

import { test } from '@playwright/test';

import { killPlaygroundNew, spawnPlaygroundNew } from '../../connect/utils/Playground';

test.describe('append flows', () => {
  let server: ChildProcess;
  let port: number;

  test.beforeAll(async () => {
    ({ server, port } = await spawnPlaygroundNew());
  });

  test.afterAll(() => {
    killPlaygroundNew(server);
  });

  test.skip('testLoginErrorStatesNetworkBlocking', async ({ page }) => {});

  test.skip('testLoginErrorStatesPasskeyAppendBlocked', async ({ page }) => {});

  test.skip('testManageErrorStatesNetworkBlocking', async ({ page }) => {});
});
