import type { ScreenNames } from '@corbado/shared-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import TimerContext from './TimerContext';

export const TimerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [initiatingScreen, setInitiatingScreen] = useState<ScreenNames>();
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (remainingTime > 0 || !timer.current) {
      return;
    }

    stopTimer();
  }, [remainingTime]);

  const startTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }

    setRemainingTime(30);
    timer.current = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return timer.current;
  };

  const startTimerOnScreenInit = (screen: ScreenNames) => {
    if (screen === initiatingScreen) {
      return;
    }

    setInitiatingScreen(screen);
    return startTimer();
  };

  const stopTimer = () => {
    setRemainingTime(0);
    clearInterval(timer.current);
    timer.current = undefined;
  };

  return (
    <TimerContext.Provider value={{ remainingTime, startTimer, stopTimer, startTimerOnScreenInit }}>
      {children}
    </TimerContext.Provider>
  );
};
