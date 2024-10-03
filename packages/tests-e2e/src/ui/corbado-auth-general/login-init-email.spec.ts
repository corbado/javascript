import { test } from '../../fixtures/CorbadoAuth';
import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
} from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';

// Here we test everything on LoginInit screen
test.describe('login-init', () => {
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

  test('bad user input: empty email', async ({ model }) => {
    await model.load(projectId, true, 'login-init');

    await model.loginInit.fillEmailUsername('');
    await model.loginInit.submitPrimary();
    await model.loginInit.expectTextError("Couldn't find your account.");
  });

  // TODO: fix and enable
  test.skip('bad user input: invalid email', async ({ model }) => {
    await model.load(projectId, true, 'login-init');

    await model.loginInit.fillEmailUsername('a@a');
    await model.loginInit.submitPrimary();
    await model.loginInit.expectTextError('Please enter a valid email address.');
  });

  test('bad user input: non-existing email', async ({ model }) => {
    await model.load(projectId, true, 'login-init');

    await model.loginInit.fillEmailUsername('user-does-not-exist@corbado.com');
    await model.loginInit.submitPrimary();
    await model.loginInit.expectTextError("Couldn't find your account.");
  });

  // TODO: bad user input: empty phone
  // TODO: bad user input: invalid phone
  // TODO: bad user input: non-existing phone

  test('switch to signup', async ({ model }) => {
    await model.load(projectId, true, 'login-init');

    await model.expectScreen(ScreenNames.InitLogin);
    await model.loginInit.navigateToSignup();
    await model.expectScreen(ScreenNames.InitSignup);
  });

  // after a signup with passkey a passkey button should be shown
  // the button should disappear after when one explicitly switches the identifier
  test('passkey button should be shown', async ({ model }) => {
    await model.load(projectId, true);

    await model.defaultSignupWithPasskey();

    // after a signup with passkey a passkey button should be shown => we use it to login
    await model.expectScreen(ScreenNames.InitLogin);
    await model.loginInit.expectPasskeyButton(true);

    await model.load(projectId);
    await model.loginInit.expectPasskeyButton(true);

    await model.passkeyVerify.performAutomaticPasskeyVerification(() => model.loginInit.submitPasskeyButton());
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    // the passkey button should still be shown => we now explicitly switch the identifier
    await model.loginInit.expectPasskeyButton(true);
    await model.loginInit.removePasskeyButton();
    await model.loginInit.expectPasskeyButton(false);
  });

  // after a signup without passkey no passkey button should be shown
  test('passkey button should not be shown', async ({ model }) => {
    await model.load(projectId, true);

    await model.defaultSignupWithFallback();
    await model.load(projectId, undefined, 'login-init');

    // after a signup with passkey a passkey button should be shown => we use it to login
    await model.expectScreen(ScreenNames.InitLogin);
    await model.loginInit.expectPasskeyButton(false);
  });
});
