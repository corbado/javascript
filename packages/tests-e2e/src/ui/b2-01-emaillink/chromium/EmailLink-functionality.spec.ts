import { expect, test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, ScreenNames } from '../../../utils/constants';

test.describe('Login with phone OTP proper user behavior', () => {
  test('fallback without appending passkey', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    let [, email] = await loginFlow.createAccount(
      [IdentifierType.Email],
      [IdentifierVerification.EmailLink],
      true,
      false,
    );
    email = email ?? '';
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(email);
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.EmailLinkSentLogin, email);

    // TODO: construct email link and open in a new tab

    await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await page.getByText('Maybe later').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
