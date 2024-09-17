export type CorbadoConnectLoginConfig = {
  onFallback(identifier: string, errorMessage: string | null): void;
  onError?(error: string): void;
  onLoaded(message: string, isFallBackTriggered: boolean): void;
  onComplete(session: string): Promise<void>;
  onConditionalLoginStart?(ac: AbortController): void;
  onLoginStart?(): void;
  onHelpClick?(): void;
  onSignupClick?(): void;
};

export type CorbadoConnectAppendConfig = {
  appendTokenProvider(): Promise<string>;
  onError?(error: string): void;
  onSkip(): void;
  onComplete(): Promise<void>;
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
