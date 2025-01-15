import { expect, test } from '../fixtures/BaseTest';
import { ErrorTexts, ScreenNames } from '../utils/Constants';
import { loadPasskeyList, setupNetworkBlocker, setupUser, setupVirtualAuthenticator } from './hooks';

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
});
