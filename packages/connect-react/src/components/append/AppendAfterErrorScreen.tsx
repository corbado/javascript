import React, { useCallback, useState } from 'react';

import log from 'loglevel';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';
import { Notification } from '../shared/Notification';
import useAppendProcess from '../../hooks/useAppendProcess';
import { PasskeyIssueIcon } from '../shared/icons/PasskeyIssueIcon';

const AppendAfterErrorScreen = (attestationOptions: string) => {
  const { config, navigateToScreen } = useAppendProcess();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { getConnectService } = useShared();

  const handleSubmit = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(undefined);

    const res = await getConnectService().completeAppend(attestationOptions);
    if (res.err) {
      log.error('error:', res.val);
      setLoading(false);
      setError('Passkey operation was cancelled or timed out.');

      return;
    }

    setLoading(false);
    navigateToScreen(AppendScreenType.Success);
  }, [getConnectService, config, navigateToScreen, loading]);

  return (
    <div className='cb-append-after-error-container'>
      <div className='cb-h1'>Issues using passkeys?</div>
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
      <div className='cb-append-after-error-cta'>
        <PrimaryButton
          isLoading={loading}
          onClick={() => void handleSubmit()}
          className='cb-append-after-error-button'
        >
          Add passkey
        </PrimaryButton>
        <LinkButton
          onClick={() => config.onSkip()}
          className='cb-append-after-error-fallback'
        >
          Skip
        </LinkButton>
      </div>
    </div>
  );
};

export default AppendAfterErrorScreen;
