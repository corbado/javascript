import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Flow-based unproductive user behavior', () => {
  test('navigate back from fallback to passkey append', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByText('Email verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await page.goBack();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);
  });

  test('abort signup from enforced identifier verification after passkey registration', async ({
    signupFlow,
    page,
  }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await signupFlow.simulateSuccessfulPasskeyInput(() => page.getByRole('button', { name: 'Create account' }).click());
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    page.once('dialog', dialog => void dialog.accept());
    await page.goBack();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    page.once('dialog', dialog => void dialog.dismiss());
    await page.goBack();
    await signupFlow.checkLandedOnScreen(ScreenNames.InitSignup);
  });
});
