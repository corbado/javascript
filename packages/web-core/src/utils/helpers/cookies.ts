import type { CookiesDefinition, IAuthResponse } from '../../types';

export const dropCookie = (cookieDef: CookiesDefinition) => {
  let cookieString = `${encodeURIComponent(
    cookieDef.name,
  )}=${encodeURIComponent(cookieDef.value)}`;

  if (cookieDef.path) {
    cookieString += `; path=${cookieDef.path}`;
  }
  if (cookieDef.expires) {
    const expiryDate = new Date(cookieDef.expires as number | string);
    cookieString += `; expires=${expiryDate.toUTCString()}`;
  }
  if (cookieDef.secure) {
    cookieString += `; secure`;
  }
  if (cookieDef.sameSite) {
    cookieString += `; samesite=${cookieDef.sameSite}`;
  }
  if (cookieDef.domain) {
    cookieString += `; domain=${cookieDef.domain}`;
  }

  document.cookie = cookieString;
};

export const shortCookie = (rsp: IAuthResponse) => {
  if (rsp.shortSession) {
    dropCookie(rsp.shortSession);
  }
};

export const getCookieValue = (a: string) => {
  const b = document.cookie.match(
    '(^|;)\\s*' + encodeURIComponent(a) + '\\s*=\\s*([^;]+)',
  );
  return b ? decodeURIComponent(b.pop() as string) : '';
};
