export type CorbadoConnectLoginConfig = {
  onFallback(identifier: string, errorMessage: string): void;
  onFallbackSilent?(identifier: string): void;
  onFallbackCustom?(identifier: string, code: string, payload: string): void;
  onUnknownUser?(identifier: string): void;
  onError?(error: string): void;
  onLoaded?(message: string, isFallBackTriggered: boolean): void;
  onComplete(signedPasskeyData: string, clientState: string, webauthnId: string): Promise<void>;
  onConditionalLoginStart?(ac: AbortController): void;
  onLoginStart?(): void;
  onHelpClick?(): void;
  onSignupClick?(): void;
  clientState?: string;
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
  onComplete(status: AppendStatus, clientState: string): Promise<void>;
  situation?: string;
};

export type AppendStatus = 'skip-implicit' | 'skip-explicit' | 'complete' | 'complete-noop';

export enum ConnectTokenType {
  PasskeyList = 'passkey-list',
  PasskeyAppend = 'passkey-append',
  PasskeyDelete = 'passkey-delete',
}

/**
 * Metadata about the passkey a user deletes from CorbadoConnectPasskeyList.
 * It deliberately contains no credential material, so it is safe to forward to analytics or survey tools.
 */
export type ConnectPasskeyDeleteDetail = {
  passkeyId: string;
  name: string;
  browser: string;
  os: string;
  isSynced: boolean;
  isHybrid: boolean;
  createdAt: string;
  lastUsed: string;
};

/**
 * Lifecycle of a passkey deletion in CorbadoConnectPasskeyList:
 * - `start`: the user clicked the delete icon of a passkey; the confirmation is shown next
 * - `cancel`: the user dismissed the confirmation without deleting
 * - `success`: the passkey was deleted and the list has been refreshed
 * - `error`: the user confirmed, but the deletion failed (`reason` names the failing step)
 */
export type ConnectPasskeyDeleteEvent =
  | { type: 'start'; passkey: ConnectPasskeyDeleteDetail }
  | { type: 'cancel'; passkey: ConnectPasskeyDeleteDetail }
  | { type: 'success'; passkey: ConnectPasskeyDeleteDetail; remainingPasskeys: number }
  | { type: 'error'; passkey: ConnectPasskeyDeleteDetail; reason: string };

export type ConnectPasskeyDeleteEventType = ConnectPasskeyDeleteEvent['type'];

/**
 * DOM CustomEvents dispatched by CorbadoConnectPasskeyList, keyed by event name. The name suffix equals the `type`
 * of the ConnectPasskeyDeleteEvent carried in `event.detail`, so one listener can reuse the same switch as the
 * `onPasskeyDelete` callback.
 *
 * Events are dispatched on the element the component is mounted on. They bubble and are composed, so they can also
 * be observed on `document` or `window`, e.g. by a tag manager. The runtime constants for the names are exported by
 * `@corbado/connect-react` (this package contains type declarations only).
 */
export type ConnectPasskeyListEventMap = {
  'corbado:passkey-delete-start': CustomEvent<Extract<ConnectPasskeyDeleteEvent, { type: 'start' }>>;
  'corbado:passkey-delete-cancel': CustomEvent<Extract<ConnectPasskeyDeleteEvent, { type: 'cancel' }>>;
  'corbado:passkey-delete-success': CustomEvent<Extract<ConnectPasskeyDeleteEvent, { type: 'success' }>>;
  'corbado:passkey-delete-error': CustomEvent<Extract<ConnectPasskeyDeleteEvent, { type: 'error' }>>;
};

export type ConnectPasskeyListEventName = keyof ConnectPasskeyListEventMap;

export type CorbadoConnectPasskeyListConfig = {
  connectTokenProvider: (type: ConnectTokenType) => Promise<string>;
  /** Called on every step of a passkey deletion (start, cancel, success, error). */
  onPasskeyDelete?: (event: ConnectPasskeyDeleteEvent) => void;
};

export type CorbadoConnectConfig = {
  projectId: string;
  flags?: Record<string, string>;
  frontendApiUrlSuffix?: string;
  isDebug?: boolean;
  enableHighlight?: boolean;
  customDomain?: string;
};

export type CorbadoConnectDemoConfig = {
  dummy: string;
};
