export type CorbadoConnectLoginConfig = {
  onFallback(identifier: string, errorMessage: string): void;
  onFallbackSilent?(identifier: string): void;
  onFallbackCustom?(identifier: string, code: string, payload: string): void;
  onError?(error: string): void;
  onLoaded?(message: string, isFallBackTriggered: boolean): void;
  onComplete(signedPasskeyData: string): Promise<void>;
  onConditionalLoginStart?(ac: AbortController): void;
  onLoginStart?(): void;
  onHelpClick?(): void;
  onSignupClick?(): void;
};

export type CorbadoConnectLoginSecondFactorConfig = {
  loginTokenProvider(): Promise<string>;
  onFallback(errorMessage: string | null): void;
  onError?(error: string): void;
  onLoaded(message: string): void;
  onComplete(session: string): Promise<void>;
};

export type CorbadoConnectAppendConfig = {
  appendTokenProvider(): Promise<string>;
  onError?(error: string): void;
  onSkip(status: AppendStatus): Promise<void>;
  onComplete(status: AppendStatus): Promise<void>;
};

export type AppendStatus = 'skip-implicit' | 'skip-explicit' | 'complete' | 'complete-noop';

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

export type CorbadoConnectDemoConfig = {
  dummy: string;
};
