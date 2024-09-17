import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { FaceIdIcon } from '../shared/icons/FaceIdIcon';
import { FingerprintIcon } from '../shared/icons/FingerprintIcon';
import { PasskeyLoginIcon } from '../shared/icons/PasskeyLoginIcon';
import { LinkButton } from '../shared/LinkButton';
import { PrimaryButton } from '../shared/PrimaryButton';

const LoginErrorScreenSoft = () => {
  const { config, navigateToScreen, currentIdentifier, loadedMs } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const resStart = await getConnectService().loginStart(currentIdentifier, PasskeyLoginSource.ErrorSoft, loadedMs);
    if (resStart.err) {
      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
    }

    const resFinish = await getConnectService().loginContinue(resStart.val);
    if (resFinish.err) {
      if (resFinish.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    try {
      await config.onComplete(resFinish.val.session);
      setLoading(false);
    } catch {
      handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  };

  const handleSituation = (situationCode: LoginSituationCode) => {
    log.debug(`situation: ${situationCode}`);

    const identifier = currentIdentifier;
    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.CtApiNotAvailablePostAuthenticator:
      case LoginSituationCode.CboApiNotAvailablePostAuthenticator:
        navigateToScreen(LoginScreenType.Invisible);
        config.onFallback(identifier, message);
        void getConnectService().recordEventLoginErrorUntyped();

        setLoading(false);
        break;
      case LoginSituationCode.ClientPasskeyOperationCancelled:
        navigateToScreen(LoginScreenType.ErrorHard);
        config.onError?.(situationCode.toString());
        void getConnectService().recordEventLoginError();

        setLoading(false);
        break;
      case LoginSituationCode.ExplicitFallbackByUser:
        navigateToScreen(LoginScreenType.Invisible);
        config.onFallback(identifier, message);

        void getConnectService().recordEventLoginExplicitAbort();
        break;
    }
  };

  return (
    <>
      <div className='cb-h2'>Use your passkey to confirm it’s really you!</div>
      <div className='cb-login-error-soft-icons'>
        <FingerprintIcon platform='default' />
        <FaceIdIcon platform='default' />
        <PasskeyLoginIcon />
      </div>
      <div className='cb-p'>Your device will ask you or your fingerprint, face or screen lock.</div>
      <PrimaryButton
        onClick={() => void handleSubmit()}
        isLoading={loading}
        className='cb-login-error-soft-button'
      >
        Login with passkey
      </PrimaryButton>
      <LinkButton
        onClick={() => handleSituation(LoginSituationCode.ExplicitFallbackByUser)}
        className='cb-login-error-soft-fallback'
      >
        Use password instead
      </LinkButton>
    </>
  );
};

export default LoginErrorScreenSoft;
