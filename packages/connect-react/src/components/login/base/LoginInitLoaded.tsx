import React, { useRef } from 'react';

import InputField from '../../shared/InputField';
import { LinkButton } from '../../shared/LinkButton';
import { Notification } from '../../shared/Notification';
import { PrimaryButton } from '../../shared/PrimaryButton';

interface Props {
  isLoading: boolean;
  error: string | undefined;
  autoComplete: string;
  onSignupClick?: () => void;
  handleSubmit: () => void;
}

const LoginInitLoaded = ({ isLoading, error, onSignupClick, autoComplete, handleSubmit }: Props) => {
  const emailFieldRef = useRef<HTMLInputElement | null>();

  return (
    <>
      {error ? (
        <Notification
          message={error}
          className='cb-error-notification'
        />
      ) : null}
      <InputField
        id='email'
        name='email'
        label='Email address'
        type='email'
        autoComplete={autoComplete}
        autoFocus={true}
        placeholder=''
        ref={(el: HTMLInputElement | null) => (emailFieldRef.current = el)}
      />
      <PrimaryButton
        type='submit'
        className='cb-login-init-submit'
        isLoading={isLoading}
        onClick={handleSubmit}
      >
        Login
      </PrimaryButton>

      {onSignupClick && (
        <LinkButton
          onClick={() => onSignupClick?.()}
          className='cb-login-init-signup'
        >
          Signup for an account
        </LinkButton>
      )}
    </>
  );
};
export default LoginInitLoaded;
