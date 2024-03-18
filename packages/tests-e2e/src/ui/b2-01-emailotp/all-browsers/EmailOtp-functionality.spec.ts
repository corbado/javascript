import { expect, test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Login with email OTP proper user behavior', () => {
  test.skip('with no passkey support', async ({ loginFlow, page }) => {
    let [, email] = await loginFlow.createAccount([IdentifierType.Email], [IdentifierVerification.EmailOtp], false, false);
    email = email ?? '';
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(email);
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.EmailOtpLogin, email);

    await loginFlow.fillOTP(OtpType.Email);
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkNoPasskeyRegistered();
  });
});