import { test } from '../fixtures/BaseTest';
import { ScreenNames } from '../utils/Constants';
import { loadPasskeyAppend, setupUser, setupVirtualAuthenticator } from './hooks';

test.describe('append component', () => {
  setupVirtualAuthenticator(test);
  setupUser(test, true, false);
  loadPasskeyAppend(test);

  test('successful passkey append on login', async ({ model }) => {
    await model.append.appendPasskey();
    await model.expectScreen(ScreenNames.PasskeyAppended);

    await model.append.confirmAppended();
    await model.expectScreen(ScreenNames.Home);
  });
});
