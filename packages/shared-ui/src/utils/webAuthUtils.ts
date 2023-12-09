export async function canUsePasskeys(): Promise<boolean> {
  return window.PublicKeyCredential && window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}
