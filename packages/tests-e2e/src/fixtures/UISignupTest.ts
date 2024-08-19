import { test as base } from '@playwright/test';

import { UISignupFlow } from '../models/UISignupFlow';
import StateManager from '../utils/StateManager';

export const test = base.extend<{ signupFlow: UISignupFlow }>({
  signupFlow: async ({ page, context }, use, testInfo) => {
    const signupFlow = new UISignupFlow(page);

    signupFlow.projectId = StateManager.getProjectId(testInfo.project.name);

    const cboAuthProcessRaw = (await context.storageState()).origins
      .find(origin => origin.origin.replace(/\/$/, '') === process.env.PLAYWRIGHT_TEST_URL?.replace(/\/$/, ''))
      ?.localStorage.find(item => item.name === 'cbo_auth_process')?.value;
    let processId = '_';
    if (cboAuthProcessRaw) {
      const cboAuthProcess = JSON.parse(cboAuthProcessRaw);
      processId = cboAuthProcess.id;
    }
    console.log(testInfo.project.name, signupFlow.projectId, processId);

    await use(signupFlow);
  },
});

export { expect } from '@playwright/test';
