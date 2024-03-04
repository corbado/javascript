import { test as setup } from '@playwright/test';

import {
  IdentifierEnforceVerification,
  IdentifierType,
  IdentifierVerification,
  makeIdentifier,
  setBackendConfigs,
} from '../../utils/helperFunctions/setBackendConfigs';

setup('set b1.3 configs', async (/* { page } */) => {
  await setBackendConfigs('pro-8125835201872404154', [
    makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
    makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.EmailOtp]),
    makeIdentifier(IdentifierType.Phone, IdentifierEnforceVerification.Signup, true, [IdentifierVerification.SmsOtp]),
  ]);
});
