const LOCALHOST_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]'];

/**
 * Returns true if the hostname is a local development host for which we allow the
 * insecure http: scheme. Everything else must be https:.
 */
const isLocalhost = (hostname: string): boolean => LOCALHOST_HOSTNAMES.includes(hostname);

/**
 * Validates a URL that will be used as a navigation target (e.g. an OAuth redirect
 * assigned to window.location.href).
 *
 * Only https: is permitted, with an explicit http: exception for localhost during
 * development.
 */
export const isSafeRedirectUrl = (rawUrl: string): boolean => {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }

  if (url.protocol === 'https:') {
    return true;
  }

  if (url.protocol === 'http:' && isLocalhost(url.hostname)) {
    return true;
  }

  return false;
};

/**
 * Validates that a frontend API base URL is an acceptable origin.
 *
 * Only https: origins are allowed, with an http: exception for localhost during
 * development.
 */
export const isSafeFrontendApiUrl = (rawUrl: string): boolean => isSafeRedirectUrl(rawUrl);

/**
 * Compares two URLs by origin. Returns false if either value is not a parseable URL.
 */
export const haveSameOrigin = (a: string, b: string): boolean => {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
};
