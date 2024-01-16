import { test as base } from '@playwright/test';

import { UILoginFlow } from '../models/UILoginFlow';

export const test = base.extend<{ loginFlow: UILoginFlow }>({
  loginFlow: async ({ page }, use) => {
    const loginFlow = new UILoginFlow(page);
    await loginFlow.goto();
    await use(loginFlow);
  },
});

export { expect } from '@playwright/test';
