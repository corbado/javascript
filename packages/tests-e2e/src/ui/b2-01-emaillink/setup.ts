import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

setup('set b2.1 configs', async () => {
  await setBackendConfigs([
    makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [
      IdentifierVerification.EmailLink,
    ]),
  ]);
});
