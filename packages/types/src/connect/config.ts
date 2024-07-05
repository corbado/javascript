export type CorbadoConnectLoginConfig = {
  onFallback(email: string): void;
  onLoaded(message: string, isFallBackTriggered: boolean): void;
  onComplete(session: string): void;
  onSignupClick?(): void;
};

export type CorbadoConnectAppendConfig = {
  appendTokenProvider(): Promise<string>;
  onLoaded(message: string): void;
  onSkip(): void;
  onComplete(method: string): void;
};

export type CorbadoConnectConfig = {
  projectId: string;
  flags?: Record<string, string>;
  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
};
