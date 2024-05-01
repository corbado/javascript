import { test } from '../../../fixtures/UISignupTest';
import { AuthType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with email link proper user behavior', () => {
  test('with passkey support', async ({ signupFlow, page, context }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    let [, email] = await signupFlow.fillIdentifiers(false, true, false);
    email = email ?? '';
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByText('Email verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailLinkSentSignup, email);

    const emailLink = await signupFlow.getEmailLink(context, email, AuthType.Signup);

    const newPage = await context.newPage();
    await newPage.goto(emailLink);

    await signupFlow.checkLandedOnScreen(ScreenNames.EmailLinkSuccessSignup);
    await page.close();
    page = signupFlow.page = newPage;

    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await page.getByText('Maybe later').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
