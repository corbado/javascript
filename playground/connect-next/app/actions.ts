'use server';

import { cookies } from 'next/headers';
import { getUserEmail, verifyToken } from '@/app/utils';

export async function getAppendToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token || !token.value) {
    return null;
  }

  const decoded = await verifyToken(token.value);
  const email = await getUserEmail(token.value);
  if (!email) {
    return null;
  }

  const identifier = decoded.username;
  console.log(email, identifier);

  // call backend API to get token
  const payload = {
    type: 'passkey-append',
    data: {
      displayName: email,
      identifier: identifier,
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

  return out.secret;
}
