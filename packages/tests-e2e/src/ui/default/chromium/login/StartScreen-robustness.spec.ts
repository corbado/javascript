import { expect, test } from '../../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../../utils/constants';

test.describe('StartScreen unproductive user behavior', () => {
  test('logging in from different device goes to EnterOtp', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true);

    const credentials = await loginFlow.getWebAuthnCredentials();
    expect(credentials).toHaveLength(1);
    await loginFlow.removeWebAuthnCredential(credentials[0].credentialId);

    await loginFlow.navigateToStartScreen();

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(email);

    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
  });
});
