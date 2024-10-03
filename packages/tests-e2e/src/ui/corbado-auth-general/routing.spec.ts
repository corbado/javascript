import { test } from '../../fixtures/CorbadoAuth';
import { SignupInitBlockModel } from '../../models/corbado-auth-blocks/SignupInitBlockModel';
import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
} from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';

test.describe('routing', () => {
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

  test('initial routing should happen depending on the hashCode (signup-init)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    await model.expectScreen(ScreenNames.InitSignup);
  });

  test('initial routing should happen depending on the hashCode (login-init)', async ({ model }) => {
    await model.load(projectId, true, 'login-init');

    await model.expectScreen(ScreenNames.InitLogin);
  });

  test('initial routing should happen depending on local storage', async ({ model }) => {
    await model.load(projectId, true);

    // by default the signup screen is loaded
    await model.expectScreen(ScreenNames.InitSignup);

    await model.signupInit.fillEmail(SignupInitBlockModel.generateRandomEmail());
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(true);
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    // after logout the login screen should be loaded because we now have state in localstorage
    await model.expectScreen(ScreenNames.InitLogin);
    await model.loginInit.expectPasskeyButton(true);
  });
});
