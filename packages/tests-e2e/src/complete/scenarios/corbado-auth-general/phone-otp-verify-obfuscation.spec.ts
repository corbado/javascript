import { expect, test } from '../../fixtures/CorbadoAuth';
import { OtpCodeType } from '../../models/corbado-auth-blocks/PhoneVerifyBlockModel';
import { SignupInitBlockModel } from '../../models/corbado-auth-blocks/SignupInitBlockModel';
import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
} from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';

test.describe('phone-verify block should obfuscate phone numbers if they have not been provided by the user during login', () => {
  let projectId: string;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.None, true, [IdentifierVerification.PhoneOtp]),
      makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
    ]);
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);
  });

  test('phone number is obfuscated during login if the login is started with username', async ({ model, page }) => {
    await model.load(projectId, false, 'signup-init');

    const phone = SignupInitBlockModel.generateRandomPhone();
    const username = SignupInitBlockModel.generateRandomUsername();
    await model.signupInit.fillPhone(phone);
    await model.signupInit.fillUsername(username);
    await model.signupInit.submitPrimary();
    await model.phoneVerify.fillOtpCode(OtpCodeType.Correct);
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    await model.load(projectId, false, 'login-init');
    await model.loginInit.fillEmailUsername(username);
    await model.loginInit.submitPrimary();

    await model.expectScreen(ScreenNames.PhoneOtpLogin);
    await expect(page.getByText(phone)).toHaveCount(0);

    await model.load(projectId, false, 'login-init');
    await model.loginInit.switchToInputPhone();
    await model.loginInit.fillPhone(phone);
    await model.loginInit.submitPrimary();

    await model.expectScreen(ScreenNames.PhoneOtpLogin);

    // we can't check the full phone number because white spaces are added
    await expect(page.getByText('+1 650 555')).toBeVisible();
  });
});
