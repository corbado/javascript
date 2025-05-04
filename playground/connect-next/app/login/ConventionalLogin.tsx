import React, { useState } from 'react';
import PasswordForm from '@/app/login/PasswordForm';
import { confirmSignIn, signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import ConfirmOTP from '@/components/ConfirmOTP';
import { cookies } from 'next/headers';
import { TOTP } from 'totp-generator';
import { autoFillTOTP } from '@/app/login/actions';

type Props = {
  initialUserProvidedIdentifier: string;
};

enum State {
  ProvidePassword,
  ProvideSMSCode,
  ProvideTOTPCode,
}

export const ConventionalLogin = ({ initialUserProvidedIdentifier }: Props) => {
  const [state, setState] = useState(State.ProvidePassword);
  const router = useRouter();

  const handleConventionalLogin = async (username: string, password: string): Promise<string | undefined> => {
    try {
      const result = await signIn({
        username,
        password,
      });

      switch (result.nextStep.signInStep) {
        case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
          setState(State.ProvideSMSCode);
          break;

        case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
          setState(State.ProvideTOTPCode);
          break;

        case 'DONE':
          router.push('/post-login');

          break;

        default:
          console.error('Unexpected next step', result.nextStep);
          break;
      }
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }

      return 'An error occurred';
    }
  };

  const handleConfirmCode = async (code: string): Promise<string | undefined> => {
    try {
      const res = await confirmSignIn({
        challengeResponse: code,
      });

      if (res.isSignedIn) {
        router.push('/post-login');
      }
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }

      return 'An error occurred';
    }
  };

  let headline, sub: string;
  let content: React.ReactNode;
  switch (state) {
    case State.ProvidePassword:
      headline = 'Login';
      sub = 'Use your email to log into you Example Corp account.';
      content = (
        <PasswordForm
          onClick={handleConventionalLogin}
          initialUserProvidedIdentifier={initialUserProvidedIdentifier}
        />
      );

      break;
    case State.ProvideSMSCode:
      headline = 'Check your phone';
      sub = 'We have sent an SMS to your phone.';
      content = <ConfirmOTP onSubmit={handleConfirmCode} />;

      break;
    case State.ProvideTOTPCode:
      headline = 'Check your authenticator';
      sub = 'Please enter the code from your authenticator app.';
      content = (
        <ConfirmOTP
          onSubmit={handleConfirmCode}
          onAutoFill={autoFillTOTP}
        />
      );

      break;
    default:
      throw new Error(`Invalid state: ${state}`);
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-8'>
        <h3 className='text-xl font-semibold'>{headline}</h3>
        <p className='text-sm text-gray-500'>{sub}</p>
      </div>
      <div className='login-area bg-gray-50 px-4 py-8 sm:px-8'>{content}</div>
    </>
  );
};

export default ConventionalLogin;
