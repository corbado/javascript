import { test } from '../../../fixtures/UILoginTest';
import { ScreenNames, waitAfterLoad } from '../../../utils/constants';

test.describe('Flow-based unproductive user behavior', () => {
  test('navigate directly to InitSignup and InitLogin via URL', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();

    await page.goto(`/${loginFlow.projectId}/auth#signup-init`);
    await loginFlow.checkLandedOnScreen(ScreenNames.InitSignup);

    await page.waitForTimeout(waitAfterLoad);

    await page.goto(`/${loginFlow.projectId}/auth#login-init`);
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);
  });
});
