import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

setup('set b1.2 configs', async (/* { page } */) => {
  await setBackendConfigs([
    makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.EmailOtp]),
  ]);
});
