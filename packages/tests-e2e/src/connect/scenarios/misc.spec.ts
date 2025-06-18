import type { ChildProcess } from 'node:child_process';

import { test } from '../fixtures/BaseTest';
import { ScreenNames, WebhookTypes } from '../utils/Constants';
import { killPlaygroundNew, spawnPlaygroundNew } from '../utils/Playground';
import {
  loadBeforePasskeyAppend,
  loadPasskeyList,
  setupNetworkBlocker,
  setupUser,
  setupVirtualAuthenticator,
  setupWebhooks,
} from './hooks';

test.describe.serial('webhook tests', () => {
  test.describe('login component (webhook)', () => {
    let server: ChildProcess;
    let port: number;

    test.beforeAll(async () => {
      ({ server, port } = await spawnPlaygroundNew());
    });

    test.afterAll(() => {
      killPlaygroundNew(server);
    });

    setupVirtualAuthenticator(test);
    setupNetworkBlocker(test);
    setupUser(test, () => port, true, true);
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

  test.describe('append component (webhook)', () => {
    let server: ChildProcess;
    let port: number;

    test.beforeAll(async () => {
      ({ server, port } = await spawnPlaygroundNew());
    });

    test.afterAll(() => {
      killPlaygroundNew(server);
    });

    setupVirtualAuthenticator(test);
    setupNetworkBlocker(test);
    setupUser(test, () => port, true, false);
    loadBeforePasskeyAppend(test);
    setupWebhooks(test, [WebhookTypes.Create]);

    test('successful passkey append on login (+ webhook)', async ({ model }) => {
      await model.mfa.submit(true, true);
      await model.expectScreen(ScreenNames.PasskeyAppended);

      await model.append.confirmAppended();
      await model.expectScreen(ScreenNames.Home);

      model.webhook.expectWebhookRequest(WebhookTypes.Create);
    });
  });

  test.describe('passkey-list component (webhook)', () => {
    let server: ChildProcess;
    let port: number;

    test.beforeAll(async () => {
      ({ server, port } = await spawnPlaygroundNew());
    });

    test.afterAll(() => {
      killPlaygroundNew(server);
    });

    setupVirtualAuthenticator(test);
    setupNetworkBlocker(test);
    setupUser(test, () => port, true, false);
    loadPasskeyList(test);
    setupWebhooks(test, [WebhookTypes.Create, WebhookTypes.Delete]);

    test('list, delete, create passkey (+ webhook)', async ({ model }) => {
      await model.passkeyList.expectPasskeys(0);
      await model.passkeyList.createPasskey(true);
      await model.passkeyList.expectPasskeys(1);
      model.webhook.expectWebhookRequest(WebhookTypes.Create);

      await model.passkeyList.deletePasskey(0);
      await model.passkeyList.expectPasskeys(0);
      model.webhook.expectWebhookRequest(WebhookTypes.Delete);
    });
  });
});
