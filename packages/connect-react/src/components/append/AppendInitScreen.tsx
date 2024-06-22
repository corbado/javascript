import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import { PrimaryButton } from '../shared/PrimaryButton';
import { SecondaryButton } from '../shared/SecondaryButton';
import { PasskeyInfoListItem } from '../shared/PasskeyInfoListItem';
import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { FingerprintIcon } from '../shared/icons/FingerprintIcon';
import { ShieldIcon } from '../shared/icons/ShieldIcon';
import { LinkButton } from '../shared/LinkButton';
import { AppendScreenType } from '../../types/ScreenType';

const AppendInitScreen = () => {
  const { config, navigateToScreen, getConnectService } = useAppendProcess();
  const [loading, setLoading] = useState(false);
  const [appendAllowed, setAppendAllowed] = useState(true);
  const [appendToken, setAppendToken] = useState('');

  useEffect(() => {
    const init = async (ac: AbortController) => {
      const res = await getConnectService().appendInit(ac);
      if (res.err) {
        log.error(res.val);
        return;
      }

      config.onLoaded('loaded successfully');
      if (!res.val.appendAllowed) {
        setAppendAllowed(false);
        config.onSkip();

        return;
      }

      const appendToken = await config.appendTokenProvider();
      setAppendToken(appendToken);
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
    setLoading(true);

    const res = await getConnectService().append(appendToken);
    if (res.err) {
      log.error('error:', res.val);
      setLoading(false);
      config.onSkip();

      return;
    }

    setLoading(false);
    navigateToScreen(AppendScreenType.Success);
  }, [appendToken, config, getConnectService]);

  // when passkey based login is not allowed, our component just returns an empty div
  if (!appendAllowed) {
    return <div></div>;
  }

  return (
    <>
      <div className='cb-h2'>Activate a passkey</div>
      <div className='cb-h3'>Fast and secure sign-in with passkeys</div>
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
          isLoading={loading}
          onClick={() => void handleSubmit()}
        >
          Activate your passkey
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
