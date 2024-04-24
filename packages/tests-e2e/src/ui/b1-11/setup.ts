import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType } from '../../utils/constants';
import { createProject } from '../../utils/helperFunctions/createProject';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

// eslint-disable-next-line no-empty-pattern
setup('set b1.11 configs', async ({}, testInfo) => {
  const projectId = await createProject('b1-11', testInfo.project.name);

  await setBackendConfigs(projectId, [
    makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
  ]);
});
