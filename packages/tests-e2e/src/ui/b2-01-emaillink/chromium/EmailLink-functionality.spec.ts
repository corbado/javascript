import { expect, test } from '../../../fixtures/UILoginTest';
import { AuthType, IdentifierType, IdentifierVerification, ScreenNames } from '../../../utils/constants';

test.describe('Login with email link proper user behavior', () => {
  test('fallback without appending passkey', async ({ loginFlow, page, context }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn();
    await loginFlow.loadAuth();

    let [, email] = await loginFlow.createAccount(
      [IdentifierType.Email],
      [IdentifierVerification.EmailLink],
      true,
      false,
      context,
    );
    email = email ?? '';
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(email);
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.EmailLinkSentLogin, email);

    const emailLink = await loginFlow.getEmailLink(context, email, AuthType.Login);

    const newPage = await context.newPage();
    await newPage.goto(emailLink);

    await loginFlow.checkLandedOnScreen(ScreenNames.EmailLinkSuccessLogin);
    await page.close();
    page = newPage;
    loginFlow.setPage(page);

    await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await page.getByText('Maybe later').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
