import React, { useRef } from 'react';

import useLoginInputEventLow from '../../../hooks/useLoginInputEventLow';
import useShared from '../../../hooks/useShared';
import InputField from '../../shared/InputField';
import { LinkButton } from '../../shared/LinkButton';
import { Notification } from '../../shared/Notification';
import { PrimaryButton } from '../../shared/PrimaryButton';

interface Props {
  isLoading: boolean;
  error: string | undefined;
  autoComplete: string;
  enableEventLow?: boolean;
  onSignupClick?: () => void;
  handleSubmit: () => void;
  handleIdentifierUpdate: (v: string) => void;
}

const LoginInitLoaded = ({
  isLoading,
  error,
  onSignupClick,
  autoComplete,
  enableEventLow = false,
  handleSubmit,
  handleIdentifierUpdate,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { getConnectService } = useShared();

  useLoginInputEventLow({
    inputRef,
    connectService: getConnectService(),
    enabled: enableEventLow,
  });

  return (
    <>
      {error ? (
        <Notification
          message={error}
          className='cb-error-notification'
        />
      ) : null}
      <InputField
        name='email'
        label='Email address'
        type='email'
        autoComplete={autoComplete}
        autoFocus={true}
        placeholder=''
        ref={inputRef}
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
