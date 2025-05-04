'use server';

import { AppendStatus, ConnectTokenType } from '@corbado/types';
import { cookies } from 'next/headers';
import { getCorbadoConnectToken, verifyAmplifyToken } from '@/lib/utils';

export const getCorbadoToken = async () => {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('idToken');
  if (!idToken) {
    throw new Error('idToken is required');
  }

  const { displayName, identifier } = await verifyAmplifyToken(idToken.value);

  return getCorbadoConnectToken('passkey-append' as ConnectTokenType, {
    displayName: displayName,
    identifier: identifier,
  });
};

export async function postPasskeyAppend(appendStatus: AppendStatus, clientState: string) {
  // update client side state
  console.log(appendStatus);
  if (appendStatus === 'complete' || appendStatus === 'complete-noop') {
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'cbo_client_state',
      value: clientState,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });
  }
}
