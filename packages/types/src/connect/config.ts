import type { ConnectAppendError, ConnectLoginError } from './errors';

export type CorbadoConnectLoginConfig = {
  onFallback(identifier: string): void;
  onError?(error: ConnectLoginError): void;
  onLoaded(message: string, isFallBackTriggered: boolean): void;
  onComplete(session: string): void;
  onConditionLoginStart(ac: AbortController): void;
  onHelpClick?(): void;
  onSignupClick?(): void;
} & CorbadoConnectConfig;

export type CorbadoConnectAppendConfig = {
  appendTokenProvider(): Promise<string>;
  onError?(error: ConnectAppendError): void;
  onSkip(): void;
  onComplete(): void;
} & CorbadoConnectConfig;

export enum ConnectTokenType {
  PasskeyList = 'passkey-list',
  PasskeyAppend = 'passkey-append',
  PasskeyDelete = 'passkey-delete',
}

export type CorbadoConnectPasskeyListConfig = {
  connectTokenProvider: (type: ConnectTokenType) => Promise<string>;
} & CorbadoConnectConfig;

export type CorbadoConnectConfig = {
  projectId: string;
  flags?: Record<string, string>;
  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
  enableHighlight?: boolean;
};
