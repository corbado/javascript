import { test as base } from '@playwright/test';

import { BaseModel } from '../models/BaseModel';
import { CDPSessionManager } from '../utils/CDPSessionManager';
import { NetworkRequestBlocker } from '../utils/NetworkRequestBlocker';
import { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export const test = base.extend<{
  model: BaseModel;
}>({
  model: async ({ page }, use) => {
    const cdpManager = new CDPSessionManager();
    await cdpManager.initialize(page);

    const authenticator = new VirtualAuthenticator(cdpManager);
    const blocker = new NetworkRequestBlocker(cdpManager);

    const model = new BaseModel(page, authenticator, blocker);

    await use(model);
  },
});

export { expect } from '@playwright/test';
