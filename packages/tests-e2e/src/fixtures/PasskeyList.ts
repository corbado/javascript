import { test } from '@playwright/test';

import { PasskeyListModel } from '../models/PasskeyListModel';
import { VirtualAuthenticator } from '../models/utils/VirtualAuthenticator';

export const passkeyListTest = test.extend<{ model: PasskeyListModel }>({
  model: async ({ page }, use, testInfo) => {
    const virtualAuthenticator = new VirtualAuthenticator();
    await virtualAuthenticator.initializeCDPSession(page);

    const model = new PasskeyListModel(page, virtualAuthenticator);

    await use(model);
  },
});

export { expect } from '@playwright/test';
