import type { ChildProcess } from 'node:child_process';

import { test } from '../../fixtures/ObserveAuth';
import { LinkType } from '../../models/corbado-auth-blocks/EmailVerifyBlockModel';
import { SignupInitBlockModel } from '../../models/corbado-auth-blocks/SignupInitBlockModel';
import { AuthType, ScreenNames } from '../../utils/constants';
import { getObserveProjectId } from '../../utils/observe';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

test.describe('observe: identifier-email_link', () => {
  let projectId: string;
  let server: ChildProcess | undefined;
  let port: number;

  test.beforeAll(async () => {
    projectId = getObserveProjectId();
    ({ server, port } = await spawnPlaygroundNew(projectId));
  });

  test.afterAll(() => {
    if (server) {
      killPlaygroundNew(server);
    }
  });

  test.skip('successful (post-signup email-link) (unconfirmed_user_without_pk)', async ({ model, page }) => {
    // const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'signup-init');
    const email = SignupInitBlockModel.generateRandomEmail();
    await model.signupInit.fillEmail(email);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startManualPasskeyAppend();
    await model.expectScreen(ScreenNames.End);
    await model.logout();
    await page.waitForTimeout(1000);

    await model.emailVerify.clickEmailLink(projectId, port, email, AuthType.Login, LinkType.Correct);
    await model.expectScreen(ScreenNames.End);
  });
});
