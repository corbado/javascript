import { expect, test } from '../../fixtures/CorbadoAuth';
import { LinkType } from '../../models/corbado-auth-blocks/EmailVerifyBlockModel';
import { SignupInitBlockModel } from '../../models/corbado-auth-blocks/SignupInitBlockModel';
import {
  AuthType,
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
} from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';

test.describe('email-verify block should obfuscate email addresses if they have not been provided by the user during login', () => {
  let projectId: string;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.None, true, [
        IdentifierVerification.EmailLink,
      ]),
      makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
    ]);
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);
  });

  test('email is obfuscated during login if the login is started with username', async ({ model, page }) => {
    await model.load(projectId, false, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    const username = SignupInitBlockModel.generateRandomUsername();
    await model.signupInit.fillEmail(email);
    await model.signupInit.fillUsername(username);
    await model.signupInit.submitPrimary();
    await model.expectScreen(ScreenNames.EmailLinkSentSignup);

    await model.emailVerify.clickEmailLink(projectId, email, AuthType.Login, LinkType.Correct);
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    await model.load(projectId, false, 'login-init');
    await model.loginInit.fillEmailUsername(username);
    await model.loginInit.submitPrimary();

    await model.expectScreen(ScreenNames.EmailLinkSentLogin);
    await expect(page.getByText(email)).toHaveCount(0);

    await model.load(projectId, false, 'login-init');
    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();

    await model.expectScreen(ScreenNames.EmailLinkSentLogin);
    await expect(page.getByText(email)).toBeVisible();
  });
});
