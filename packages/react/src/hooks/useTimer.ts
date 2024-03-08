import { useContext } from 'react';

import TimerContext from '../contexts/TimerContext';

export const useTimer = () => {
  const timer = useContext(TimerContext);

  if (!timer) {
    throw new Error('Please make sure that your components are wrapped inside <TimerProvider />');
  }

  return timer;
};
