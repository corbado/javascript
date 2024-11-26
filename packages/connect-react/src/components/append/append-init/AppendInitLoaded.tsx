import React from 'react';

import { Button } from '../../shared/Button';
import { FingerprintIcon } from '../../shared/icons/FingerprintIcon';
import { PasskeyIcon } from '../../shared/icons/PasskeyIcon';
import { SuccessIcon } from '../../shared/icons/SuccessIcon';
import { LinkButton } from '../../shared/LinkButton';
import { Notification } from '../../shared/Notification';
import { PasskeyInfoListItem } from '../../shared/PasskeyInfoListItem';
import { PrimaryButton } from '../../shared/PrimaryButton';

type Props = {
  errorMessage?: string;
  appendLoading: boolean;
  handleShowBenefits: () => void;
  handleSubmit: () => void;
  handleSkip: () => void;
};

const AppendInitScreen = ({ errorMessage, appendLoading, handleShowBenefits, handleSubmit, handleSkip }: Props) => {
  return (
    <>
      <div className='cb-append-header'>
        <h2 className='cb-h2'>Activate a passkey</h2>
        <div className='cb-append-skip-container'>
          <LinkButton
            className='cb-append-skip'
            onClick={handleSkip}
          >
            Skip
          </LinkButton>
        </div>
      </div>
      <div className='cb-h3'>Fast and secure sign-in with passkeys</div>
      {errorMessage ? (
        <Notification
          className='cb-error-notification'
          message={errorMessage}
        ></Notification>
      ) : null}
      <div className='cb-append-info-list'>
        <PasskeyInfoListItem
          title='No more forgotten passwords'
          description='Sign in easily with your face, fingerprint or pin that’s saved to your device'
          icon={<FingerprintIcon platform='default' />}
        />
        <PasskeyInfoListItem
          title='Next-generation security'
          description='Forget the fear of stolen passwords'
          icon={<SuccessIcon />}
        />
        <PasskeyInfoListItem
          title='Syncs across your devices'
          description='Faster sign-in from your password manager'
          icon={<PasskeyIcon />}
        />
      </div>
      <div className='cb-connect-append-cta'>
        <Button
          onClick={handleShowBenefits}
          className='cb-outline-button'
        >
          Learn more
        </Button>
        <PrimaryButton
          isLoading={appendLoading}
          type='submit'
          onClick={() => void handleSubmit()}
          className='cb-append-activate-button'
        >
          Activate passkey
        </PrimaryButton>
      </div>
    </>
  );
};

export default AppendInitScreen;
