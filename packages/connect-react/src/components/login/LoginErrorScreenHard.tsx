import { PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import log from 'loglevel';
import React, { useState } from 'react';

import useLoginProcess from '../../hooks/useLoginProcess';
import useShared from '../../hooks/useShared';
import { LoginScreenType } from '../../types/screenTypes';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { ErrorIcon } from '../shared/icons/ErrorIcon';
import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { LinkButton } from '../shared/LinkButton';
import { OutlineButton } from '../shared/OutlineButton';
import { PrimaryButton } from '../shared/PrimaryButton';

const LoginErrorScreenHard = () => {
  const { config, navigateToScreen, currentIdentifier, loadedMs } = useLoginProcess();
  const { getConnectService } = useShared();
  const [loading, setLoading] = useState(false);
  const [hardErrorCount, setHardErrorCount] = useState(1);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const resStart = await getConnectService().loginStart(currentIdentifier, PasskeyLoginSource.ErrorHard, loadedMs);
    if (resStart.err) {
      return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
    }

    const resFinish = await getConnectService().loginContinue(resStart.val);
    if (resFinish.err) {
      if (resFinish.val instanceof PasskeyChallengeCancelledError) {
        if (hardErrorCount >= 3) {
          return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelledTooManyTimes);
        }

        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    setLoading(false);

    try {
      await config.onComplete(resFinish.val.session);
    } catch {
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
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
      case LoginSituationCode.ClientPasskeyOperationCancelledTooManyTimes:
        navigateToScreen(LoginScreenType.Invisible);
        config.onFallback(identifier, message);
        void getConnectService().recordEventLoginError();

        setLoading(false);
        break;

      case LoginSituationCode.ClientPasskeyOperationCancelled:
        setHardErrorCount(hardErrorCount + 1);
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
      <div className='cb-h2'>Something went wrong</div>
      <div className='cb-login-error-hard-icons'>
        <PasskeyIcon />
        <ErrorIcon className='cb-login-error-hard-icons-error' />
      </div>
      <div className='cb-p'>Login with passkeys was not possible. Try again or skip the process for now.</div>

      {config.onSignupClick && (
        <LinkButton
          onClick={() => config.onSignupClick!()}
          className='cb-login-error-hard-help'
        >
          Need help ?
        </LinkButton>
      )}

      <div className='cb-login-error-hard-cta'>
        <OutlineButton onClick={() => handleSituation(LoginSituationCode.ExplicitFallbackByUser)}>
          Skip passkey login
        </OutlineButton>
        <PrimaryButton
          onClick={() => void handleSubmit()}
          isLoading={loading}
        >
          Try again
        </PrimaryButton>
      </div>
    </>
  );
};

export default LoginErrorScreenHard;
