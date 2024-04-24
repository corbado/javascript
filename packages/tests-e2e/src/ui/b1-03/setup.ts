import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { createProject } from '../../utils/helperFunctions/createProject';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

// eslint-disable-next-line no-empty-pattern
setup('set b1.3 configs', async ({}, testInfo) => {
  const projectId = await createProject('b1-03', testInfo.project.name);

  await setBackendConfigs(projectId, [
    makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
    makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.EmailOtp]),
    makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.PhoneOtp]),
  ]);
});
