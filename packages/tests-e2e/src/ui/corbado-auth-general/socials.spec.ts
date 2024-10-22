import { test } from '../../fixtures/CorbadoAuth';
import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
  SocialProviderType,
} from '../../utils/constants';
import {
  createProjectNew,
  deleteProjectNew,
  makeIdentifier,
  makeSocialProvider,
  setComponentConfig,
} from '../../utils/developerpanel';

test.describe('social logins', () => {
  let projectId: string;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(
      projectId,
      [
        makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [
          IdentifierVerification.EmailOtp,
        ]),
      ],
      [
        makeSocialProvider(SocialProviderType.Microsoft),
        makeSocialProvider(SocialProviderType.Github),
        makeSocialProvider(SocialProviderType.Google),
      ],
    );
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);
  });

  test('socials should be rendered on UI component if they are activated', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    // by default the signup screen is loaded
    await model.expectScreen(ScreenNames.InitSignup);
    await model.signupInit.navigateToLogin();
    await model.signupInit.expectSocialButton(
      SocialProviderType.Google,
      SocialProviderType.Microsoft,
      SocialProviderType.Github,
    );

    await model.expectScreen(ScreenNames.InitLogin);
    await model.loginInit.expectSocialButton(
      SocialProviderType.Google,
      SocialProviderType.Microsoft,
      SocialProviderType.Github,
    );
  });

  // this covers signup + login
  test.skip('signup with socials should be possible (account does not exist)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    await model.signupInit.submitSocialMicrosoft();

    await model.expectScreen(ScreenNames.End);
    await model.logout();
  });

  test.skip('signup with social should be possible (account exists, social has been linked)', async () => {
    // redirects to end screen (logged in)
  });

  // in that case only identifier based login should be possible
  test.skip('signup with social should not be possible (account exists, social has not been linked)', async () => {
    // redirects to login screen
  });

  test.skip('login with social should be possible (account does not exist)', async () => {
    // redirects to passkey append screen
  });

  test.skip('login with social should be possible (account exists, social has been linked)', async () => {
    // redirects to end screen (logged in)
  });

  // in that case only identifier based login should be possible
  test.skip('login with social should not be possible (account exists, social has not been linked)', async () => {
    // TODO: it's possible for some reason (logged in)
  });
});
