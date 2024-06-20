export type CorbadoConnectLoginConfig = {
  projectId: string;
  fallbackUIContainerId: string;
  fallbackUITextFieldId: string;

  onLoaded(message: string): void;
  onComplete(session: string): void;

  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
};

export type CorbadoConnectAppendConfig = {
  projectId: string;

  appendTokenProvider(): Promise<string>;
  onLoaded(message: string): void;
  onSkip(): void;
  onComplete(method: string): void;

  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
};
