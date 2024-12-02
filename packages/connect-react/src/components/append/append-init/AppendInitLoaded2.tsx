import React from 'react';

import { Button } from '../../shared/Button';
import { PasskeyAppendIcon } from '../../shared/icons/PasskeyAppendIcon';
import { LinkButton } from '../../shared/LinkButton';
import { Notification } from '../../shared/Notification';
import { PrimaryButton } from '../../shared/PrimaryButton';

type Props = {
  errorMessage?: string;
  appendLoading: boolean;
  handleShowBenefits: () => void;
  handleSubmit: () => void;
  handleSkip: () => void;
};

const AppendInitScreen2 = ({ errorMessage, appendLoading, handleShowBenefits, handleSubmit, handleSkip }: Props) => {
  return (
    <>
      <div className='cb-append-header'>
        <h2 className='cb-h2 cb-bold'>Simplify Your Sign In</h2>
        <div className='cb-h3'>Create a passkey</div>
      </div>
      {errorMessage ? (
        <Notification
          className='cb-error-notification'
          message={errorMessage}
        ></Notification>
      ) : null}
      <div className='cb-connect-append-icon'>
        <PasskeyAppendIcon />
      </div>
      <p>Sign in easily now with your fingerprint, face, or PIN. Sync across your devices. </p>
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
          onClick={handleShowBenefits}
          className='cb-outline-button cb-append-activate-button'
        >
          Learn more
        </Button>
      </div>
      <div className='cb-append-skip-container'>
        <LinkButton
          className='cb-append-skip'
          onClick={handleSkip}
        >
          Skip
        </LinkButton>
      </div>
    </>
  );
};

export default AppendInitScreen2;
