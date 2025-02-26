import React from 'react';

import { Button } from '../../shared/Button';
import { PasskeyAppendIcon } from '../../shared/icons/PasskeyAppendIcon';
import { Notification } from '../../shared/Notification';
import { PrimaryButton } from '../../shared/PrimaryButton';

type Props = {
  errorMessage?: string;
  appendLoading: boolean;
  handleSubmit: () => void;
  handleSkip: () => void;
};

const AppendAfterError = ({ errorMessage, appendLoading, handleSubmit, handleSkip }: Props) => {
  return (
    <div className='cb-append-after-error-container cb-connect-append-border'>
      <div className='cb-append-header'>
        <h2 className='cb-h2 cb-bold'>Simplify Your Login</h2>
        <div className='cb-h3'>Create a passkey</div>
      </div>
      {errorMessage ? (
        <Notification
          className='cb-error-notification'
          message={errorMessage}
        />
      ) : null}
      <div className='cb-connect-append-icon'>
        <PasskeyAppendIcon />
      </div>
      <p>Speed up your sign-in next time by creating a new passkey on this device. </p>
      <p>Only create a passkey if this is your device.</p>
      <div className='cb-connect-append-cta'>
        <PrimaryButton
          isLoading={appendLoading}
          type='submit'
          onClick={() => void handleSubmit()}
          className='cb-append-activate-button'
        >
          Continue
        </PrimaryButton>
        <Button
          onClick={handleSkip}
          className='cb-outline-button cb-append-activate-button'
        >
          Not now
        </Button>
      </div>
    </div>
  );
};

export default AppendAfterError;
