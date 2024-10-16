import { useContext } from 'react';

import type { CorbadoSessionContextProps } from '../contexts/CorbadoSessionContext';
import { CorbadoSessionContext } from '../contexts/CorbadoSessionContext';

export const useCorbado = (): CorbadoSessionContextProps => {
  const corbadoSession = useContext(CorbadoSessionContext);

  if (!corbadoSession) {
    throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider />');
  }

  return corbadoSession;
};
