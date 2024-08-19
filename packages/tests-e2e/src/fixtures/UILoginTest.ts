import { test as base } from '@playwright/test';

import { UILoginFlow } from '../models/UILoginFlow';
import StateManager from '../utils/StateManager';

export const test = base.extend<{ loginFlow: UILoginFlow }>({
  loginFlow: async ({ page, context }, use, testInfo) => {
    const loginFlow = new UILoginFlow(page);

    loginFlow.projectId = StateManager.getProjectId(testInfo.project.name);
    
    const cboAuthProcessRaw = (await context.storageState()).origins
      .find(origin => origin.origin.replace(/\/$/, '') === process.env.PLAYWRIGHT_TEST_URL?.replace(/\/$/, ''))
      ?.localStorage.find(item => item.name === 'cbo_auth_process')?.value;
    let processId = '_';
    if (cboAuthProcessRaw) {
      const cboAuthProcess = JSON.parse(cboAuthProcessRaw);
      processId = cboAuthProcess.id;
    }
    console.log(testInfo.project.name, loginFlow.projectId, processId);

    await use(loginFlow);
  },
});

export { expect } from '@playwright/test';
