import type { ScreenNames } from '@corbado/shared-ui';
import { createContext } from 'react';

export interface TimerContextProps {
  remainingTime: number;
  startTimer: () => NodeJS.Timeout;
  stopTimer: () => void;
  startTimerOnScreenInit: (screen: ScreenNames) => NodeJS.Timeout | undefined;
}

export const initialContext: TimerContextProps = {
  remainingTime: 30,
  startTimer: () => setInterval(() => void 0, 1000),
  stopTimer: () => void 0,
  startTimerOnScreenInit: () => void 0,
};

const TimerContext = createContext<TimerContextProps>(initialContext);

export default TimerContext;
