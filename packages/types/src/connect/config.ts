export type CorbadoConnectLoginConfig = {
  projectId: string;
  fallbackUIContainerId: string;
  fallbackUITextFieldId: string;
  onLoaded(message: string): void;
  onComplete(method: string): void;

  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
};
