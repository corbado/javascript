export type CorbadoConnectLoginConfig = {
  projectId: string;

  onFallback(email: string): void;
  onLoaded(message: string): void;
  onComplete(session: string): void;
  onSignupClick?(): void;

  flags?: Record<string, string>;
  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
};

export type CorbadoConnectAppendConfig = {
  projectId: string;

  appendTokenProvider(): Promise<string>;
  onLoaded(message: string): void;
  onSkip(): void;
  onComplete(method: string): void;

  flags?: Record<string, string>;
  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
};
