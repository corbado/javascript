import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyAppendScreen unproductive user behavior', () => {
  test('go to PasskeyBenefits', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeyAppendPage();

    await page.getByText('Passkeys').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyBenefits);
  });

  test('cancelling passkey input goes to LoggedIn', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeyAppendPage(false);

    await page.getByRole('button', { name: 'Activate' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
  });

  test('declining goes to LoggedIn', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeyAppendPage();

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
