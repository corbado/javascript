import type { AuthenticationRsp } from '../api/v1';
import { SessionToken } from './sessionToken';

export class AuthenticationResponse {
  sessionToken: SessionToken;
  redirectURL: string;
  refreshToken?: string;

  constructor(sessionToken: SessionToken, redirectURL: string, refreshToken?: string) {
    this.sessionToken = sessionToken;
    this.redirectURL = redirectURL;
    this.refreshToken = refreshToken;
  }

  static fromApiAuthenticationRsp(value: AuthenticationRsp): AuthenticationResponse {
    if (!value.shortSession?.value) {
      throw new Error('ShortSession is undefined. This must never happen.');
    }

    return new AuthenticationResponse(new SessionToken(value.shortSession.value), value.redirectURL, value.longSession);
  }
}
