export async function canUsePasskeys(): Promise<boolean> {
  return (
    window.PublicKeyCredential &&
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  );
}

export const mediationAvailable = () => {
  return (
    window.PublicKeyCredential &&
    window.PublicKeyCredential.isConditionalMediationAvailable()
  );
};
