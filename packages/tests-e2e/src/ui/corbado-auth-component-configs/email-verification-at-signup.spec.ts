import { test } from '../../fixtures/CorbadoAuth';
import { OtpCodeType } from '../../models/corbado-auth-blocks/EmailVerifyBlockModel';
import { SignupInitBlockModel } from '../../models/corbado-auth-blocks/SignupInitBlockModel';
import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
} from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';

// this is the default component config that we offer
test.describe('tests that focus on these identifiers: email (verification at signup)', () => {
  let projectId: string;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [
        IdentifierVerification.EmailOtp,
      ]),
    ]);
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);
  });

  test('signup with passkey (happy path)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(true);
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await model.expectScreen(ScreenNames.End);
    await model.logout();

    await model.passkeyVerify.performAutomaticPasskeyVerification(() => model.loginInit.submitPasskeyButton());
    await model.expectScreen(ScreenNames.End);
  });

  test('signup with passkey (one passkey retry)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(false);
    await model.expectScreen(ScreenNames.PasskeyError);

    await model.passkeyAppend.retryPasskeyOperation(true);

    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await model.expectScreen(ScreenNames.End);
  });

  test('signup with explicit fallback', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.navigateFallbackEmail();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await model.expectScreen(ScreenNames.End);
    await model.logout();

    // no passkey is available => we expect an emailVerify block
    await model.load(projectId, undefined, 'login-init');
    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);
    await model.passkeyAppend.skip();
    await model.expectScreen(ScreenNames.End);
  });

  // the difference to the previous test is that passkeys are not supported
  // during signup, the fallback is initiated automatically (user does not have to click on the fallback button)
  // during login, we don't ask the user to append a passkey
  test('signup with fallback (passkeys not available)', async ({ model }) => {
    await model.load(projectId, false, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await model.expectScreen(ScreenNames.End);
    await model.logout();

    // no passkey is available => we expect an emailVerify block
    await model.load(projectId, undefined, 'login-init');
    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await model.expectScreen(ScreenNames.End);
  });
});
