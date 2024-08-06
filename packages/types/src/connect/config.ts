import type { ConnectAppendError, ConnectLoginError } from './errors';

export type CorbadoConnectLoginConfig = {
  onFallback(identifier: string): void;
  onError?(error: ConnectLoginError): void;
  onLoaded(message: string, isFallBackTriggered: boolean): void;
  onComplete(session: string): void;
  onConditionalLoginStart?(ac: AbortController): void;
  onLoginStart?(): void;
  onHelpClick?(): void;
  onSignupClick?(): void;
};

export type CorbadoConnectAppendConfig = {
  appendTokenProvider(): Promise<string>;
  onError?(error: ConnectAppendError): void;
  onSkip(): void;
  onComplete(): void;
};

export enum ConnectTokenType {
  PasskeyList = 'passkey-list',
  PasskeyAppend = 'passkey-append',
  PasskeyDelete = 'passkey-delete',
}

export type CorbadoConnectPasskeyListConfig = {
  connectTokenProvider: (type: ConnectTokenType) => Promise<string>;
};

export type CorbadoConnectConfig = {
  projectId: string;
  flags?: Record<string, string>;
  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
  enableHighlight?: boolean;
};
