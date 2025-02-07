import { expect } from '@playwright/test';

import { test } from '../fixtures/BaseTest';
import { ErrorTexts, password, ScreenNames, WebhookTypes } from '../utils/Constants';
import { loadInvitationToken, setupNetworkBlocker, setupUser, setupVirtualAuthenticator, setupWebhooks } from './hooks';

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

  test('Corbado FAPI unavailable after authentication', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.blocker.blockCorbadoFAPIFinishEndpoint();

    await model.login.submitPasskeyButton(true);
    await model.expectScreen(ScreenNames.InitLoginFallback);
  });

  test('passkey signature validation fails', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.authenticator.clearCredentials();
    await model.authenticator.addDummyCredential();

    await model.login.submitConditionalUI(async () => {
      await model.login.removePasskeyButton();
    });
    await model.expectScreen(ScreenNames.InitLoginFallback);
    await model.expectError(ErrorTexts.PasskeySignatureValidationFail);
  });

  test('attempt login with server-side deleted passkey', async ({ model }) => {
    await model.home.gotoPasskeyList();
    await model.expectScreen(ScreenNames.PasskeyList);

    await model.passkeyList.expectPasskeys(1);
    await model.passkeyList.deletePasskey(0);
    await model.passkeyList.expectPasskeys(0);

    await model.loadHome();
    await model.expectScreen(ScreenNames.Home);

    await model.login.submitConditionalUI(async () => {
      await model.home.logout();
    });
    await model.expectScreen(ScreenNames.InitLoginFallback);
    await model.expectError(ErrorTexts.DeletedPasskeyUsed);
  });

  // TODO: unskip when loginData reset feature is fixed
  test.skip('successful login deletes loginData', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.login.removePasskeyButton();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, true);
    await model.expectScreen(ScreenNames.Home);
    await model.storage.checkLoginDataDeleted();
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
    // It seems that the InitLogin page is now cached so that email needs to be submitted before reaching the InitLoginFallback screen.
    await model.login.submitEmail('dummy-email@corbado.com', false);
    await model.expectScreen(ScreenNames.InitLoginFallback);
  });

  test('invitation token and process id persists after page refresh', async ({ model }) => {
    await model.expectScreen(ScreenNames.InitLogin);
    await model.storage.checkInvitationToken();
    const processId = await model.storage.getProcessID();

    await model.loadLogin();
    await model.expectScreen(ScreenNames.InitLogin);
    await model.storage.checkInvitationToken();
    await model.storage.checkProcessID(processId);
  });

  test('expired login lifetime leads to fallback screen', async ({ model }) => {
    await model.expectScreen(ScreenNames.InitLogin);
    expect(await model.storage.getLoginLifetime()).toBeGreaterThan(Math.floor(Date.now() / 1000));

    await model.storage.setLoginLifetime(Math.floor(Date.now() / 1000) - 1);
    await model.storage.deleteInvitationToken();
    await model.loadLogin();
    await model.expectScreen(ScreenNames.InitLoginFallback);
  });
});

test.describe('login component (webhook)', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, true);
  setupWebhooks(test, [WebhookTypes.Login]);

  test('successful login with passkey (+ webhook)', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLoginOneTap);

    await model.login.removePasskeyButton();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, true);
    await model.expectScreen(ScreenNames.Home);

    model.webhook.expectWebhookRequest(WebhookTypes.Login);
  });
});
