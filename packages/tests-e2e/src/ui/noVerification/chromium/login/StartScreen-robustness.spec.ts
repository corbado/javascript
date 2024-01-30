import { expect, test } from '../../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../../utils/constants';

test.describe('StartScreen unproductive user behavior', () => {
  // TODO: figure out how to simulate different users (simply adding a different webauthn doesn't work, maybe try adding credentials manually)
  test.skip('logging in from different device goes to EnterOtp', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true);

    // Remove webauthn used for signup
    await loginFlow.removeWebAuthn();
    // add different webauthn
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    await loginFlow.navigateToStartScreen();

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(email);

    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
  });
});
