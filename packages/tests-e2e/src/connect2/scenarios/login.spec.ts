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

  test.skip('testLoginWithOneTap', async ({ page }) => {});

  test.skip('testLoginWithCUI', async ({ page }) => {});

  test.skip('testLoginErrorStates', async ({ page }) => {});

  test.skip('testLoginErrorStatesGradualRollout', async ({ page }) => {});

  test.skip('testLoginErrorStatesPasskeyDeletedClientSide', async ({ page }) => {});
});
