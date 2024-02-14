import { jwtDecode } from 'jwt-decode';
import createNodeSDK from './createNodeSDK';

export default async function validateSession(shortSession: string | undefined) {
  if (!shortSession) {
    return false;
  }

  const sdk = createNodeSDK();
  const verifiedSession = await sdk.sessions().validateShortSessionValue(shortSession);

  if (!verifiedSession.isAuthenticated()) {
    return false;
  }

  const decodedShortSession = jwtDecode(shortSession);
  return !!decodedShortSession.exp && decodedShortSession.exp > Date.now() / 1000;
}
