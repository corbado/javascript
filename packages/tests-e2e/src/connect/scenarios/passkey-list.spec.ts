import { test } from '../fixtures/BaseTest';
import { loadPasskeyList, setupUser, setupVirtualAuthenticator } from './hooks';

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
