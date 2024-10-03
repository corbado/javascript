import { expect, test } from '../../fixtures/CorbadoAuth';
import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
} from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';

// Developers can disable public signup
// In that case UI components no longer will allow a signup
test.describe('login-init no public signup', () => {
  let projectId: string;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(
      projectId,
      [
        makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.None, true, [
          IdentifierVerification.EmailOtp,
        ]),
      ],
      [],
      false,
      false,
    );
  });

  test.afterAll(async () => deleteProjectNew(projectId));

  test('switch to signup should not be possible (button)', async ({ model, page }) => {
    await model.load(projectId, true, 'login-init');

    await model.expectScreen(ScreenNames.InitLogin);
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeHidden();
  });

  test('switch to signup should not be possible (hashCode)', async ({ model, page }) => {
    await model.load(projectId, true, 'signup-init');

    await model.expectScreen(ScreenNames.InitLogin);
  });
});
