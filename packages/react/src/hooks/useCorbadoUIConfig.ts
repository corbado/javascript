import { useContext } from 'react';

import type { CorbadoUIContextProps } from '../contexts/CorbadoUIContext';
import { CorbadoUIContext } from '../contexts/CorbadoUIContext';

const useCorbadoUIContext = (context = CorbadoUIContext): CorbadoUIContextProps => {
  const corbadoUIContext = useContext(context);

  if (!corbadoUIContext) {
    throw new Error('Please make sure that your components are wrapped inside <CorbadoUIContext />');
  }

  return corbadoUIContext;
};

export default useCorbadoUIContext;
