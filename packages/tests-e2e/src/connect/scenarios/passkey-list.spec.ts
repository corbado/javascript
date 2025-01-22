import { expect, test } from '../fixtures/BaseTest';
import { ErrorTexts, ScreenNames, WebhookTypes } from '../utils/Constants';
import { loadPasskeyList, setupNetworkBlocker, setupUser, setupVirtualAuthenticator, setupWebhooks } from './hooks';

test.describe('passkey-list component', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, false);
  loadPasskeyList(test);

  test('list, delete, create passkey', async ({ model }) => {
    await model.passkeyList.expectPasskeys(0);
    await model.passkeyList.createPasskey(true);
    await model.passkeyList.expectPasskeys(1);
    await model.passkeyList.deletePasskey(0);
    await model.passkeyList.expectPasskeys(0);
  });

  test('abort passkey creation', async ({ model }) => {
    await model.passkeyList.expectPasskeys(0);
    await model.passkeyList.createPasskey(false);
    await model.passkeyList.expectPasskeys(0);
  });

  test('Connect Token endpoint unavailable during passkey creation', async ({ model }) => {
    await model.passkeyList.expectPasskeys(0);

    await model.blocker.blockCorbadoConnectTokenEndpoint();

    await model.page.getByRole('button', { name: 'Add a passkey' }).click();
    await model.expectError(ErrorTexts.PasskeyCreateFail);
    await model.passkeyList.expectPasskeys(0);
  });

  test('Corbado FAPI unavailable during passkey creation', async ({ model }) => {
    await model.passkeyList.expectPasskeys(0);

    await model.blocker.blockCorbadoFAPI();

    await model.page.getByRole('button', { name: 'Add a passkey' }).click();
    await model.expectError(ErrorTexts.PasskeyCreateFail);
    await model.passkeyList.expectPasskeys(0);
  });

  test('passkey already registered', async ({ model }) => {
    await model.passkeyList.expectPasskeys(0);
    await model.passkeyList.createPasskey(true);
    await model.passkeyList.expectPasskeys(1);

    await model.passkeyList.createPasskey(true, () =>
      expect(model.page.getByRole('heading', { name: 'No passkey created' })).toBeVisible(),
    );
    await expect(model.page.getByText('No passkey created')).toBeVisible();

    await model.passkeyList.confirmModal();
    await model.passkeyList.expectPasskeys(1);
  });

  test('Connect Token endpoint unavailable during passkey deletion', async ({ model }) => {
    await model.passkeyList.expectPasskeys(0);
    await model.passkeyList.createPasskey(true);
    await model.passkeyList.expectPasskeys(1);

    await model.blocker.blockCorbadoConnectTokenEndpoint();

    await model.passkeyList.deletePasskey(0);
    await model.expectError(ErrorTexts.PasskeyDeleteFail);
    await model.passkeyList.expectPasskeys(1);
  });

  test('Corbado FAPI unavailable during passkey deletion', async ({ model }) => {
    await model.passkeyList.expectPasskeys(0);
    await model.passkeyList.createPasskey(true);
    await model.passkeyList.expectPasskeys(1);

    await model.blocker.blockCorbadoFAPI();

    await model.passkeyList.deletePasskey(0);
    await model.expectError(ErrorTexts.PasskeyDeleteFail);
    await model.passkeyList.expectPasskeys(1);
  });
});

test.describe('passkey-list component (webhook)', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, false);
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

test.describe('skip passkey-list component', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, true);

  test('Connect Token endpoint unavailable', async ({ model }) => {
    await model.blocker.blockCorbadoConnectTokenEndpoint();

    await model.home.gotoPasskeyList();
    await model.expectScreen(ScreenNames.PasskeyList);
    await model.expectError(ErrorTexts.PasskeyFetchFail);
  });

  test('Corbado FAPI unavailable', async ({ model }) => {
    await model.blocker.blockCorbadoFAPI();

    await model.home.gotoPasskeyList();
    await model.expectScreen(ScreenNames.PasskeyList);
    await model.expectError(ErrorTexts.PasskeyFetchFail);
  });

  test('expired manage lifetime leads to skipped passkey-list screen', async ({ model }) => {
    await model.home.gotoPasskeyList();
    await model.expectScreen(ScreenNames.PasskeyList);
    await model.passkeyList.expectPasskeys(1);
    await model.loadHome();
    await model.expectScreen(ScreenNames.Home);
    expect(await model.storage.getManageLifetime()).toBeGreaterThan(Math.floor(Date.now() / 1000));

    await model.storage.setManageLifetime(Math.floor(Date.now() / 1000) - 1);
    await model.storage.deleteInvitationToken();

    await model.home.gotoPasskeyList();
    await model.expectScreen(ScreenNames.PasskeyList);
    await model.passkeyList.expectPasskeys(1);
    await model.passkeyList.checkCreatePasskeyDisabled();
  });
});
