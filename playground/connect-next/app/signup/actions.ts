'use server';

import { cookies } from 'next/headers';
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
