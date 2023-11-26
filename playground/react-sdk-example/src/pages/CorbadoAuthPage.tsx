import useAuthUI from '../hooks/useAuthUI.ts';
import { useMemo } from 'react';
import { AuthScreenNames } from '../contexts/AuthUIContext.ts';
import InitiateSignupPage from './InitiateSignupPage.tsx';
import SelectSignupMethodPage from './SelectSignupMethodPage.tsx';
import CompleteEmailOTP from './CompleteEmailOTP.tsx';
import LoginPage from './LoginPage.tsx';
import { useCorbado } from '@corbado/react-sdk';
import GlobalErrorPage from './GobalErrorPage.tsx';

const screensMap = {
  [AuthScreenNames.InitiateSignUp]: InitiateSignupPage,
  [AuthScreenNames.Login]: LoginPage,
  [AuthScreenNames.CompleteEmailOTP]: CompleteEmailOTP,
  [AuthScreenNames.SelectSignUpMethod]: SelectSignupMethodPage,
};

const CorbadoAuthPage = () => {
  const { currentScreen } = useAuthUI();
  const { globalError } = useCorbado();

  const ScreenComponent = useMemo(() => {
    if (globalError) {
      return GlobalErrorPage;
    }

    return screensMap[currentScreen];
  }, [currentScreen, globalError]);

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-2/3 max-w-xl'>
        <ScreenComponent />
      </div>
    </div>
  );
};

export default CorbadoAuthPage;
