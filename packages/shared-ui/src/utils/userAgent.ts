import type { IDevice, IOS } from 'ua-parser-js';
import { UAParser } from 'ua-parser-js';

export enum PlatformType {
  Apple = 'apple',
  Android = 'android',
  Windows = 'windows',
}

export function getUserAgent() {
  const { browser, os, device } = UAParser(navigator.userAgent);
  return { browser, os, device };
}

export function isUserAgentWindows(userAgentOS: IOS): boolean {
  //Windows 10 and 11 are the only versions that support WebAuthn
  return (
    (userAgentOS.name === 'Windows' && userAgentOS.version && /^1[01]$/.test(userAgentOS.version)) ||
    userAgentOS.name === 'Windows Phone'
  );
}

export function isUserAgentApple(userAgentOS: IOS): boolean {
  return userAgentOS.name === 'iOS' || userAgentOS.name === 'Mac OS';
}

export function isUserAgentAndroid(userAgentOS: IOS): boolean {
  return userAgentOS.name === 'Android';
}

export function isUserAgentMobile(userAgentDevice: IDevice): boolean {
  return userAgentDevice.type === 'mobile';
}

export function getPlatformType(): PlatformType | undefined {
  const ua = getUserAgent();

  if (isUserAgentApple(ua.os)) {
    return PlatformType.Apple;
  }

  if (isUserAgentAndroid(ua.os)) {
    return PlatformType.Android;
  }

  if (isUserAgentWindows(ua.os)) {
    return PlatformType.Windows;
  }

  return undefined;
}
