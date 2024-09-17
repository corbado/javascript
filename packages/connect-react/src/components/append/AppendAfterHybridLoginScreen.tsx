import { ExcludeCredentialsMatchError, PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { AppendSituationCode, getAppendErrorMessage } from '../../types/situations';
import { LockIcon } from '../shared/icons/LockIcon';
import { PasskeyAddIcon } from '../shared/icons/PasskeyAddIcon';
import { LinkButton } from '../shared/LinkButton';
import { Notification } from '../shared/Notification';
import { PrimaryButton } from '../shared/PrimaryButton';

const AppendAfterHybridLoginScreen = ({ attestationOptions }: { attestationOptions: string }) => {
  const { navigateToScreen, handleErrorSoft, handleErrorHard, handleCredentialExistsError, handleSkip } =
    useAppendProcess();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { getConnectService } = useShared();

  const onSubmitClick = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    const res = await getConnectService().completeAppend(attestationOptions);
    if (res.err) {
      if (res.val instanceof ExcludeCredentialsMatchError) {
        return handleSituation(AppendSituationCode.ClientExcludeCredentialsMatch);
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(AppendSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(AppendSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    setLoading(false);
    navigateToScreen(AppendScreenType.Success);
  };

  const handleSituation = (situationCode: AppendSituationCode) => {
    log.debug(`situation: ${situationCode}`);

    const message = getAppendErrorMessage(situationCode);
    if (message) {
      setErrorMessage(message);
    }

    switch (situationCode) {
      case AppendSituationCode.CtApiNotAvailablePreAuthenticator:
      case AppendSituationCode.CboApiNotAvailablePreAuthenticator:
      case AppendSituationCode.CboApiNotAvailablePostAuthenticator:
        void handleErrorHard(situationCode);
        break;
      case AppendSituationCode.ClientPasskeyOperationCancelled:
        void handleErrorSoft(situationCode);
        break;
      case AppendSituationCode.ClientExcludeCredentialsMatch:
        void handleCredentialExistsError();
        break;
      case AppendSituationCode.ExplicitSkipByUser:
        void handleSkip(situationCode, true);
        break;
    }
  };

  return (
    <div className='cb-append-after-hybrid-login-container'>
      <div className='cb-h2'>Add a passkey to this device</div>
      {errorMessage ? (
        <Notification
          className='cb-error-notification'
          message={errorMessage}
        />
      ) : null}
      <div className='cb-append-after-hybrid-login-icons'>
        <PasskeyAddIcon className='cb-append-after-hybrid-login-icon' />
      </div>
      <div className='cb-append-after-hybrid-login-content'>
        <LockIcon className='cb-append-after-hybrid-login-lock-icon' />
        <div className='cb-p'>Add a passkey on this device in order to not require any other devices for login</div>
      </div>
      <div className='cb-append-after-hybrid-login-cta'>
        <PrimaryButton
          isLoading={loading}
          onClick={() => void onSubmitClick()}
          className='cb-append-after-hybrid-login-button'
        >
          Add new passkey
        </PrimaryButton>
        <LinkButton
          onClick={() => handleSituation(AppendSituationCode.ExplicitSkipByUser)}
          className='cb-append-after-hybrid-login-fallback'
        >
          Continue without new passkey
        </LinkButton>
      </div>
    </div>
  );
};

export default AppendAfterHybridLoginScreen;
