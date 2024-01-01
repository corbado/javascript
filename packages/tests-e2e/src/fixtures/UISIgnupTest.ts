import { test as base } from '@playwright/test';

import { UISignupPage } from '../models/UISignupPage';

export const test = base.extend<{ signupPage: UISignupPage }>({
  signupPage: async ({ page }, use) => {
    const signupPage = new UISignupPage(page);
    await signupPage.goto();
    await use(signupPage);
  },
});

export { expect } from '@playwright/test';
