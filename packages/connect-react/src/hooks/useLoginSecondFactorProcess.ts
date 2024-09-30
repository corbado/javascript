import { useContext } from 'react';
import LoginSecondFactorProcessContext, {
  LoginSecondFactorProcessContextProps,
} from '../contexts/LoginSecondFactorProcessContext';

const useLoginSecondFactorProcess = (
  context = LoginSecondFactorProcessContext,
): LoginSecondFactorProcessContextProps => {
  const loginProcess = useContext(context);

  if (!loginProcess) {
    throw new Error('Please make sure that your components are wrapped inside <LoginSecondFactorProcessProvider />');
  }

  return loginProcess;
};

export default useLoginSecondFactorProcess;
