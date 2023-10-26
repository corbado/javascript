export async function canUsePasskeys(): Promise<boolean> {
  if (window.PublicKeyCredential) {
    const available =
      await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  }
  return false;
}
