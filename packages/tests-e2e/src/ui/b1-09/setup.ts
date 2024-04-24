import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { createProject } from '../../utils/helperFunctions/createProject';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

// eslint-disable-next-line no-empty-pattern
setup('set b1.9 configs', async ({}, testInfo) => {
  const projectId = await createProject('b1-01-phoneotp', testInfo.project.name);

  await setBackendConfigs(projectId, [
    makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, false, [
      IdentifierVerification.EmailOtp,
    ]),
    makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.Signup, false, [
      IdentifierVerification.PhoneOtp,
    ]),
    makeIdentifier(IdentifierType.Social, IdentifierEnforceVerification.None, false, []),
  ]);
});
