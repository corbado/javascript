import { test } from '../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyAppendScreen unproductive user behavior', () => {
  test('go to PasskeyBenefits', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true, false);

    await loginFlow.navigateToPasskeyAppendScreen(email);

    await page.getByText('Passkeys').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyBenefits);
  });

  test('cancelling passkey input goes to LoggedIn', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(false);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true, false);

    await loginFlow.navigateToPasskeyAppendScreen(email);

    await page.getByRole('button', { name: 'Activate' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });

  test('declining goes to LoggedIn', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true, false);

    await loginFlow.navigateToPasskeyAppendScreen(email);

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
