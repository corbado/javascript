import { test as base } from '@playwright/test';

import { ObserveAuthModel } from '../models/ObserveAuthModel';
import { ToolingSidebarModel } from '../models/ToolingSidebarModel';

export const test = base.extend<{ model: ObserveAuthModel }>({
  model: async ({ page }, use) => {
    const model = new ObserveAuthModel(page);
    await use(model);
  },
  _observeUserReport: [
    async ({ page }, use, testInfo) => {
      await use();

      // Ensure observe events are flushed before the page/context is torn down.
      await page.waitForTimeout(1000);

      const userIDs = ToolingSidebarModel.getTrackedUsers(page);
      const summary =
        userIDs.length === 0
          ? 'observe-user-id: none'
          : `observe-user-id: ${userIDs[0]}${userIDs.length > 1 ? ` (all: ${userIDs.join(', ')})` : ''}`;

      console.log(`[observe-postprocess] ${testInfo.title} -> ${summary}`);
      await testInfo.attach('observe-user-id', {
        contentType: 'text/plain',
        body: Buffer.from(summary, 'utf8'),
      });

      ToolingSidebarModel.clearTrackedUsers(page);

      const maxUsers = testInfo.file.includes('/scenarios/observe/reset-flow.spec.ts') ? 2 : 1;
      if (userIDs.length > maxUsers) {
        throw new Error(
          `Observe assumption violated: expected max ${maxUsers} user(s) per test, got ${
            userIDs.length
          } (${userIDs.join(', ')})`,
        );
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
