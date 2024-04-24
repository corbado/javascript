import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { createProject } from '../../utils/helperFunctions/createProject';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

// eslint-disable-next-line no-empty-pattern
setup('set b2.1 configs', async ({}, testInfo) => {
  const projectId = await createProject('b2-01-phoneotp', testInfo.project.name);

  await setBackendConfigs(projectId, [
    makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.PhoneOtp]),
  ]);
});
