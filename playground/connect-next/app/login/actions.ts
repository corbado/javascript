'use server';

import { cookies } from 'next/headers';
import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import crypto from 'crypto';

const jwksUrl = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
const client = jwksClient({ jwksUri: jwksUrl });

type DecodedToken = {
  username: string;
};

const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
};

const verifyToken = async (token: string): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      const typed = decoded as DecodedToken;

      resolve(typed);
    });
  });
};

// Here we validate the JWT token (validation is too simple, don't use this in production)
// Then we extract the cognitoID and retrieve the user's email from the user pool
// Both values will then be set as a cookie
export async function postPasskeyLogin(session: string) {
  // validate session
  try {
    const decoded = await verifyToken(session);
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
    console.log(email);

    if (email) {
      cookies().set('displayName', email);
      cookies().set('identifier', username);
    }

    return;
  } catch (err) {
    console.error('Token is invalid:', err);
    return;
  }
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

    let challengeResponse = response;

    if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
        ChallengeName: response.ChallengeName,
        ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: password,
          SECRET_HASH: createSecretHash(
            email,
            process.env.AWS_COGNITO_CLIENT_ID!,
            process.env.AWS_COGNITO_CLIENT_SECRET!,
          ),
        },
        Session: response.Session,
      });

      challengeResponse = await client.send(respondToAuthChallengeCommand);
    }

    if (!challengeResponse.AuthenticationResult?.AccessToken) {
      throw new Error('Authentication failed. Please check your credentials and try again.');
    }

    const decoded = await verifyToken(challengeResponse.AuthenticationResult.AccessToken);
    const username = decoded.username;

    if (email) {
      cookies().set('displayName', email);
      cookies().set('identifier', username);
    }

    return;
  } catch (err) {
    if (err instanceof Error) {
      switch (err.name) {
        case 'NotAuthorizedException':
          throw new Error('Incorrect username or password.');
        case 'UserNotConfirmedException':
          throw new Error('User is not confirmed. Please check your email for a confirmation link.');
        case 'PasswordResetRequiredException':
          throw new Error('Password reset required. Please reset your password to continue.');
        default:
          throw err;
      }
    } else {
      throw new Error('An unknown error occurred during login.');
    }
  }
}
