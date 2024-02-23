import { test } from '../../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../../utils/constants';

test.describe('PasskeyBenefitsScreen unproductive user behavior', () => {
  test('skip to OTP method', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.navigateToPasskeyBenefitsScreen();

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
  });
});
