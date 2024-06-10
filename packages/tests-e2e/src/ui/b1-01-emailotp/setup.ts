import { test as setup } from '../../fixtures/UISignupTest';
import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { createProject } from '../../utils/helperFunctions/createProject';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

// eslint-disable-next-line no-empty-pattern
setup('set b1.1 configs', async ({}, testInfo) => {
  const projectId = await createProject('b1-01-emailotp', testInfo.project.name);

  await setBackendConfigs(projectId, [
    makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.None, true, [IdentifierVerification.EmailOtp]),
  ]);
});
