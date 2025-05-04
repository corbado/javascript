'use server';

import { cookies } from 'next/headers';
import { ConnectTokenType } from '@corbado/types';
import { verifyToken } from '@/app/utils';

export async function getCorbadoToken(tokenType: ConnectTokenType) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token || !token.value) {
    return null;
  }

  const decoded = await verifyToken(token.value);
  console.log('validatedToken', token.value, decoded);

  // call backend API to get token
  const payload = {
    type: tokenType,
    data: {
      identifier: decoded.username,
    },
  };

  const body = JSON.stringify(payload);

  const url = `${process.env.CORBADO_BACKEND_API_URL}/v2/connectTokens`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.CORBADO_BACKEND_API_BASIC_AUTH}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: body,
  });

  const out = await response.json();
  console.log(out);

  return out.secret;
}
