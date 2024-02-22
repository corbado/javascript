import { test as setup } from '@playwright/test';

import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification, makeIdentifier, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

setup('set b1.1 configs', async (/* { page } */) => {
  // Get project ID
  // await page.goto('/');
  // const projectId = new URL(page.url()).pathname.split('/').filter(segment => segment !== '')[0];

  await setBackendConfigs('pro-8125835201872404154', [
    makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.None, false, [IdentifierVerification.EmailOtp]),
  ]);
})
