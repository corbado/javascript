import { test } from '../../fixtures/CorbadoAuth';
import { SignupInitBlockModel } from '../../models/corbado-auth-blocks/SignupInitBlockModel';
import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';

test.describe('signup-init', () => {
  let projectId: string;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.None, true, [IdentifierVerification.EmailOtp]),
      makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.None, true, [IdentifierVerification.PhoneOtp]),
      makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
    ]);
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);
  });

  test('bad user input: all fields empty', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    await model.signupInit.fillEmail('');
    await model.signupInit.fillPhone('');
    await model.signupInit.fillUsername('');
    await model.signupInit.submitPrimary();

    await model.signupInit.expectErrorMissingUsername();
    await model.signupInit.expectErrorMissingEmail();
    await model.signupInit.expectErrorMissingPhoneNumber();
  });

  test('bad user input: invalid fields (simple)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    await model.signupInit.fillEmail('asdf@asdf');
    await model.signupInit.fillPhone('1234');
    await model.signupInit.fillUsername('@');
    await model.signupInit.submitPrimary();

    await model.signupInit.expectErrorInvalidUsername();
    await model.signupInit.expectErrorInvalidEmail();
    await model.signupInit.expectErrorInvalidPhoneNumber();
  });

  test('bad user input: duplicate fields', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    const email = SignupInitBlockModel.generateRandomEmail();
    const phone = SignupInitBlockModel.generateRandomPhone();
    const username = SignupInitBlockModel.generateRandomUsername();

    await model.signupInit.fillEmail(email);
    await model.signupInit.fillPhone(phone);
    await model.signupInit.fillUsername(username);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(true);

    await model.logout();
    await model.load(projectId, undefined, 'signup-init');

    await model.signupInit.fillEmail(email);
    await model.signupInit.fillPhone(phone);
    await model.signupInit.fillUsername(username);
    await model.signupInit.submitPrimary();

    await model.signupInit.expectErrorDuplicateUsername();
    await model.signupInit.expectErrorDuplicatePhone();
    await model.signupInit.expectErrorDuplicateEmail();
  });
});
