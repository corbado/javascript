import { expect, test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Login with email OTP proper user behavior', () => {
  test('fallback without appending passkey', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    let [, email] = await loginFlow.createAccount(
      [IdentifierType.Email],
      [IdentifierVerification.EmailOtp],
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
    await loginFlow.checkLandedOnScreen(ScreenNames.EmailOtpLogin, email);

    await loginFlow.fillOTP(OtpType.Email);
    await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await page.getByText('Maybe later').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });

  test('fallback then append passkey', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    let [, email] = await loginFlow.createAccount(
      [IdentifierType.Email],
      [IdentifierVerification.EmailOtp],
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
    await loginFlow.checkLandedOnScreen(ScreenNames.EmailOtpLogin, email);

    await loginFlow.fillOTP(OtpType.Email);
    await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await loginFlow.addPasskeyInput(async () => {
      await page.getByRole('button', { name: 'Create passkey' }).click();
    });
    await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);

    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkPasskeyRegistered();
  });
});
