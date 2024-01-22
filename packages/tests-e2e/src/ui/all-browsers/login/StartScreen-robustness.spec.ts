import { expect,test } from '../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('StartScreen unproductive user behavior', () => {
  test('with unregistered email', async ({ loginFlow, page }) => {
    await loginFlow.navigateToStartPage(false, false);

    const unregisteredEmail = 'unregistered_wtf@corbado.com';

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(unregisteredEmail);

    await page.getByRole('button', { name: 'Continue' }).click();

    await loginFlow.checkLandedOnScreen(ScreenNames.Start);
    await expect(page.getByText('User does not exist')).toBeVisible();
  });
});