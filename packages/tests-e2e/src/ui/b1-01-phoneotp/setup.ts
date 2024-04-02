import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

setup('set b1.1 configs', async () => {
  await setBackendConfigs([
    makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.None, true, [IdentifierVerification.PhoneOtp]),
  ]);
});
