import type { ChildProcess } from 'node:child_process';

import { test } from '@playwright/test';

import { killPlaygroundNew, spawnPlaygroundNew } from '../utils/Playground';

test.describe('client-state flows', () => {
  let server: ChildProcess;
  let port: number;

  test.beforeAll(async () => {
    ({ server, port } = await spawnPlaygroundNew());
  });

  test.afterAll(() => {
    killPlaygroundNew(server);
  });

  test('testCookieBasedSync', async ({ page }) => {});
});
