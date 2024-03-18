import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification,IdentifierType } from '../../utils/constants';
import {
  makeIdentifier,
  setBackendConfigs,
} from '../../utils/helperFunctions/setBackendConfigs';

setup('set b1.11 configs', async (/* { page } */) => {
  await setBackendConfigs([makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, [])]);
});
