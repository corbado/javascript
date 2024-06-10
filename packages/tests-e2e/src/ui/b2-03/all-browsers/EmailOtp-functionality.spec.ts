import { expect, test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Login with email OTP proper user behavior', () => {
  test('with no passkey support', async ({ loginFlow, page, browserName }) => {
    if (browserName === 'chromium') {
      await loginFlow.initializeCDPSession();
      await loginFlow.addWebAuthn(false);
    }
    await loginFlow.loadAuth();

    let [, email] =
      // browserName === 'firefox'
      //   ? await loginFlow.createAccount([IdentifierType.Email], [IdentifierVerification.EmailOtp], true, false)
      //   : await loginFlow.createAccount([IdentifierType.Email], [], false, false);
      await loginFlow.createAccount([IdentifierType.Email], [IdentifierVerification.EmailOtp], false, false);

    email = email ?? '';
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(email);
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.EmailOtpLogin, email);

    await loginFlow.fillOTP(OtpType.Email);

    // if (browserName === 'firefox') {
    //   await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);
    //   await page.getByText('Maybe later').click();
    // }

    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkNoPasskeyRegistered();
  });
});
