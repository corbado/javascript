import { expect, test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, ScreenNames } from '../../../utils/constants';

test.describe('Login with passkey proper user behavior', () => {
  test('without verifying identifier', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();

    let [, email] = await loginFlow.createAccount(
      [IdentifierType.Email],
      [IdentifierVerification.EmailOtp],
      true,
      true,
    );
    email = email ?? '';
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(email);

    await loginFlow.simulateSuccessfulPasskeyInput(() => page.getByRole('button', { name: 'Continue' }).click());
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });

  test('with conditional UI', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();

    await loginFlow.createAccount([IdentifierType.Email], [IdentifierVerification.EmailOtp], true, true);
    
    // condition UI is prompted on page load, not on textbox click
    await loginFlow.simulateSuccessfulPasskeyInput(() => page.getByText('Log in').click());
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
