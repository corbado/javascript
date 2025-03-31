'use server';

import { cookies } from 'next/headers';
import {
  CognitoIdentityProviderClient,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';
import { verifyToken } from '@/app/utils';
import { TOTP } from 'totp-generator';

function createSecretHash(username: string, clientId: string, clientSecret: string) {
  return crypto
    .createHmac('sha256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

export async function startMFASoftwareToken(totp: string) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('mfa_session');
    const displayName = cookieStore.get('displayName');

    if (!totp || !session || !displayName) {
      throw new Error('Missing required fields.');
    }

    const client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const challengeResponseCommand = new RespondToAuthChallengeCommand({
      ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
      ChallengeName: 'SOFTWARE_TOKEN_MFA',
      Session: session.value,
      ChallengeResponses: {
        USERNAME: displayName.value,
        SOFTWARE_TOKEN_MFA_CODE: totp,
        SECRET_HASH: createSecretHash(
          displayName.value,
          process.env.AWS_COGNITO_CLIENT_ID!,
          process.env.AWS_COGNITO_CLIENT_SECRET!,
        ),
      },
    });

    const mfaResult = await client.send(challengeResponseCommand);
    console.log('MFA login complete', mfaResult);

    if (mfaResult.AuthenticationResult?.AccessToken) {
      // no MFA has been set up yet

      const decoded = await verifyToken(mfaResult.AuthenticationResult.AccessToken);
      if (decoded.username) {
        return { success: true };
      }

      return { success: false, message: 'An error occurred. Please try again later.' };
    }

    return { success: true, screen: 'MFA_SOFTWARE_TOKEN' };
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'NotAuthorizedException') return { success: false, message: 'Incorrect username or password.' };

      return { success: false, message: err.message };
    }

    return { success: false, message: 'An error occurred. Please try again later.' };
  }
}

export async function generateTOTP() {
  const cookieStore = await cookies();
  const secretCode = cookieStore.get('secretCode');
  if (!secretCode) {
    return {
      success: false,
      message: 'Secret code not found. Autofill only works as long as the cookie set during signup is still there.',
    };
  }

  const { otp } = TOTP.generate(secretCode.value!);

  return { success: true, otp };
}
