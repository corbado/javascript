export enum ScreenNames {
  InitSignup,
  InitLogin,
  InitLoginFallback,
  InitLoginOneTap,
  PasskeyAppend,
  PasskeyAppended,
  Home,
  PasskeyList,
}

export const phone = '+4915121609839';
export const password = 'asdfasdf';

export const totalTimeout = process.env.CI ? 30000 : 40000;
export const operationTimeout = 10000;
