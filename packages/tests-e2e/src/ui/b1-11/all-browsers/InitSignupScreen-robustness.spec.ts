import { expect, test } from '../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../utils/constants';
import UserManager from '../../../utils/UserManager';

test.describe('InitSignupScreen unproductive user behavior', () => {
  test('without passkey support', async ({ loginFlow, page }) => {
    await loginFlow.checkLandedOnScreen(ScreenNames.InitSignup);

    const id = UserManager.getUserForSignup();
    const username = id.replace('+', '-');

    await page.getByRole('textbox', { name: 'username' }).click();
    await page.getByRole('textbox', { name: 'username' }).fill(username);
    await expect(page.getByRole('textbox', { name: 'username' })).toHaveValue(username);

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('We encountered an issue. Please try again later or contact support.')).toBeVisible();
  });
});
