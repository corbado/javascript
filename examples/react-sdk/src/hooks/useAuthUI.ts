import { useContext } from 'react';

import AuthUIContext, { AuthUIContextInterface } from '../contexts/AuthUIContext.ts';

const useAuthUI = (context = AuthUIContext): AuthUIContextInterface => {
  const flowHandler = useContext(context);

  if (!flowHandler) {
    throw new Error('Please make sure that your components are wrapped inside <AuthUIProvider />');
  }

  return flowHandler;
};

export default useAuthUI;
