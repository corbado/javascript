import { test as base } from '@playwright/test';

import { UILoginFlow } from '../models/UILoginFlow';
import StateManager from '../utils/StateManager';

export const test = base.extend<{ loginFlow: UILoginFlow }>({
  loginFlow: async ({ page }, use, testInfo) => {
    const loginFlow = new UILoginFlow(page);
    loginFlow.projectId = StateManager.getProjectId(testInfo.project.name);
    await use(loginFlow);
  },
});

export { expect } from '@playwright/test';
