import { useContext } from 'react';

import type { CorbadoUserDetailsContextProps } from '../contexts/CorbadoUserDetailsContext';
import { CorbadoUserDetailsContext } from '../contexts/CorbadoUserDetailsContext';

export const useCorbadoUserDetails = (): CorbadoUserDetailsContextProps => {
  const corbadoUserDetails = useContext(CorbadoUserDetailsContext);

  if (!corbadoUserDetails) {
    throw new Error('Please make sure that your components are wrapped inside <CorbadoUserDetailsProvider />');
  }

  return corbadoUserDetails;
};
