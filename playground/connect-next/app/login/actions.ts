'use server';

import { cookies } from 'next/headers';
import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';
import { TokenWrapper, verifyToken } from '@/app/utils';

// Here we validate the JWT token (validation is too simple, don't use this in production)
// Then we extract the cognitoID and retrieve the user's email from the user pool
// Both values will then be set as a cookie
export async function postPasskeyLogin(session: string) {
  const tokenWrapper = JSON.parse(session) as TokenWrapper;
  const decoded = await verifyToken(tokenWrapper.AccessToken);
  const username = decoded.username;

  // create client that loads profile from ~/.aws/credentials or environment variables
  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new AdminGetUserCommand({
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    Username: username,
  });

  const response = await client.send(command);

  const email = response.UserAttributes?.find(attr => attr.Name === 'email')?.Value;
  if (email) {
    cookies().set('displayName', email);
    cookies().set('identifier', username);
  }

  return;
}

export async function postPasskeyLoginNew(signedPasskeyData: string) {
  const url = `${process.env.CORBADO_BACKEND_API_URL}/v2/passkey/postLogin`;
  const body = JSON.stringify({
    signedPasskeyData: signedPasskeyData,
  });

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

  await postPasskeyLogin(out.session);
}

function createSecretHash(username: string, clientId: string, clientSecret: string) {
  return crypto
    .createHmac('sha256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

export async function startConventionalLogin(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    cookies().set('displayName', email);

    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: createSecretHash(
          email,
          process.env.AWS_COGNITO_CLIENT_ID!,
          process.env.AWS_COGNITO_CLIENT_SECRET!,
        ),
      },
    });

    const response = await client.send(command);
    console.log(response);

    if (response.AuthenticationResult?.AccessToken) {
      // no MFA has been set up yet

      const decoded = await verifyToken(response.AuthenticationResult.AccessToken);
      const username = decoded.username;
      if (email) {
        cookies().set('identifier', username);
      }

      return { success: true };
    }

    if (response.Session && response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
      cookies().set('mfa_session', response.Session);

      return { success: true, screen: 'MFA_SOFTWARE_TOKEN' };
    }

    return { success: false, message: 'An error occurred. Please try again later.' };
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'NotAuthorizedException') return { success: false, message: 'Incorrect username or password.' };

      return { success: false, message: err.message };
    }

    return { success: false, message: 'An error occurred. Please try again later.' };
  }
}
