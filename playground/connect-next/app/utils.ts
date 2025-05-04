import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { GetUserCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const jwksUrl = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
const client = jwksClient({ jwksUri: jwksUrl });

export type DecodedToken = {
  username: string;
};

export type TokenWrapper = {
  AccessToken: string;
};

const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
};

export const verifyToken = async (token: string): Promise<DecodedToken> => {
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

export const getUserEmail = async (token: string): Promise<string | undefined> => {
  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new GetUserCommand({
    AccessToken: token,
  });

  const response = await client.send(command);

  return response.UserAttributes?.find(attr => attr.Name === 'email')?.Value;
};
