import { test } from '../fixtures/BaseTest';
import { password, ScreenNames } from '../utils/Constants';
import { loadPasskeyAppend, setupNetworkBlocker, setupUser, setupVirtualAuthenticator } from './hooks';

test.describe('append component', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, false);
  loadPasskeyAppend(test);

  test('successful passkey append on login', async ({ model }) => {
    await model.append.appendPasskey(true);
    await model.expectScreen(ScreenNames.PasskeyAppended);

    await model.append.confirmAppended();
    await model.expectScreen(ScreenNames.Home);
  });

  test('failed passkey append on login', async ({ model }) => {
    await model.append.appendPasskey(false);
  });

  test('Corbado FAPI unavailable after authentication', async ({ model }) => {
    await model.blocker.blockCorbadoFAPIFinishEndpoint();

    await model.append.appendPasskey(true);
    await model.expectScreen(ScreenNames.Home);
  });
});

test.describe('skip append component', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, false);

  test('Corbado BAPI unavailable', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, false);
    await model.expectScreen(ScreenNames.InitLoginFallback);

    await model.blocker.blockCorbadoBAPI();

    await model.login.submitFallbackCredentials(model.email, password, true);
    await model.expectScreen(ScreenNames.Home);
  });

  test('Corbado FAPI unavailable', async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, false);
    await model.expectScreen(ScreenNames.InitLoginFallback);

    await model.blocker.blockCorbadoFAPI();

    await model.login.submitFallbackCredentials(model.email, password, true);
    await model.expectScreen(ScreenNames.Home);
  });
});
