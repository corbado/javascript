export async function canUsePasskeys(): Promise<boolean> {
  return (
    window.PublicKeyCredential &&
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  );
}

//TODO: Currently this is returning false for windows chromium browsers.
export const mediationAvailable = () => {
  return (
    window.PublicKeyCredential &&
    window.PublicKeyCredential.isConditionalMediationAvailable()
  );
};
