import { ExcludeCredentialsMatchError, PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { AppendSituationCode, getAppendErrorMessage } from '../../types/situations';
import { PasskeyIssueIcon } from '../shared/icons/PasskeyIssueIcon';
import { LinkButton } from '../shared/LinkButton';
import { Notification } from '../shared/Notification';
import { PrimaryButton } from '../shared/PrimaryButton';

const AppendAfterErrorScreen = ({ attestationOptions }: { attestationOptions: string }) => {
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
    <div className='cb-append-after-error-container'>
      <div className='cb-h2'>Issues using passkeys?</div>
      {errorMessage ? (
        <Notification
          className='cb-error-notification'
          message={errorMessage}
        />
      ) : null}
      <div className='cb-append-after-error-icons'>
        <PasskeyIssueIcon className='cb-append-after-error-icon' />
      </div>
      <div className='cb-p'>We detected you had an issue using your passkey.</div>
      <div className='cb-p'>Try adding another passkey to resolve the problem.</div>
      <div className='cb-append-after-error-cta'>
        <PrimaryButton
          isLoading={loading}
          onClick={() => void onSubmitClick()}
          className='cb-append-after-error-button'
        >
          Add passkey
        </PrimaryButton>
        <LinkButton
          onClick={() => void handleSituation(AppendSituationCode.ExplicitSkipByUser)}
          className='cb-append-after-error-fallback'
        >
          Skip
        </LinkButton>
      </div>
    </div>
  );
};

export default AppendAfterErrorScreen;
