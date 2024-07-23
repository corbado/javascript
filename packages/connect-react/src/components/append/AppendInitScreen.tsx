import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { Button } from '../shared/Button';
import { FingerprintIcon } from '../shared/icons/FingerprintIcon';
import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { SuccessIcon } from '../shared/icons/SuccessIcon';
import { LinkButton } from '../shared/LinkButton';
import { Notification } from '../shared/Notification';
import { PasskeyInfoListItem } from '../shared/PasskeyInfoListItem';
import { PrimaryButton } from '../shared/PrimaryButton';

const AppendInitScreen = () => {
  const { config, navigateToScreen } = useAppendProcess();
  const { getConnectService } = useShared();
  const [primaryButtonLoading, setPrimaryButtonLoading] = useState(false);
  const [appendAllowed, setAppendAllowed] = useState(false);
  const [attestationOptions, setAttestationOptions] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const init = async (ac: AbortController) => {
      const res = await getConnectService().appendInit(ac);
      if (res.err) {
        if (res.val.ignore) {
          return;
        }

        setAppendAllowed(false);
        config.onSkip();

        config.onError?.('PasskeyNotSupported');

        return;
      }

      config.onLoaded('loaded successfully');
      if (!res.val.appendAllowed) {
        setAppendAllowed(false);
        config.onSkip();

        config.onError?.('PasskeyNotSupported');

        return;
      }

      const appendToken = await config.appendTokenProvider();

      const startAppendRes = await getConnectService().startAppend(appendToken, ac);
      if (startAppendRes.err) {
        if (startAppendRes.val.ignore) {
          return;
        }

        if (startAppendRes.val instanceof PasskeyChallengeCancelledError) {
          config.onError?.('PasskeyChallengeAborted');
        }

        setAppendAllowed(false);
        config.onSkip();

        return;
      }

      if (startAppendRes.val.attestationOptions === '') {
        config.onError?.('PasskeyAlreadyExistsOnDevice');
        setAppendAllowed(false);
        config.onSkip();

        return;
      }

      setAttestationOptions(startAppendRes.val.attestationOptions);
      setAppendAllowed(true);
    };

    log.debug('init AppendInitScreen');

    const abortController = new AbortController();
    init(abortController).catch(e => {
      log.error(`init error: ${e}`);
    });

    return () => {
      abortController.abort();
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    setPrimaryButtonLoading(true);
    setError(undefined);

    const res = await getConnectService().completeAppend(attestationOptions);
    if (res.err) {
      log.error('error:', res.val);
      setPrimaryButtonLoading(false);
      setError('Passkey operation was cancelled or timed out.');

      return;
    }

    setPrimaryButtonLoading(false);
    navigateToScreen(AppendScreenType.Success);
  }, [attestationOptions, config, getConnectService]);

  // when passkey based login is not allowed, our component just returns an empty div
  if (!appendAllowed) {
    return <div></div>;
  }

  return (
    <>
      <div className='cb-append-header'>
        <h2 className='cb-h2'>Activate a passkey</h2>
        <div className='cb-append-skip-container'>
          <LinkButton
            className='cb-append-skip'
            onClick={() => config.onSkip()}
          >
            Skip
          </LinkButton>
        </div>
      </div>
      <div className='cb-h3'>Fast and secure sign-in with passkeys</div>
      {error ? (
        <Notification
          className='cb-error-notification'
          message={error}
        />
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
          onClick={() => void navigateToScreen(AppendScreenType.Benefits)}
          className='cb-outline-button'
        >
          Learn more
        </Button>
        <PrimaryButton
          isLoading={primaryButtonLoading}
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
