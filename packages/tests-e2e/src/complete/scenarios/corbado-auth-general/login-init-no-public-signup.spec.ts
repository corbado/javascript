import type { ChildProcess } from 'node:child_process';

import { expect, test } from '../../fixtures/CorbadoAuth';
import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  ScreenNames,
} from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

// Developers can disable public signup
// In that case UI components no longer will allow a signup
test.describe('login-init no public signup', () => {
  let projectId: string;
  let server: ChildProcess;
  let port: number;

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

    ({ server, port } = await spawnPlaygroundNew(projectId));
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);

    killPlaygroundNew(server);
  });

  test('switch to signup should not be possible (button)', async ({ model, page }) => {
    await model.load(projectId, port, true, 'login-init');

    await model.expectScreen(ScreenNames.InitLogin);
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeHidden();
  });

  test('switch to signup should not be possible (hashCode)', async ({ model }) => {
    await model.load(projectId, port, true, 'signup-init');

    await model.expectScreen(ScreenNames.InitLogin);
  });
});
