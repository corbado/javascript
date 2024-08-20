import { test } from '../../../fixtures/UILoginTest';
import { IdentifierType, OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Login with passkey proper user behavior', () => {
  test('before verifying identifier', async ({ loginFlow, page, context }, testInfo) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();
    await loginFlow.printTestInfo(page, context, testInfo);

    let [, email] = await loginFlow.createAccount([IdentifierType.Email], [], true, true);
    email = email ?? '';
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await loginFlow.simulateSuccessfulPasskeyInput(() => page.locator('.cb-last-identifier').click());
    await loginFlow.checkLandedOnScreen(ScreenNames.EmailOtpLogin, email, undefined, true);

    await loginFlow.fillOTP(OtpType.Email);
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
