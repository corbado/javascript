import { test } from '../fixtures/BaseTest';
import { loadPasskeyList, setupNetworkBlocker, setupUser, setupVirtualAuthenticator } from './hooks';
import { ErrorTexts, ScreenNames } from '../utils/Constants';

test.describe('passkey-list component', () => {
  setupVirtualAuthenticator(test);
  setupUser(test, true, true);
  loadPasskeyList(test);

  test('list, delete, append passkey', async ({ model }) => {
    await model.passkeyList.expectPasskeys(1);
    await model.passkeyList.deletePasskey(0);
    await model.passkeyList.expectPasskeys(0);
    await model.passkeyList.appendPasskey(true);
    await model.passkeyList.expectPasskeys(1);
  });
});

test.describe('skip passkey-list component', () => {
  setupVirtualAuthenticator(test);
  setupNetworkBlocker(test);
  setupUser(test, true, true);

  test('Corbado FAPI unavailable', async ({ model }) => {
    await model.blocker.blockCorbadoFAPI();

    await model.home.gotoPasskeyList();
    await model.expectScreen(ScreenNames.PasskeyList);
    await model.expectError(ErrorTexts.PasskeyFetchFail);
  });
});
