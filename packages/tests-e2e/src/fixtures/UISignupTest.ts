import { test as base } from '@playwright/test';

import { UISignupFlow } from '../models/UISignupFlow';

export const test = base.extend<{ signupFlow: UISignupFlow }>({
  signupFlow: async ({ page }, use) => {
    const signupFlow = new UISignupFlow(page);
    await signupFlow.goto();
    await use(signupFlow);
  },
});

export { expect } from '@playwright/test';
