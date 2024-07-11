'use server';

import { cookies } from 'next/headers';
import { CorbadoTokens } from '@corbado/types';

export async function getCorbadoToken(tokenType: CorbadoTokens) {
  const identifier = cookies().get('identifier');
  if (!identifier) {
    return null;
  }

  // call backend API to get token
  const payload = {
    type: tokenType,
    data: {
      identifier: identifier.value,
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
