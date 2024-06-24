'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { generateRandomString } from '@/utils/random';

export async function createAccount(email: string, password: string) {
  // of course this is not secure, but it's just a demo ;)

  const randomUsername = generateRandomString(10);
  const randomForeignID = generateRandomString(10);

  cookies().set('displayName', email);
  cookies().set('identifier', randomForeignID);

  const client = new CognitoIdentityServiceProvider();
  await client
    .adminCreateUser({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
      Username: randomUsername,
      ForceAliasCreation: true,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'custom:foreignID',
          Value: randomForeignID,
        },
      ],
    })
    .promise();

  await client
    .adminSetUserPassword({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
      Username: randomUsername,
      Password: password,
    })
    .promise();

  return;
}

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
    displayName: displayName.value,
    identifier: identifier.value,
  };

  const body = JSON.stringify(payload);

  const url = `${process.env.CORBADO_BACKEND_API_URL}/v2/appendTokens`;
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
