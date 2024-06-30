import { useContext } from 'react';

import SharedContext, { SharedContextProps } from '../contexts/SharedContext';

const useShared = (context = SharedContext): SharedContextProps => {
  const ctx = useContext(context);

  if (!ctx) {
    throw new Error('Please make sure that your components are wrapped inside <SharedProvider />');
  }

  return ctx;
};

export default useShared;
