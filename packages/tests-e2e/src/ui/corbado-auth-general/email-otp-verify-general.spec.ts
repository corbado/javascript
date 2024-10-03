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

// Here we test everything on LoginInit screen
test.describe('general email-verify functionalities', () => {
  let projectId: string;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.None, true, [IdentifierVerification.EmailOtp]),
    ]);
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);
  });

  test('signup with fallback (one retry)', async ({ model }) => {
    await model.load(projectId, false, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();

    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.expectErrorWrongCode();

    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await model.expectScreen(ScreenNames.End);
  });

  test('signup with fallback + identifier change', async ({ model }) => {
    await model.load(projectId, false, 'signup-init');

    const email1 = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email1);
    await model.signupInit.submitPrimary();

    await model.emailVerify.navigateToEditIdentifier();
    await model.expectScreen(ScreenNames.EmailEdit);
    const email2 = SignupInitBlockModel.generateRandomEmail();
    await model.emailVerify.fillNewEmail(email2);
    await model.emailVerify.submitNewEmail();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await model.expectScreen(ScreenNames.End);
    await model.logout();

    // only login with email2 should be possible
    await model.load(projectId, false, 'login-init');
    await model.loginInit.fillEmailUsername(email1);
    await model.loginInit.submitPrimary();
    await model.loginInit.expectTextError("Couldn't find your account.");

    await model.loginInit.fillEmailUsername(email2);
    await model.loginInit.submitPrimary();
    await model.expectScreen(ScreenNames.EmailOtpLogin);
  });

  test('signup with fallback + identifier change (abort + continue with email 1)', async ({ model }) => {
    await model.load(projectId, false, 'signup-init');

    const email1 = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email1);
    await model.signupInit.submitPrimary();

    await model.emailVerify.navigateToEditIdentifier();
    await model.expectScreen(ScreenNames.EmailEdit);
    const email2 = SignupInitBlockModel.generateRandomEmail();
    await model.emailVerify.fillNewEmail(email2);
    await model.emailVerify.abortNewEmail();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await model.expectScreen(ScreenNames.End);
    await model.logout();

    // only login with email1 should be possible
    await model.load(projectId, false, 'login-init');
    await model.loginInit.fillEmailUsername(email2);
    await model.loginInit.submitPrimary();
    await model.loginInit.expectTextError("Couldn't find your account.");

    await model.loginInit.fillEmailUsername(email1);
    await model.loginInit.submitPrimary();
    await model.expectScreen(ScreenNames.EmailOtpLogin);
  });

  // here we first generate an account with email 1
  // then we start a new process and signup with email 2
  // during verification we try to switch back to email 1 => this must fail
  test('signup with fallback + identifier change (email already exists)', async ({ model }) => {
    await model.load(projectId, false, 'signup-init');

    const email1 = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email1);
    await model.signupInit.submitPrimary();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    await model.load(projectId, false, 'signup-init');

    const email2 = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email2);
    await model.signupInit.submitPrimary();
    await model.emailVerify.navigateToEditIdentifier();
    await model.expectScreen(ScreenNames.EmailEdit);
    await model.emailVerify.fillNewEmail(email1);
    await model.emailVerify.submitNewEmail();
    await model.emailVerify.expectErrorExistingEmail();
  });

  // TODO: fix
  test.skip('signup with explicit fallback (too many wrong codes)', async ({ model }) => {
    await model.load(projectId, false, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();

    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);

    await model.expectError('Too many attempts. Please try again later.');
  });
});
