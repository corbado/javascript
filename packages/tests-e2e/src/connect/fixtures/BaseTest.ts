import { test as base } from '@playwright/test';

import { BaseModel } from '../models/BaseModel';
import { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export const test = base.extend<{ model: BaseModel }>({
  model: async ({ page }, use) => {
    const authenticator = new VirtualAuthenticator();
    await authenticator.initializeCDPSession(page);

    const model = new BaseModel(page, authenticator);

    await use(model);
  },
});

export { expect } from '@playwright/test';
