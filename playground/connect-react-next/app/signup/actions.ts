'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function createAccount(email: string) {
  cookies().set('email', email);
}

export async function getAppendToken() {
  const email = cookies().get('email');
  if (!email) {
    return null;
  }

  // hash the email
  const emailHash = crypto.createHash('md5').update(email.value).digest('hex');

  // call backend API to get token
  const payload = {
    displayName: email.value,
    identifier: emailHash,
  };

  const body = JSON.stringify(payload);

  const url = 'https://api.corbado-dev.com/v2/appendTokens';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic cHJvLTI6Y29yYmFkbzFfd0NQaFJLSE5pNTM1bmJNeXM3OFR2YVdMV0U4R0pN`,
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: body,
  });

  const out = await response.json();
  console.log(out);

  return out.secret;
}
