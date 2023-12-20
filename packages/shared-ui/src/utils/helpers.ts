import { UAParser } from 'ua-parser-js';

export function getParsedUA(ua: string) {
  const { browser, os } = UAParser(ua);
  return { browser, os };
}
