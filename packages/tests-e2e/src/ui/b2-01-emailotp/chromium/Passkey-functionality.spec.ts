import { test } from '../../../fixtures/UILoginTest';
import { IdentifierType, IdentifierVerification, ScreenNames } from '../../../utils/constants';

test.describe('Login with passkey proper user behavior', () => {
  test('without verifying identifier', async ({ loginFlow, page, context }, testInfo) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();
    await loginFlow.printTestInfo(page, context, testInfo);

    await loginFlow.createAccount([IdentifierType.Email], [IdentifierVerification.EmailOtp], true, true);
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await loginFlow.simulateSuccessfulPasskeyInput(() => page.locator('.cb-last-identifier').click());
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });

  test('with conditional UI', async ({ loginFlow, page, context }, testInfo) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();
    await loginFlow.printTestInfo(page, context, testInfo);

    await loginFlow.createAccount([IdentifierType.Email], [IdentifierVerification.EmailOtp], true, true);

    // condition UI is prompted on page load, not on textbox click
    await loginFlow.simulateSuccessfulPasskeyInput(() => page.getByText('Log in').click());
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
