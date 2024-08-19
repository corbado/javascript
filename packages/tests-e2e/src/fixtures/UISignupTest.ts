import { test as base } from '@playwright/test';

import { UISignupFlow } from '../models/UISignupFlow';
import StateManager from '../utils/StateManager';

export const test = base.extend<{ signupFlow: UISignupFlow }>({
  signupFlow: async ({ page }, use, testInfo) => {
    const signupFlow = new UISignupFlow(page);

    signupFlow.projectId = StateManager.getProjectId(testInfo.project.name);

    await use(signupFlow);
  },
});

export { expect } from '@playwright/test';
