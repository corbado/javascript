import { useContext } from 'react';

import type { LoginProcessContextProps } from '../contexts/LoginProcessContext';
import LoginProcessContext from '../contexts/LoginProcessContext';

const useLoginProcess = (context = LoginProcessContext): LoginProcessContextProps => {
  const loginProcess = useContext(context);

  if (!loginProcess) {
    throw new Error('Please make sure that your components are wrapped inside <LoginProcessProvider />');
  }

  return loginProcess;
};

export default useLoginProcess;
