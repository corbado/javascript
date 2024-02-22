import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with email link and phone OTP proper user behavior', () => {
  test('with no passkey support', async ({ signupFlow, page }) => {
    await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailLinkSent);

    // TODO: figure out how to handle email link in tests
  });
});
