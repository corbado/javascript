'use server';

import { cookies } from 'next/headers';
import { ConnectTokenType } from '@corbado/types';
import { getCorbadoConnectToken, verifyAmplifyToken } from '@/lib/utils';

export const getCorbadoToken = async (tokenType: ConnectTokenType) => {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('idToken');
  if (!idToken) {
    throw new Error('idToken is required');
  }

  const { displayName, identifier } = await verifyAmplifyToken(idToken.value);

  return getCorbadoConnectToken(tokenType, {
    displayName: displayName,
    identifier: identifier,
  });
};
