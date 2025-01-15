import { test } from '../fixtures/BaseTest';
import { ErrorTexts, password, ScreenNames } from '../utils/Constants';
import { loadInvitationToken, setupNetworkBlocker, setupUser, setupVirtualAuthenticator } from './hooks';

test.describe('login component (without invitation token)', () => {
  setupUser(test, false);

  test('successful login with credentials', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginFallback);

    await model.login.submitFallbackCredentials(model.email, password);
    await model.expectScreen(ScreenNames.Home);
  });
});

test.describe('login component (with invitation token, without passkeys)', () => {
  setupVirtualAuthenticator(test);
  setupUser(test, true, false);

  test('successful login with credentials', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, false);
    await model.expectScreen(ScreenNames.InitLoginFallback);

    await model.login.submitFallbackCredentials(model.email, password, true);
    await model.expectScreen(ScreenNames.PasskeyAppend);

    await model.append.skipAppend();
    await model.expectScreen(ScreenNames.Home);
  });
});

test.describe('login component (with invitation token, with passkeys)', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, true);

  test('successful login with passkey', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.login.removePasskeyButton();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, true);
    await model.expectScreen(ScreenNames.Home);
  });

  test('successful login with passkey (conditional UI)', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.login.submitConditionalUI(async () => {
      await model.login.removePasskeyButton();
      await model.expectScreen(ScreenNames.InitLogin);
    });
    await model.expectScreen(ScreenNames.Home);
  });

  test('successful login with passkey (one-tap)', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.login.submitPasskeyButton(true);
    await model.expectScreen(ScreenNames.Home);
  });

  test('attempt login with repeated failed passkey input', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.login.submitPasskeyButton(false);
    await model.login.repeatedlyFailPasskeyInput();
  });

  test('inaccessible passkey on login', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.authenticator.clearCredentials();
    await model.clearLocalStorageAndCookies();
    await model.loadInvitationToken();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, false);
    await model.expectScreen(ScreenNames.InitLoginFallback);
  });

  test('Corbado FAPI unavailable after authentication', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.blocker.blockCorbadoFAPIFinishEndpoint();

    await model.login.submitPasskeyButton(true);
    await model.expectScreen(ScreenNames.InitLoginFallback);
  });

  test.skip('passkey signature validation fails', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.authenticator.clearCredentials();
    await model.authenticator.addDummyCredential();
    await model.login.removePasskeyButton();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, true);
    await model.expectScreen(ScreenNames.InitLoginFallback);
  });

  test('attempt login with server-side deleted passkey', async ({ model }) => {
    await model.home.gotoPasskeyList();
    await model.expectScreen(ScreenNames.PasskeyList);

    await model.passkeyList.expectPasskeys(1);
    await model.passkeyList.deletePasskey(0);
    await model.passkeyList.expectPasskeys(0);

    await model.loadHome();
    await model.expectScreen(ScreenNames.Home);

    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, false);
    await model.expectScreen(ScreenNames.InitLoginFallback);
  });
});

test.describe('login component (without user)', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  loadInvitationToken(test);

  test('attempt login with incomplete credentials', async ({ model }) => {
    await model.loadLogin();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail('', false);
    await model.expectError(ErrorTexts.EmptyEmail);
  });

  test('attempt login with unknown credentials', async ({ model }) => {
    await model.loadLogin();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail('unknown-email@corbado.com', false);
    await model.expectError(ErrorTexts.UnknownEmail);
  });

  test('Corbado FAPI unavailable', async ({ model }) => {
    await model.blocker.blockCorbadoFAPI();

    await model.loadLogin();
    await model.expectScreen(ScreenNames.InitLoginFallback);
  });
});
