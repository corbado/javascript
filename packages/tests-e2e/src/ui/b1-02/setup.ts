import { test as setup } from '@playwright/test';

import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  makeIdentifier,
  setBackendConfigs,
} from '../../utils/helperFunctions/setBackendConfigs';

setup('set b1.2 configs', async (/* { page } */) => {
  await setBackendConfigs([
    makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.SmsOtp]),
  ]);
});