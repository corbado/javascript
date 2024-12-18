import { test as base } from '@playwright/test';

import { CorbadoAuthModel } from '../models/CorbadoAuthModel';
import { VirtualAuthenticator } from '../models/utils/VirtualAuthenticator';

export const test = base.extend<{ model: CorbadoAuthModel }>({
  model: async ({ page }, use, testInfo) => {
    const virtualAuthenticator = new VirtualAuthenticator();
    await virtualAuthenticator.initializeCDPSession(page);

    const model = new CorbadoAuthModel(page, virtualAuthenticator);

    await use(model);
  },
});

export { expect } from '@playwright/test';
