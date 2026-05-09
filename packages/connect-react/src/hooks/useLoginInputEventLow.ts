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

type AutofillStreak = {
  firstTimestamp: number;
  lastTimestamp: number;
};

const BIG_INPUT_DELTA_THRESHOLD = 3;
const AUTOFILL_STREAK_LENGTH = 5;
const AUTOFILL_FAST_INTERVAL_MS = 80;
const AUTOFILL_UNIFORM_SPREAD_MS = 25;

const useLoginInputEventLow = ({ inputRef, connectService, enabled }: Props) => {
  const inputBatchRef = useRef<InputBatch | null>(null);
  const previousLengthRef = useRef(0);
  const autofillTimestampsRef = useRef<number[]>([]);
  const autofillStreakRef = useRef<AutofillStreak | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const input = inputRef.current;
    if (!input) {
      return;
    }

    previousLengthRef.current = input.value.length;
    autofillTimestampsRef.current = [];
    autofillStreakRef.current = null;

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

    const extendInputBatch = (timestamp: number) => {
      const batch = inputBatchRef.current;
      if (!batch) {
        inputBatchRef.current = { firstTimestamp: timestamp, lastTimestamp: timestamp };
        return;
      }

      batch.lastTimestamp = timestamp;
    };

    const drainAutofillRingToBatch = () => {
      const ring = autofillTimestampsRef.current;
      for (const ts of ring) {
        extendInputBatch(ts);
      }
      ring.length = 0;
    };

    const flushInputBatch = () => {
      drainAutofillRingToBatch();

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

    const flushAutofillStreak = () => {
      const streak = autofillStreakRef.current;
      if (!streak) {
        return;
      }

      connectService.enqueueLowEvent({
        eventType: 'big-input-add',
        timestamp: streak.firstTimestamp,
        durationMs: streak.lastTimestamp - streak.firstTimestamp,
      });
      autofillStreakRef.current = null;
    };

    const enqueueNonInputEvent = (eventType: string) => {
      flushInputBatch();
      flushAutofillStreak();
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

    const detectAutofillStreak = (): boolean => {
      const ring = autofillTimestampsRef.current;
      if (ring.length < AUTOFILL_STREAK_LENGTH) {
        return false;
      }

      let minInterval = Infinity;
      let maxInterval = -Infinity;
      for (let i = 1; i < ring.length; i++) {
        const interval = ring[i] - ring[i - 1];
        if (interval > AUTOFILL_FAST_INTERVAL_MS) {
          return false;
        }
        if (interval < minInterval) {
          minInterval = interval;
        }
        if (interval > maxInterval) {
          maxInterval = interval;
        }
      }

      return maxInterval - minInterval <= AUTOFILL_UNIFORM_SPREAD_MS;
    };

    const handleInput = () => {
      const timestamp = Date.now();

      const newLength = input.value.length;
      const delta = newLength - previousLengthRef.current;
      previousLengthRef.current = newLength;

      if (delta >= BIG_INPUT_DELTA_THRESHOLD) {
        drainAutofillRingToBatch();
        flushAutofillStreak();
        connectService.enqueueLowEvent({ eventType: 'big-input-add', timestamp });
        return;
      }

      if (delta <= -BIG_INPUT_DELTA_THRESHOLD) {
        drainAutofillRingToBatch();
        flushAutofillStreak();
        connectService.enqueueLowEvent({ eventType: 'big-input-rem', timestamp });
        return;
      }

      const activeStreak = autofillStreakRef.current;
      if (activeStreak) {
        if (delta === 1 && timestamp - activeStreak.lastTimestamp <= AUTOFILL_FAST_INTERVAL_MS) {
          activeStreak.lastTimestamp = timestamp;
          return;
        }

        flushAutofillStreak();
      }

      if (delta !== 1) {
        drainAutofillRingToBatch();
        extendInputBatch(timestamp);
        return;
      }

      const ring = autofillTimestampsRef.current;
      ring.push(timestamp);
      if (ring.length > AUTOFILL_STREAK_LENGTH) {
        const graduated = ring.shift() as number;
        extendInputBatch(graduated);
      }

      if (!detectAutofillStreak()) {
        return;
      }

      const streakStart = ring[0];
      const streakLast = ring[ring.length - 1];
      ring.length = 0;

      flushInputBatch();
      autofillStreakRef.current = {
        firstTimestamp: streakStart,
        lastTimestamp: streakLast,
      };
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
      flushAutofillStreak();
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
