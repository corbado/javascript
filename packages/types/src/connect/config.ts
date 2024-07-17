import type { ConnectAppendError, ConnectLoginError } from './errors';
import type { ConnectLoginStates } from './states';

export type CorbadoConnectLoginConfig = {
  onFallback(email: string): void;
  onError?(error: ConnectLoginError): void;
  onStateChange?(state: ConnectLoginStates): void;
  onLoaded(message: string, isFallBackTriggered: boolean): void;
  onComplete(session: string): void;
  onSignupClick?(): void;
  showLabel?: boolean;
  successTimeout?: number;
};

export type CorbadoConnectAppendConfig = {
  appendTokenProvider(): Promise<string>;
  onError?(error: ConnectAppendError): void;
  onLoaded(message: string): void;
  onSkip(): void;
  onComplete(method: string): void;
};

export enum CorbadoTokens {
  PasskeyList = 'passkey-list',
  PasskeyAppend = 'passkey-append',
  PasskeyDelete = 'passkey-delete',
}

export type CorbadoConnectPasskeyListConfig = {
  corbadoTokenProvider: (type: CorbadoTokens) => Promise<string>;
};

export type CorbadoConnectConfig = {
  projectId: string;
  flags?: Record<string, string>;
  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
};
