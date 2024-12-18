import { test } from '../fixtures/BaseTest';
import { ScreenNames } from '../utils/Constants';
import { setupUser, setupVirtualAuthenticator } from './hooks';

test.describe('login component', () => {
  setupVirtualAuthenticator(test);
  setupUser(test);

  test('successful login with passkey', async ({ model }) => {
    await model.expectScreen(ScreenNames.Home);
  });
});
