import { test } from '../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyBenefitsScreen unproductive user behavior', () => {
  test('declining goes to LoggedIn', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true, false);

    await loginFlow.navigateToPasskeyBenefitsScreen(email);

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
