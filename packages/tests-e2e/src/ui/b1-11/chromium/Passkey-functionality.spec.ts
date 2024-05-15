import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('single case', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    await signupFlow.fillIdentifiers(true, false, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await signupFlow.simulateSuccessfulPasskeyInput(() => page.getByRole('button', { name: 'Create account' }).click());
    //TODO: uncomment this after fixing the issue
    // await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);

    // await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });
});
