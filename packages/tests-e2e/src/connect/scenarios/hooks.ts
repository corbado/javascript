import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from '@playwright/test';

import type { BaseModel } from '../models/BaseModel';
import { ScreenNames } from '../utils/Constants';

export function setupVirtualAuthenticator(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.addWebAuthn();
  });

  test.afterEach(async ({ model }) => {
    await model.removeWebAuthn();
  });
}

// export function loadInvitationToken(
//   test: TestType<
//     PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
//     PlaywrightWorkerArgs & PlaywrightWorkerOptions
//   >,
// ) {
//   test.beforeEach(async ({ model }) => {
//     await model.loadInvitationToken();
//   });
// }

export function loadSignup(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.loadSignup();
  });
}

export function loadLogin(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.loadLogin();
  });
}

export function setupUser(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >, invited = true, append = true,
) {
  test.beforeEach(async ({ model }) => {
    if (invited) {
      await model.loadInvitationToken();
    }
    await model.loadSignup();
    await model.expectScreen(ScreenNames.InitSignup);
    await model.createUser(invited, append);
    await model.expectScreen(ScreenNames.Home);
  });

  // test.afterEach(async ({ model }) => {
  //   await model.deleteUser();
  // });
}
