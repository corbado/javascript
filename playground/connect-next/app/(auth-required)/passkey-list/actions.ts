'use server';

import { ConnectTokenType } from '@corbado/types';
import { getCorbadoConnectToken, verifyAmplifyToken } from '@/lib/utils';

export const getCorbadoToken = async (tokenType: ConnectTokenType, idToken?: string) => {
  if (!idToken) {
    throw new Error('idToken is required');
  }

  const { displayName, identifier } = await verifyAmplifyToken(idToken);

  return getCorbadoConnectToken(tokenType, {
    displayName: displayName,
    identifier: identifier,
  });
};
