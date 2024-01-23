import { useContext } from 'react';

import type { CorbadoAppContextProps } from '../contexts/CorbadoAppContext';
import { CorbadoAppContext } from '../contexts/CorbadoAppContext';

export const useCorbado = (context = CorbadoAppContext): CorbadoAppContextProps => {
  const corbadoApp = useContext(context);

  if (!corbadoApp) {
    throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider />');
  }

  return corbadoApp;
};
