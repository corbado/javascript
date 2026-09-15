import type {
  ConnectPasskeyDeleteDetail,
  ConnectPasskeyDeleteEvent,
  ConnectPasskeyDeleteEventType,
  ConnectPasskeyListEventName,
} from '@corbado/types';
import type { Passkey } from '@corbado/web-core';
import log from 'loglevel';

// runtime counterparts of ConnectPasskeyListEventMap (@corbado/types ships declarations only)
export const CONNECT_PASSKEY_DELETE_EVENTS: Record<ConnectPasskeyDeleteEventType, ConnectPasskeyListEventName> = {
  start: 'corbado:passkey-delete-start',
  cancel: 'corbado:passkey-delete-cancel',
  success: 'corbado:passkey-delete-success',
  error: 'corbado:passkey-delete-error',
};

export const toPasskeyDeleteDetail = (passkey: Passkey): ConnectPasskeyDeleteDetail => ({
  passkeyId: passkey.id,
  name: passkey.aaguidDetails.name,
  browser: passkey.sourceBrowser,
  os: passkey.sourceOS,
  isSynced: passkey.backupState,
  isHybrid: passkey.transport.includes('hybrid'),
  createdAt: passkey.created,
  lastUsed: passkey.lastUsed,
});

/**
 * Notifies the host page about a step of a passkey deletion, through the optional config callback and through a
 * bubbling, composed DOM CustomEvent on the mount element (falls back to `document`).
 *
 * Errors thrown by host code are swallowed on purpose: a broken listener must never break the passkey flow.
 */
export const emitPasskeyDeleteEvent = (
  target: EventTarget | null | undefined,
  callback: ((event: ConnectPasskeyDeleteEvent) => void) | undefined,
  event: ConnectPasskeyDeleteEvent,
): void => {
  if (callback) {
    try {
      callback(event);
    } catch (e) {
      log.debug('onPasskeyDelete callback failed', e);
    }
  }

  const name = CONNECT_PASSKEY_DELETE_EVENTS[event.type];
  try {
    (target ?? document).dispatchEvent(new CustomEvent(name, { detail: event, bubbles: true, composed: true }));
  } catch (e) {
    log.debug(`dispatching ${name} failed`, e);
  }
};
