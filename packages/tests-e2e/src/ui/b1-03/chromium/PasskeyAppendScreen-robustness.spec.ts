import { expect, test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyAppendScreen unproductive user behavior', () => {
  test('modify email identifier', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    let [, email] = await signupFlow.fillIdentifiers(true, true, true);
    email = email ?? '';
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);
    await expect(page.getByText(email)).toBeVisible();

    await page.getByAltText('edit-icon').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailEdit);
    await expect(page.getByRole('textbox')).toHaveValue(email);

    const newEmail = `${email.split('@')[0]}a@${email.split('@')[1]}`;
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill(newEmail);
    await expect(page.getByRole('textbox')).toHaveValue(newEmail);

    await page.getByRole('button', { name: 'Confirm' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);
    await expect(page.getByText(newEmail)).toBeVisible();
  });

  // TODO: add tests for redirecting to specific identifier verification (not email, just phone)
});
