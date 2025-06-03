import { expect } from '@playwright/test';

import { test } from '../fixtures/BaseTest';
import { password, ScreenNames } from '../utils/Constants';
import {
  loadBeforePasskeyAppend,
  setupNetworkBlocker,
  setupUser,
  setupVirtualAuthenticator,
} from './hooks';

test.describe('append component', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, false);
  loadBeforePasskeyAppend(test);

  test('successful passkey append on login', async ({ model }) => {
    // await model.append.appendPasskey(true);
    await model.mfa.autoAppendPasskey(true);
    await model.expectScreen(ScreenNames.PasskeyAppended);

    await model.append.confirmAppended();
    await model.expectScreen(ScreenNames.Home);
  });

  test('failed passkey append on login', async ({ model }) => {
    // await model.append.appendPasskey(false);
    await model.mfa.autoAppendPasskey(false);
  });

  test('Corbado FAPI unavailable after authentication', async ({ model }) => {
    await model.blocker.blockCorbadoFAPIFinishEndpoint();

    // await model.append.appendPasskey(true);
    await model.mfa.autoAppendPasskey(true);
    await model.expectScreen(ScreenNames.Home);
  });
});

test.describe('skip append component', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, false);

  test('Corbado FAPI unavailable', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, false);
    await model.expectScreen(ScreenNames.InitLoginFallback);

    await model.blocker.blockCorbadoFAPI();

    await model.login.submitFallbackCredentials(model.email, password, true);
    await model.expectScreen(ScreenNames.MFA);

    await model.mfa.autofillTOTP();
    await model.mfa.submit();

    await model.expectScreen(ScreenNames.Home);
  });

  test('expired append lifetime leads to skipped append screen', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, false);
    await model.expectScreen(ScreenNames.InitLoginFallback);
    expect(await model.storage.getAppendLifetime()).toBeGreaterThan(Math.floor(Date.now() / 1000));

    await model.storage.setAppendLifetime(Math.floor(Date.now() / 1000) - 1);
    await model.storage.deleteInvitationToken();
    await model.login.submitFallbackCredentials(model.email, password, true);
    await model.expectScreen(ScreenNames.MFA);

    await model.mfa.autofillTOTP();
    await model.mfa.submit();
    await model.expectScreen(ScreenNames.Home);
  });
});
