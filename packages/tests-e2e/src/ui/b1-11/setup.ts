import { test as setup } from '@playwright/test';

import {
  IdentifierEnforceVerification,
  IdentifierType,
  makeIdentifier,
  setBackendConfigs,
} from '../../utils/helperFunctions/setBackendConfigs';

setup('set b1.11 configs', async (/* { page } */) => {
  await setBackendConfigs('pro-8125835201872404154', [
    makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
  ]);
});
