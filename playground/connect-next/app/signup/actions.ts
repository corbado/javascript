'use server';

import { cookies } from 'next/headers';
import { generateRandomString } from '@/utils/random';
import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserMFAPreferenceCommand,
  AdminSetUserPasswordCommand,
  AssociateSoftwareTokenCommand,
  CognitoIdentityProviderClient,
  VerifySoftwareTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { TOTP } from 'totp-generator';
import CryptoJS from 'crypto-js';

const cognitoUserPoolId = process.env.AWS_COGNITO_USER_POOL_ID!;
const cognitoClientId = process.env.AWS_COGNITO_CLIENT_ID!;
const cognitoClientSecret = process.env.AWS_COGNITO_CLIENT_SECRET!;
const awsRegion = process.env.AWS_REGION!;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

export const createAccount = async (email: string, phone: string, password: string) => {
  // of course this is not secure, but it's just a demo ;)

  const randomUsername = generateRandomString(10);

  cookies().set('displayName', email);
  cookies().set('identifier', randomUsername);

  // create client that loads profile from ~/.aws/credentials or environment variables
  const client = new CognitoIdentityProviderClient({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const command = new AdminCreateUserCommand({
    UserPoolId: cognitoUserPoolId,
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
    UserPoolId: cognitoUserPoolId,
    Username: randomUsername,
    Password: password,
    Permanent: true,
  });

  await client.send(passwordCommand);

  const initiateAuthCommand = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    ClientId: cognitoClientId,
    UserPoolId: cognitoUserPoolId,
    AuthParameters: {
      USERNAME: randomUsername,
      PASSWORD: password,
      SECRET_HASH: await createSecretHash(randomUsername, cognitoClientId, cognitoClientSecret),
    },
  });

  const initiateAuthRes = await client.send(initiateAuthCommand);

  const associateSoftwareTokenCommand = new AssociateSoftwareTokenCommand({
    Session: initiateAuthRes.Session,
    AccessToken: initiateAuthRes.AuthenticationResult?.AccessToken,
  });

  const associateSoftwareTokenRes = await client.send(associateSoftwareTokenCommand);
  console.log('associateSoftwareTokenRes', associateSoftwareTokenRes);

  cookies().set('secretCode', associateSoftwareTokenRes.SecretCode!);

  const { otp } = TOTP.generate(associateSoftwareTokenRes.SecretCode!);
  console.log('otp', otp);
  const verifySoftwareTokenCommand = new VerifySoftwareTokenCommand({
    Session: initiateAuthRes.Session,
    AccessToken: initiateAuthRes.AuthenticationResult?.AccessToken,
    UserCode: otp,
  });

  const verifySoftwareTokenRes = await client.send(verifySoftwareTokenCommand);
  console.log('verifySoftwareTokenRes', verifySoftwareTokenRes);

  const setMfaPreferenceCommand = new AdminSetUserMFAPreferenceCommand({
    UserPoolId: cognitoUserPoolId,
    Username: randomUsername,
    SoftwareTokenMfaSettings: {
      Enabled: true,
      PreferredMfa: true,
    },
  });
  const setMfaPreferenceCommandRes = await client.send(setMfaPreferenceCommand);
  console.log('setMfaPreferenceCommandRes', setMfaPreferenceCommandRes);

  return;
};

const createSecretHash = async (username: string, clientId: string, clientSecret: string) => {
  const hmac = CryptoJS.HmacSHA256(username + clientId, clientSecret);
  return hmac.toString(CryptoJS.enc.Base64);
};
