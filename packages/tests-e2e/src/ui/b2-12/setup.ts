import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { createProject } from '../../utils/helperFunctions/createProject';
import {
  makeIdentifier,
  makeSocialProvider,
  setBackendConfigs,
  SocialProviderType,
} from '../../utils/helperFunctions/setBackendConfigs';

// eslint-disable-next-line no-empty-pattern
setup('set b2.12 configs', async ({}, testInfo) => {
  const projectId = await createProject('b2-12', testInfo.project.name);

  await setBackendConfigs(
    projectId,
    [
      makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.None, false, [
        IdentifierVerification.EmailOtp,
      ]),
      makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.None, false, [
        IdentifierVerification.PhoneOtp,
      ]),
    ],
    [
      makeSocialProvider(SocialProviderType.Microsoft),
      makeSocialProvider(SocialProviderType.Github),
      makeSocialProvider(SocialProviderType.Google),
    ],
  );
});
