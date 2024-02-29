import log from 'loglevel';

export class CookieInfo {
  value: string;
  domain: string;
  expires: string;
  path: string;
  sameSite: string;
  secure: boolean;

  constructor(value: string, domain: string, expires: string, path: string, sameSite: string, secure: boolean) {
    this.value = value;
    this.domain = domain;
    this.expires = expires;
    this.path = path;
    this.sameSite = sameSite;
    this.secure = secure;
  }

  toCookie(key: string): string {
    const out = `${key}=${this.value}; path=${this.path}; expires=${this.expires}; domain=${this.domain}; secure=${this.secure}; samesite=${this.sameSite}`;
    log.info('setting cookie', out);

    return out;
  }
}
