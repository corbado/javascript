import { ExcludeCredentialsMatchError, PasskeyChallengeCancelledError } from '@corbado/web-core';
import React, { useCallback, useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import Checkbox from '../shared/Checkbox';
import { PasskeyIssueIcon } from '../shared/icons/PasskeyIssueIcon';
import { LinkButton } from '../shared/LinkButton';
import { Notification } from '../shared/Notification';
import { PrimaryButton } from '../shared/PrimaryButton';

const AppendAfterErrorScreen = ({ attestationOptions }: { attestationOptions: string }) => {
  const { config, navigateToScreen, handleErrorSoft, handleErrorHard, handleCredentialExistsError, handleSkip } =
    useAppendProcess();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { getConnectService } = useShared();

  const onSubmitClick = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(undefined);
    const res = await getConnectService().completeAppend(attestationOptions);
    if (res.err) {
      if (res.val instanceof ExcludeCredentialsMatchError) {
        await handleCredentialExistsError();
        setLoading(false);
        return;
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        setError('Passkey operation was cancelled or timed out.');
        await handleErrorSoft('PasskeyChallengeAborted', res.val);
        setLoading(false);
        return;
      }

      void handleErrorHard('FrontendApiNotReachable', res.val);
      setLoading(false);
      return;
    }

    if (dontShowAgain) {
      const createEventRes = await getConnectService().recordEventUserAppendAfterLoginErrorBlacklisted();
      if (createEventRes?.err) {
        void handleErrorHard('FrontendApiNotReachable', createEventRes.val);
      }
    }

    setLoading(false);
    navigateToScreen(AppendScreenType.Success);
  }, [getConnectService, config, navigateToScreen, loading, dontShowAgain]);

  const onClickSkip = async () => {
    if (dontShowAgain) {
      const createEventRes = await getConnectService().recordEventUserAppendAfterLoginErrorBlacklisted();
      if (createEventRes?.err) {
        void handleErrorHard('FrontendApiNotReachable', createEventRes.val);
      }
    }

    return handleSkip('onClickSkip', true);
  };

  const toggleDontShowAgain = () => setDontShowAgain(prev => !prev);

  return (
    <div className='cb-append-after-error-container'>
      <div className='cb-h2'>Issues using passkeys?</div>
      {error ? (
        <Notification
          className='cb-error-notification'
          message={error}
        />
      ) : null}
      <div className='cb-append-after-error-icons'>
        <PasskeyIssueIcon className='cb-append-after-error-icon' />
      </div>
      <div className='cb-p'>We detected you had an issue using your passkey.</div>
      <div className='cb-p'>Try adding another passkey to resolve the problem.</div>
      <Checkbox
        label={"Don't show this again"}
        checked={dontShowAgain}
        onChange={toggleDontShowAgain}
      />
      <div className='cb-append-after-error-cta'>
        <PrimaryButton
          isLoading={loading}
          onClick={() => void onSubmitClick()}
          className='cb-append-after-error-button'
        >
          Add passkey
        </PrimaryButton>
        <LinkButton
          onClick={() => void onClickSkip()}
          className='cb-append-after-error-fallback'
        >
          Skip
        </LinkButton>
      </div>
    </div>
  );
};

export default AppendAfterErrorScreen;
