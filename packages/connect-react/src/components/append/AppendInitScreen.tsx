import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { FingerprintIcon } from '../shared/icons/FingerprintIcon';
import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { ShieldIcon } from '../shared/icons/ShieldIcon';
import { LinkButton } from '../shared/LinkButton';
import { Notification } from '../shared/Notification';
import { PasskeyInfoListItem } from '../shared/PasskeyInfoListItem';
import { PrimaryButton } from '../shared/PrimaryButton';
import { SecondaryButton } from '../shared/SecondaryButton';

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

        return;
      }

      config.onLoaded('loaded successfully');
      if (!res.val.appendAllowed) {
        setAppendAllowed(false);
        config.onSkip();

        return;
      }

      const appendToken = await config.appendTokenProvider();

      const startAppendRes = await getConnectService().startAppend(appendToken, ac);
      if (startAppendRes.err) {
        if (startAppendRes.val.ignore) {
          return;
        }

        setAppendAllowed(false);
        config.onSkip();

        return;
      }

      if (startAppendRes.val.attestationOptions === '') {
        setAppendAllowed(false);
        config.onSkip();

        return;
      }

      setAttestationOptions(startAppendRes.val.attestationOptions);
      setAppendAllowed(true);
    };

    console.log('init AppendInitScreen');

    const abortController = new AbortController();
    init(abortController).catch(e => {
      console.error(`init error: ${e}`);
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
      <div className='cb-h2'>Activate a passkey</div>
      <div className='cb-h3'>Fast and secure sign-in with passkeys</div>
      {error ? <Notification message={error} /> : null}
      <div className='cb-append-info-list'>
        <PasskeyInfoListItem
          title='No more forgotten passwords'
          description='Sign in easily with your face, fingerprint or pin that’s saved to your device'
          icon={<FingerprintIcon platform='default' />}
        />
        <PasskeyInfoListItem
          title='Next-generation security'
          description='Forget the fear of stolen passwords'
          icon={<ShieldIcon />}
        />
        <PasskeyInfoListItem
          title='Syncs across your devices'
          description='Faster sign-in from your password manager'
          icon={<PasskeyIcon />}
        />
      </div>
      <div className='cb-connect-append-button'>
        <PrimaryButton
          type='submit'
          isLoading={primaryButtonLoading}
          onClick={() => void handleSubmit()}
        >
          Activate
        </PrimaryButton>
      </div>
      <div className='cb-connect-append-button'>
        <SecondaryButton
          type='submit'
          onClick={() => void navigateToScreen(AppendScreenType.Benefits)}
        >
          Learn more
        </SecondaryButton>
      </div>
      <div className='cb-connect-append-button'>
        <LinkButton onClick={() => void config.onSkip()}>Skip for now</LinkButton>
      </div>
    </>
  );
};

export default AppendInitScreen;
