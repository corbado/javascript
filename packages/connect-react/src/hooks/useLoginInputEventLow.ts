import type { ConnectService } from '@corbado/web-core';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

type Props = {
  inputRef: RefObject<HTMLInputElement>;
  connectService: ConnectService;
  enabled: boolean;
};

type InputBatch = {
  firstTimestamp: number;
  lastTimestamp: number;
};

const visualViewportBatchTimeoutMs = 150;

const useLoginInputEventLow = ({ inputRef, connectService, enabled }: Props) => {
  const inputBatchRef = useRef<InputBatch | null>(null);
  const viewportResizeActiveRef = useRef(false);
  const viewportResizeStartTimestampRef = useRef<number | null>(null);
  const viewportResizeEndTimeoutRef = useRef<number | null>(null);
  const viewportScrollActiveRef = useRef(false);
  const viewportScrollStartTimestampRef = useRef<number | null>(null);
  const viewportScrollEndTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const input = inputRef.current;
    if (!input) {
      return;
    }

    const isInputFocused = () => document.activeElement === input;

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

    const flushViewportBatch = (
      eventType: 'visualviewport-resize' | 'visualviewport-scroll',
      activeRef: { current: boolean },
      startTimestampRef: { current: number | null },
      timeoutRef: { current: number | null },
    ) => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      const startTimestamp = startTimestampRef.current;
      activeRef.current = false;
      startTimestampRef.current = null;
      timeoutRef.current = null;

      if (startTimestamp === null) {
        return;
      }

      connectService.enqueueLowEvent({
        eventType,
        timestamp: startTimestamp,
        durationMs: Date.now() - startTimestamp,
      });
    };

    const extendViewportBatch = (
      eventType: 'visualviewport-resize' | 'visualviewport-scroll',
      activeRef: { current: boolean },
      startTimestampRef: { current: number | null },
      timeoutRef: { current: number | null },
    ) => {
      if (!activeRef.current) {
        activeRef.current = true;
        startTimestampRef.current = Date.now();
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        flushViewportBatch(eventType, activeRef, startTimestampRef, timeoutRef);
      }, visualViewportBatchTimeoutMs);
    };

    const handleFocus = () => {
      enqueueNonInputEvent('focus');
    };

    const handleBlur = () => {
      flushViewportBatch(
        'visualviewport-resize',
        viewportResizeActiveRef,
        viewportResizeStartTimestampRef,
        viewportResizeEndTimeoutRef,
      );
      flushViewportBatch(
        'visualviewport-scroll',
        viewportScrollActiveRef,
        viewportScrollStartTimestampRef,
        viewportScrollEndTimeoutRef,
      );
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

      enqueueNonInputEvent('document-visibilitychange');
    };

    const handleVisualViewportResize = () => {
      if (!isInputFocused()) {
        return;
      }

      extendViewportBatch(
        'visualviewport-resize',
        viewportResizeActiveRef,
        viewportResizeStartTimestampRef,
        viewportResizeEndTimeoutRef,
      );
    };

    const handleVisualViewportScroll = () => {
      if (!isInputFocused()) {
        return;
      }

      extendViewportBatch(
        'visualviewport-scroll',
        viewportScrollActiveRef,
        viewportScrollStartTimestampRef,
        viewportScrollEndTimeoutRef,
      );
    };

    const flushForTeardown = () => {
      flushInputBatch();
      flushViewportBatch(
        'visualviewport-resize',
        viewportResizeActiveRef,
        viewportResizeStartTimestampRef,
        viewportResizeEndTimeoutRef,
      );
      flushViewportBatch(
        'visualviewport-scroll',
        viewportScrollActiveRef,
        viewportScrollStartTimestampRef,
        viewportScrollEndTimeoutRef,
      );
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

    return () => {
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
