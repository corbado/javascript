import type { AuthenticationRsp } from '../api';
import { CookieInfo } from './cookieInfo';
import { ShortSession } from './session';

export class AuthenticationResponse {
  shortSession: ShortSession;
  redirectURL: string;
  longSession?: string;

  constructor(shortSession: ShortSession, redirectURL: string, longSession?: string) {
    this.shortSession = shortSession;
    this.redirectURL = redirectURL;
    this.longSession = longSession;
  }

  static fromApiAuthenticationRsp(value: AuthenticationRsp): AuthenticationResponse {
    if (!value.shortSession?.value) {
      throw new Error('ShortSession is undefined. This must never happen.');
    }

    const s = value.shortSession;
    const cookieInfo = new CookieInfo(s.value, s.domain, s.expires, s.path, s.sameSite, s.secure);
    const shortSession = new ShortSession(s.value, cookieInfo);

    return new AuthenticationResponse(shortSession, value.redirectURL, value.longSession);
  }
}
