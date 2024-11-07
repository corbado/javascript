import React from 'react';

import { LinkButton } from '../../shared/LinkButton';
import { PasskeyButton } from '../../shared/PasskeyButton';

type Props = {
  loading: boolean;
  handleSubmit: () => void;
  currentIdentifier: string;
  handleSwitch: () => void;
};

const LoginOneTap = ({ loading, currentIdentifier, handleSubmit, handleSwitch }: Props) => {
  return (
    <>
      <div className='cb-h2'>Welcome back</div>

      <div className='cb-login-init-passkey-button'>
        <PasskeyButton
          email={currentIdentifier}
          onClick={handleSubmit}
          isLoading={loading}
        />

        <LinkButton
          onClick={handleSwitch}
          className='cb-switch'
        >
          Switch Account
        </LinkButton>
      </div>
    </>
  );
};

export default LoginOneTap;
