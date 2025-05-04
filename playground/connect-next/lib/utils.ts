import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

type TokenData = {
  displayName: string;
  identifier: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID!,
});

export const verifyAmplifyToken = async (idToken: string): Promise<TokenData> => {
  const verifiedToken = await verifier.verify(idToken);
  const displayName: string = verifiedToken.email as string;
  const identifier = verifiedToken['cognito:username'];

  return { displayName, identifier };
};

export type CognitoUserInfo = {
  username: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
};

export const getCognitoUserInfo = async (): Promise<CognitoUserInfo> => {
  const user = await getCurrentUser();
  const attributes = await fetchUserAttributes();

  return {
    username: user.username,
    email: attributes.email,
    phoneNumber: attributes.phone_number,
    emailVerified: attributes.email_verified === 'true',
  } as CognitoUserInfo;
};

export const getCorbadoConnectToken = async (connectTokenType: string, connectTokenData: any): Promise<string> => {
  const payload = {
    type: connectTokenType,
    data: connectTokenData,
  };

  const body = JSON.stringify(payload);

  const url = `${process.env.CORBADO_BACKEND_API_URL}/v2/connectTokens`;
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

  return out.secret;
};
