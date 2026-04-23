import type { ConnectService } from '@corbado/web-core';

import { createViewportBatcher } from './viewportBatch';

export type LowEventWindowOptions = {
  connectService: ConnectService;
  enabled: boolean;
  startEventType: string;
  finishEventType: string;
};

const installLowEventWindowListeners = (connectService: ConnectService): (() => void) => {
  const resizeBatcher = createViewportBatcher(connectService, 'visualviewport-resize');
  const scrollBatcher = createViewportBatcher(connectService, 'visualviewport-scroll');

  const enqueueNow = (eventType: string) => {
    connectService.enqueueLowEvent({ eventType, timestamp: Date.now() });
  };

  const handleWindowFocus = () => enqueueNow('window-focus');
  const handleWindowBlur = () => enqueueNow('window-blur');
  const handleVisibilityChange = () => {
    const eventType =
      document.visibilityState === 'hidden' ? 'document-visibilitychange-hidden' : 'document-visibilitychange-visible';
    enqueueNow(eventType);
  };
  const handleResize = () => resizeBatcher.extend();
  const handleScroll = () => scrollBatcher.extend();

  window.addEventListener('focus', handleWindowFocus);
  window.addEventListener('blur', handleWindowBlur);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.visualViewport?.addEventListener('resize', handleResize);
  window.visualViewport?.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('focus', handleWindowFocus);
    window.removeEventListener('blur', handleWindowBlur);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.visualViewport?.removeEventListener('resize', handleResize);
    window.visualViewport?.removeEventListener('scroll', handleScroll);

    resizeBatcher.flush();
    scrollBatcher.flush();
  };
};

export const withLowEventWindow = async <T>(options: LowEventWindowOptions, fn: () => Promise<T>): Promise<T> => {
  if (!options.enabled) {
    return fn();
  }

  const stop = installLowEventWindowListeners(options.connectService);
  options.connectService.enqueueLowEvent({
    eventType: options.startEventType,
    timestamp: Date.now(),
  });

  try {
    return await fn();
  } finally {
    stop();
    options.connectService.enqueueLowEvent({
      eventType: options.finishEventType,
      timestamp: Date.now(),
    });
    await options.connectService.flushLowEvents();
  }
};
