'use server';

import { getCorbadoConnectToken, verifyAmplifyToken } from '@/lib/utils';

export const getConnectToken = async (connectTokenType: string, idToken?: string) => {
  if (!idToken) {
    throw new Error('idToken is required');
  }

  const { displayName, identifier } = await verifyAmplifyToken(idToken);

  return getCorbadoConnectToken(connectTokenType, {
    displayName: displayName,
    identifier: identifier,
  });
};
