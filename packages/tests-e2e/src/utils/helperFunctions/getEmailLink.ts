import type { BrowserContext } from '@playwright/test';

import type { AuthType } from '../constants';
import { emailLinkUrlToken } from '../constants';

export async function getEmailLink(context: BrowserContext, email: string, authType: AuthType) {
  console.log("origins: ", (await context.storageState()).origins);
  const cboAuthProcessRaw = (await context.storageState()).origins
    .find(origin => origin.origin.replace(/\/$/, '') === process.env.PLAYWRIGHT_TEST_URL?.replace(/\/$/, ''))
    ?.localStorage.find(item => item.name === 'cbo_auth_process')?.value;
  if (!cboAuthProcessRaw) {
    throw new Error('getCboAuthProcess: cbo_auth_process not found in local storage');
  }
  const cboAuthProcess = JSON.parse(cboAuthProcessRaw);

  const urlBlock = {
    blockData: {
      alternativeVerificationMethods: null,
      identifier: email,
      retryNotBefore: 1711650294,
      verificationMethod: 'email-link',
    },
    authType: authType,
    process: {
      id: cboAuthProcess.id,
      expires: cboAuthProcess.expires,
      frontendApiUrl: cboAuthProcess.frontendApiUrl,
    },
  };
  console.log(JSON.stringify(urlBlock));

  return `${process.env.PLAYWRIGHT_TEST_URL}/${process.env.PLAYWRIGHT_PROJECT_ID}/auth?corbadoEmailLinkID=${btoa(
    JSON.stringify(urlBlock),
  )}&corbadoToken=${emailLinkUrlToken}`;
}
