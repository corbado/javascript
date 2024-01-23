import { useContext } from 'react';

import type { CorbadoSessionContextProps } from '../contexts/CorbadoSessionContext';
import { CorbadoSessionContext } from '../contexts/CorbadoSessionContext';

export const useCorbadoSession = (context = CorbadoSessionContext): CorbadoSessionContextProps => {
  const corbadoSession = useContext(context);

  if (!corbadoSession) {
    throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider />');
  }

  return corbadoSession;
};
