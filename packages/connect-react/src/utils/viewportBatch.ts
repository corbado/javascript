import type { ConnectService } from '@corbado/web-core';

const VIEWPORT_BATCH_TIMEOUT_MS = 150;

export type ViewportEventType = 'visualviewport-resize' | 'visualviewport-scroll';

export type ViewportBatcher = {
  extend: () => void;
  flush: () => void;
};

export const createViewportBatcher = (
  connectService: ConnectService,
  eventType: ViewportEventType,
): ViewportBatcher => {
  let active = false;
  let startTimestamp: number | null = null;
  let timeout: number | null = null;

  const flush = () => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    const ts = startTimestamp;
    active = false;
    startTimestamp = null;

    if (ts === null) {
      return;
    }

    connectService.enqueueLowEvent({
      eventType,
      timestamp: ts,
      durationMs: Date.now() - ts,
    });
  };

  const extend = () => {
    if (!active) {
      active = true;
      startTimestamp = Date.now();
    }

    if (timeout !== null) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(flush, VIEWPORT_BATCH_TIMEOUT_MS);
  };

  return { extend, flush };
};
