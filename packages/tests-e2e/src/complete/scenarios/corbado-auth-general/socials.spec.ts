import { test } from '../../fixtures/CorbadoAuth';
import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
  socialOperationTimeout,
  SocialProviderType,
  socialTotalTimeout,
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

  // Microsoft social login requires longer timeout
  test.describe.configure({ timeout: socialTotalTimeout });
  test.use({
    actionTimeout: socialOperationTimeout,
    navigationTimeout: socialOperationTimeout,
  });

  test.beforeEach(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(
      projectId,
      [
        makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.None, true, [
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

  test.afterEach(async () => {
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

  test('signup with socials should be possible (account does not exist)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    const email = process.env.PLAYWRIGHT_GOOGLE_EMAIL ?? '';
    const password = process.env.PLAYWRIGHT_GOOGLE_PASSWORD ?? '';
    const secret = process.env.PLAYWRIGHT_GOOGLE_TOTP_SECRET ?? '';

    await model.signupInit.submitSocialGoogle(email, password, secret);
    await model.expectScreen(ScreenNames.PasskeyAppend2);
  });

  test.skip('signup with social should be possible (account exists, social has been linked)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    const email = process.env.PLAYWRIGHT_GOOGLE_EMAIL ?? '';
    const password = process.env.PLAYWRIGHT_GOOGLE_PASSWORD ?? '';
    const secret = process.env.PLAYWRIGHT_GOOGLE_TOTP_SECRET ?? '';

    await model.signupInit.submitSocialGoogle(email, password, secret);
    await model.expectScreen(ScreenNames.PasskeyAppend1);
    await model.passkeyAppend.startPasskeyOperation(true);
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    await model.load(projectId, true, 'signup-init');

    await model.signupInit.resubmitSocialGoogle();
    // TODO: should successfully log in, but gets redirected to login-init instead.
    await model.expectScreen(ScreenNames.End);
  });

  // in that case only identifier based login should be possible
  test.skip('signup with social should not be possible (account exists, social has not been linked)', async ({
    model,
  }) => {
    await model.load(projectId, true, 'signup-init');

    const email = process.env.PLAYWRIGHT_GOOGLE_EMAIL ?? '';
    const password = process.env.PLAYWRIGHT_GOOGLE_PASSWORD ?? '';
    const secret = process.env.PLAYWRIGHT_GOOGLE_TOTP_SECRET ?? '';

    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(true);
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    await model.load(projectId, true, 'signup-init');

    await model.signupInit.submitSocialGoogle(email, password, secret);
    await model.expectScreen(ScreenNames.InitLogin);
  });

  test('login with social should be possible (account does not exist)', async ({ model }) => {
    // redirects to passkey append screen
    await model.load(projectId, true, 'login-init');

    const email = process.env.PLAYWRIGHT_GOOGLE_EMAIL ?? '';
    const password = process.env.PLAYWRIGHT_GOOGLE_PASSWORD ?? '';
    const secret = process.env.PLAYWRIGHT_GOOGLE_TOTP_SECRET ?? '';
    await model.loginInit.submitSocialGoogle(email, password, secret);

    await model.expectScreen(ScreenNames.PasskeyAppend2);
  });

  test('login with social should be possible (account exists, social has been linked)', async ({ model }) => {
    await model.load(projectId, true, 'signup-init');

    const email = process.env.PLAYWRIGHT_GOOGLE_EMAIL ?? '';
    const password = process.env.PLAYWRIGHT_GOOGLE_PASSWORD ?? '';
    const secret = process.env.PLAYWRIGHT_GOOGLE_TOTP_SECRET ?? '';

    await model.signupInit.submitSocialGoogle(email, password, secret);
    await model.expectScreen(ScreenNames.PasskeyAppend2);
    await model.passkeyAppend.startPasskeyOperation2(true);
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    await model.load(projectId, true, 'login-init');

    await model.signupInit.resubmitSocialGoogle();
    await model.expectScreen(ScreenNames.End);
  });

  // in that case only identifier based login should be possible
  test.skip('login with social should not be possible (account exists, social has not been linked)', async ({
    model,
  }) => {
    await model.load(projectId, true, 'signup-init');

    const email = process.env.PLAYWRIGHT_GOOGLE_EMAIL ?? '';
    const password = process.env.PLAYWRIGHT_GOOGLE_PASSWORD ?? '';
    const secret = process.env.PLAYWRIGHT_GOOGLE_TOTP_SECRET ?? '';

    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(true);
    await model.expectScreen(ScreenNames.End);
    await model.logout();

    await model.load(projectId, true, 'login-init');

    await model.signupInit.submitSocialGoogle(email, password, secret);
    // TODO: should redirect to login-init screen, but gets successfully logged in insteaad.
    await model.expectScreen(ScreenNames.InitLogin);
  });
});
