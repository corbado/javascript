import { expect, test } from '../../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../../utils/constants';

test.describe('Login with passkey proper user behavior', () => {
  test('from Start', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccountWithVerificationAtSignup(true);

    await loginFlow.navigateToStartScreen();

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(email);
    await page.getByRole('button', { name: 'Continue' }).click();

    await loginFlow.inputPasskey(async () => {
      await loginFlow.checkLandedOnScreen(ScreenNames.End);
      await loginFlow.checkPasskeyRegistered();
    });
  });
});
