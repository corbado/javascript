'use server';

import { cookies } from 'next/headers';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';
import { TokenWrapper, verifyToken } from '@/app/utils'; // Here we validate the JWT token (validation is too simple, don't use this in production)

// Here we validate the JWT token (validation is too simple, don't use this in production)
// Then we extract the cognitoID and retrieve the user's email from the user pool
// Both values will then be set as a cookie
export async function postPasskeyLogin(session: string) {
  const cookieStore = await cookies();
  const tokenWrapper = JSON.parse(session) as TokenWrapper;
  await verifyToken(tokenWrapper.AccessToken);
  cookieStore.set('token', tokenWrapper.AccessToken);

  return;
}

export async function postPasskeyLoginNew(signedPasskeyData: string, clientState: string) {
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

  await postPasskeyLogin(out.session);

  // update client side state
  const cookieStore = await cookies();
  cookieStore.set({ name: 'cbo_client_state', value: clientState, httpOnly: true });
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

    const cookieStore = await cookies();
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

      await verifyToken(response.AuthenticationResult.AccessToken);
      cookieStore.set({ name: 'token', value: response.AuthenticationResult.AccessToken, httpOnly: true });

      return { success: true };
    }

    if (response.Session && response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
      cookieStore.set('mfa_session', response.Session);

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
