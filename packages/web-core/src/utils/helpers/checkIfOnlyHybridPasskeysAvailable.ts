import type { CredentialRequestOptionsJSON } from '@github/webauthn-json';

export const checkIfOnlyHybridPasskeysAvailable = (challenge: CredentialRequestOptionsJSON) => {
  const hasOtherTypesOfPasskeys = challenge.publicKey?.allowCredentials?.some(
    credential => credential.transports && credential.transports.some(transportType => transportType !== 'hybrid'),
  );
  return !hasOtherTypesOfPasskeys;

  // allowCredentials empty: false => true
  // allowCredentials with only hybrid: false => true
};
