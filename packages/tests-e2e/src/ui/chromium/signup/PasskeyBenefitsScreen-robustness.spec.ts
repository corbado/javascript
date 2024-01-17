import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyBenefits unproductive user behavior', () => {
  test('skip to OTP method', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeyBenefitsPage(true);

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
  });
});
