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

test.describe('tests that focus on these identifiers: email (verification at signup) + username', () => {
  let projectId: string;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [
        IdentifierVerification.EmailOtp,
      ]),
      makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
    ]);
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);
  });

  test('signup with passkey (happy path)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    const username = SignupInitBlockModel.generateRandomUsername();
    await model.signupInit.fillEmail(email);
    await model.signupInit.fillUsername(username);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(true);
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);
    await model.expectScreen(ScreenNames.End);

    await model.logout();

    // we first try login with email
    await model.loginInit.removePasskeyButton();
    await model.loginInit.fillEmailUsername(email);
    await model.passkeyVerify.performAutomaticPasskeyVerification(() => model.loginInit.submitPrimary());
    await model.expectScreen(ScreenNames.End);

    await model.logout();

    // we then try login with username
    await model.loginInit.removePasskeyButton();
    await model.loginInit.fillEmailUsername(username);
    await model.passkeyVerify.performAutomaticPasskeyVerification(() => model.loginInit.submitPrimary());
    await model.expectScreen(ScreenNames.End);
  });
});
