import { expect, test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Login with phone OTP proper user behavior', () => {
  test('fallback without appending passkey', async ({ loginFlow, page, context }, testInfo) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();
    await loginFlow.printTestInfo(page, context, testInfo);

    let [, , phone] = await loginFlow.createAccount(
      [IdentifierType.Phone],
      [IdentifierVerification.PhoneOtp],
      true,
      false,
    );
    phone = phone ?? '';
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'phone' }).click();
    await page.getByRole('textbox', { name: 'phone' }).fill(phone);
    await expect(page.getByRole('textbox', { name: 'phone' })).toHaveValue(
      new RegExp(`^(\\${phone.slice(0, 2)})?${phone.slice(2)}$`),
    );

    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.PhoneOtpLogin, undefined, phone);

    await loginFlow.fillOTP(OtpType.Phone);
    await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await page.getByText('Maybe later').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
