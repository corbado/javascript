import { expect, test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, ScreenNames } from '../../../utils/constants';

test.describe('Login with passkey proper user behavior', () => {
  test('without verifying identifier', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
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

    await loginFlow.assertPasskeyInput(async () => {
      await page.getByRole('button', { name: 'Continue' }).click();
      // await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyBackground);
    });
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });

  // TODO: Why is conditional UI no longer triggered? Compare with previous test
  test.skip('with conditional UI', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    await loginFlow.createAccount([IdentifierType.Email], [IdentifierVerification.EmailOtp], true, true);
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await loginFlow.assertPasskeyInput(async () => {
      // conditional UI triggered when textbox is activated
      await page.getByRole('textbox', { name: 'email' }).click();
    });
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
