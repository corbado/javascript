import type {AuthenticationRsp} from '../api';
import {ShortSession} from "../types";

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

    return new AuthenticationResponse(new ShortSession(value.shortSession.value), value.redirectURL, value.longSession);
  }
}
