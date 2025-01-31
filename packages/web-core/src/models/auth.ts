import type { AuthenticationRsp } from '../api/v1';
import { SessionToken } from './sessionToken';

export class AuthenticationResponse {
  shortSession: SessionToken;
  redirectURL: string;
  longSession?: string;

  constructor(shortSession: SessionToken, redirectURL: string, longSession?: string) {
    this.shortSession = shortSession;
    this.redirectURL = redirectURL;
    this.longSession = longSession;
  }

  static fromApiAuthenticationRsp(value: AuthenticationRsp): AuthenticationResponse {
    if (!value.shortSession?.value) {
      throw new Error('ShortSession is undefined. This must never happen.');
    }

    return new AuthenticationResponse(new SessionToken(value.shortSession.value), value.redirectURL, value.longSession);
  }
}
