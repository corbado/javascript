import type { BrowserContext } from '@playwright/test';

import type { AuthType } from '../constants';
import { emailLinkUrlToken } from '../constants';

export async function getEmailLink(context: BrowserContext, email: string, authType: AuthType) {
  const cboAuthProcess = (await context.storageState()).origins
    .find(origin => origin.origin === process.env.PLAYWRIGHT_TEST_URL)
    ?.localStorage.find(item => item.name === 'cbo_auth_process')?.value;
  if (!cboAuthProcess) {
    throw new Error('getCboAuthProcess: cbo_auth_process not found in local storage');
  }

  const urlBlock = {
    blockData: {
      alternativeVerificationMethods: null,
      identifier: email,
      retryNotBefore: 1711650294,
      verificationMethod: 'email-link',
    },
    authType: authType,
    processID: JSON.parse(cboAuthProcess).id,
  };
  console.log(JSON.stringify(urlBlock));

  return `${process.env.PLAYWRIGHT_TEST_URL}/${process.env.PLAYWRIGHT_PROJECT_ID}/auth?corbadoEmailLinkID=${btoa(
    JSON.stringify(urlBlock),
  )}&corbadoToken=${emailLinkUrlToken}`;
}
