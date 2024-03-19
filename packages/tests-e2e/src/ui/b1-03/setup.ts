import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

setup('set b1.3 configs', async (/* { page } */) => {
  await setBackendConfigs([
    makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
    makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.EmailOtp]),
    makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.PhoneOtp]),
  ]);
});
