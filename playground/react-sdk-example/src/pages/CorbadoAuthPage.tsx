import useAuthUI from '../hooks/useAuthUI.ts';
import { useMemo } from 'react';
import { AuthScreenNames } from '../contexts/AuthUIContext.ts';
import InitiateSignup from '../components/auth/InitiateSignup.tsx';
import SelectSignupMethod from '../components/auth/SelectSignupMethod.tsx';
import CompleteEmailOTP from '../components/auth/CompleteEmailOTP.tsx';
import Login from '../components/auth/Login.tsx';
import { useCorbado } from '@corbado/react-sdk';
import {GlobalErrorScreen} from "../components/auth/GobalError.tsx";

const screensMap = {
  [AuthScreenNames.InitiateSignUp]: InitiateSignup,
  [AuthScreenNames.Login]: Login,
  [AuthScreenNames.CompleteEmailOTP]: CompleteEmailOTP,
  [AuthScreenNames.SelectSignUpMethod]: SelectSignupMethod,
};


const CorbadoAuthPage = () => {
  const { currentScreen } = useAuthUI();
  const { globalError } = useCorbado();

  const ScreenComponent = useMemo(() => {
    if (globalError) {
      return GlobalErrorScreen;
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
