import React from 'react';

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
  handleIdentifierUpdate: (v: string) => void;
}

const LoginInitLoaded = ({
  isLoading,
  error,
  onSignupClick,
  autoComplete,
  handleSubmit,
  handleIdentifierUpdate,
}: Props) => {
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
        onChange={e => handleIdentifierUpdate(e.target.value)}
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
