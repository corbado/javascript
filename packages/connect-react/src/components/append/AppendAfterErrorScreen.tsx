import { ConnectRequestTimedOut, ExcludeCredentialsMatchError } from '@corbado/web-core';
import log from 'loglevel';
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
  const { config, navigateToScreen } = useAppendProcess();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { getConnectService } = useShared();

  const handleSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(undefined);

    const res = await getConnectService().completeAppend(attestationOptions);
    if (res.err) {
      if (res.val instanceof ExcludeCredentialsMatchError) {
        await getConnectService().recordEventUserAppendAfterLoginErrorBlacklisted();
        void config.onComplete();

        return;
      }

      if (res.val instanceof ConnectRequestTimedOut) {
        config.onSkip();

        return;
      }
      log.error('error:', res.val);
      setLoading(false);
      setError('Passkey operation was cancelled or timed out.');

      return;
    }

    if (dontShowAgain) {
      const createEventRes = await getConnectService().recordEventUserAppendAfterLoginErrorBlacklisted();

      if (createEventRes?.err) {
        if (createEventRes.val instanceof ConnectRequestTimedOut) {
          config.onSkip();

          return;
        }
        log.error('error:', createEventRes.val);
      }
    }

    setLoading(false);
    navigateToScreen(AppendScreenType.Success);
  }, [getConnectService, config, navigateToScreen, loading, dontShowAgain]);

  const handleSkip = async () => {
    if (dontShowAgain) {
      const createEventRes = await getConnectService().recordEventUserAppendAfterLoginErrorBlacklisted();

      if (createEventRes?.err) {
        if (createEventRes.val instanceof ConnectRequestTimedOut) {
          config.onSkip();

          return;
        }
        log.error('error:', createEventRes.val);
      }
    }

    config.onSkip();
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
          onClick={() => void handleSubmit()}
          className='cb-append-after-error-button'
        >
          Add passkey
        </PrimaryButton>
        <LinkButton
          onClick={() => void handleSkip()}
          className='cb-append-after-error-fallback'
        >
          Skip
        </LinkButton>
      </div>
    </div>
  );
};

export default AppendAfterErrorScreen;
