'use server';

import { cookies } from 'next/headers';

export async function getAppendToken() {
  const displayName = cookies().get('displayName');
  if (!displayName) {
    return null;
  }

  const identifier = cookies().get('identifier');
  if (!identifier) {
    return null;
  }

  console.log(displayName, identifier);

  // call backend API to get token
  const payload = {
    type: 'passkey-append',
    data: {
      displayName: displayName.value,
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

export async function hello() {
  return 'Hello, World!';
}

export async function hello2() {
  return 'Hello, World2!';
}
