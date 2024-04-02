import { expect, test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, OtpType, ScreenNames, waitAfterLoad } from '../../../utils/constants';

test.describe('Flow-based unproductive user behavior', () => {
  test('abort login from passkey append after identifier verification', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();

    let [, email] = await loginFlow.createAccount([IdentifierType.Email], [IdentifierVerification.EmailOtp], true, false);
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

    await page.goBack();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);
  });

  test('navigate directly to InitSignup and InitLogin via URL', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();

    await page.goto(`/${process.env.PLAYWRIGHT_PROJECT_ID}/auth#signup-init`);
    await loginFlow.checkLandedOnScreen(ScreenNames.InitSignup);

    await page.waitForTimeout(waitAfterLoad);

    await page.goto(`/${process.env.PLAYWRIGHT_PROJECT_ID}/auth#login-init`);
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);
  });
});
