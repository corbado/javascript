import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

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
