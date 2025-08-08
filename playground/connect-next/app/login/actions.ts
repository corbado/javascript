'use server';

import { cookies } from 'next/headers';
import { TOTP } from 'totp-generator';

export async function postPasskeyLogin(clientState: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'cbo_client_state',
    value: clientState,
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  });
}

export async function autoFillTOTP() {
  const cookieStore = await cookies();
  const maybeSecretCode = cookieStore.get('secretCode');
  if (!maybeSecretCode) {
    return;
  }

  const { otp } = TOTP.generate(maybeSecretCode.value);

  return otp;
}
