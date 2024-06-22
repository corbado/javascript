import { useContext } from 'react';

import type { AppendProcessContextProps } from '../contexts/AppendProcessContext';
import AppendProcessContext from '../contexts/AppendProcessContext';

const useAppendProcess = (context = AppendProcessContext): AppendProcessContextProps => {
  const appendProcess = useContext(context);

  if (!appendProcess) {
    throw new Error('Please make sure that your components are wrapped inside <AppendProcessProvider />');
  }

  return appendProcess;
};

export default useAppendProcess;
