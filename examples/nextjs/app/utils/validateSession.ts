import { jwtDecode } from 'jwt-decode';
import createNodeSDK from './createNodeSDK';

export default async function validateSession(sessionToken: string | undefined) {
  if (!sessionToken) {
    return false;
  }

  const sdk = createNodeSDK();
  const verifiedSession = await sdk.sessions().validateShortSessionValue(sessionToken);

  if (!verifiedSession.isAuthenticated()) {
    return false;
  }

  const decodedSessionToken = jwtDecode(sessionToken);
  return !!decodedSessionToken.exp && decodedSessionToken.exp > Date.now() / 1000;
}
