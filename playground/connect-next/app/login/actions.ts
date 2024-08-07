'use server';

import { cookies } from 'next/headers';
import { AdminGetUserCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

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

// Try to log in the user to Cognito (not implemented yet)
export async function postConventionalLogin(email: string, password: string) {}
