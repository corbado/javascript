'use server';

import { cookies } from 'next/headers';
import { generateRandomString } from '@/utils/random';
import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export async function createAccount(email: string, phone: string, password: string) {
  // of course this is not secure, but it's just a demo ;)

  const randomUsername = generateRandomString(10);

  cookies().set('displayName', email);
  cookies().set('identifier', randomUsername);

  // create client that loads profile from ~/.aws/credentials or environment variables
  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new AdminCreateUserCommand({
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
        Name: 'phone_number',
        Value: phone,
      },
    ],
  });

  await client.send(command);

  const passwordCommand = new AdminSetUserPasswordCommand({
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    Username: randomUsername,
    Password: password,
    Permanent: true,
  });

  await client.send(passwordCommand);

  return;
}
