import type { ConnectService } from '@corbado/web-core';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { scanInputEnvSignals } from '../utils/inputEnvProbe';
import { createViewportBatcher } from '../utils/viewportBatch';

type Props = {
  inputRef: RefObject<HTMLInputElement>;
  connectService: ConnectService;
  enabled: boolean;
};

type InputBatch = {
  firstTimestamp: number;
  lastTimestamp: number;
};

const useLoginInputEventLow = ({ inputRef, connectService, enabled }: Props) => {
  const inputBatchRef = useRef<InputBatch | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const input = inputRef.current;
    if (!input) {
      return;
    }

    const isInputFocused = () => document.activeElement === input;

    const resizeBatcher = createViewportBatcher(connectService, 'visualviewport-resize');
    const scrollBatcher = createViewportBatcher(connectService, 'visualviewport-scroll');

    const emittedSignals = new Set<string>();
    let firstFocusHandled = false;
    let mountProbeTimer: number | null = null;
    let focusProbeTimer: number | null = null;

    const runEnvProbe = () => {
      const matches = scanInputEnvSignals();
      const now = Date.now();
      for (const eventType of matches) {
        if (emittedSignals.has(eventType)) {
          continue;
        }

        emittedSignals.add(eventType);
        connectService.enqueueLowEvent({ eventType, timestamp: now });
      }
    };

    const scheduleFocusProbe = () => {
      if (firstFocusHandled) {
        return;
      }

      firstFocusHandled = true;
      focusProbeTimer = window.setTimeout(runEnvProbe, 250);
    };

    const flushInputBatch = () => {
      const batch = inputBatchRef.current;
      if (!batch) {
        return;
      }

      connectService.enqueueLowEvent({
        eventType: 'input',
        timestamp: batch.firstTimestamp,
        durationMs: batch.lastTimestamp - batch.firstTimestamp,
      });
      inputBatchRef.current = null;
    };

    const enqueueNonInputEvent = (eventType: string) => {
      flushInputBatch();
      connectService.enqueueLowEvent({
        eventType,
        timestamp: Date.now(),
      });
    };

    const handleFocus = () => {
      scheduleFocusProbe();
      enqueueNonInputEvent('focus');
    };

    const handleBlur = () => {
      resizeBatcher.flush();
      scrollBatcher.flush();
      enqueueNonInputEvent('blur');
    };

    const handlePointerDown = () => {
      enqueueNonInputEvent('pointerdown');
    };

    const handlePointerUp = () => {
      enqueueNonInputEvent('pointerup');
    };

    const handleClick = () => {
      enqueueNonInputEvent('click');
    };

    const handleInput = () => {
      const timestamp = Date.now();
      const currentBatch = inputBatchRef.current;

      if (!currentBatch) {
        inputBatchRef.current = {
          firstTimestamp: timestamp,
          lastTimestamp: timestamp,
        };
        return;
      }

      currentBatch.lastTimestamp = timestamp;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      enqueueNonInputEvent('keyup-escape');
    };

    const handleWindowFocus = () => {
      if (!isInputFocused()) {
        return;
      }

      enqueueNonInputEvent('window-focus');
    };

    const handleWindowBlur = () => {
      if (!isInputFocused()) {
        return;
      }

      enqueueNonInputEvent('window-blur');
    };

    const handleVisibilityChange = () => {
      if (!isInputFocused()) {
        return;
      }

      const eventType =
        document.visibilityState === 'hidden'
          ? 'document-visibilitychange-hidden'
          : 'document-visibilitychange-visible';
      enqueueNonInputEvent(eventType);
    };

    const handleVisualViewportResize = () => {
      if (!isInputFocused()) {
        return;
      }

      resizeBatcher.extend();
    };

    const handleVisualViewportScroll = () => {
      if (!isInputFocused()) {
        return;
      }

      scrollBatcher.extend();
    };

    const flushForTeardown = () => {
      flushInputBatch();
      resizeBatcher.flush();
      scrollBatcher.flush();
      connectService.flushLowEventsKeepalive();
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('pointerdown', handlePointerDown);
    input.addEventListener('pointerup', handlePointerUp);
    input.addEventListener('click', handleClick);
    input.addEventListener('input', handleInput);
    input.addEventListener('keyup', handleKeyUp);

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', flushForTeardown);
    window.visualViewport?.addEventListener('resize', handleVisualViewportResize);
    window.visualViewport?.addEventListener('scroll', handleVisualViewportScroll);

    if (document.activeElement === input) {
      handleFocus();
    }

    mountProbeTimer = window.setTimeout(runEnvProbe, 500);

    return () => {
      if (mountProbeTimer !== null) {
        window.clearTimeout(mountProbeTimer);
      }
      if (focusProbeTimer !== null) {
        window.clearTimeout(focusProbeTimer);
      }

      flushForTeardown();

      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('pointerdown', handlePointerDown);
      input.removeEventListener('pointerup', handlePointerUp);
      input.removeEventListener('click', handleClick);
      input.removeEventListener('input', handleInput);
      input.removeEventListener('keyup', handleKeyUp);

      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', flushForTeardown);
      window.visualViewport?.removeEventListener('resize', handleVisualViewportResize);
      window.visualViewport?.removeEventListener('scroll', handleVisualViewportScroll);
    };
  }, [connectService, enabled, inputRef]);
};

export default useLoginInputEventLow;
