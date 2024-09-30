import { ConnectUserNotFound, PasskeyChallengeCancelledError, PasskeyLoginSource } from '@corbado/web-core';
import type { ConnectLoginStartRsp } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import React, { useEffect, useRef, useState } from 'react';

import useLoginSecondFactorProcess from '../../hooks/useLoginSecondFactorProcess';
import useShared from '../../hooks/useShared';
import { Flags } from '../../types/flags';
import { getLoginErrorMessage, LoginSituationCode } from '../../types/situations';
import { StatefulLoader } from '../../utils/statefulLoader';
import { LoginInitState } from '../login/LoginInitScreen';
import { FaceIdIcon } from '../shared/icons/FaceIdIcon';
import { FingerprintIcon } from '../shared/icons/FingerprintIcon';
import { PasskeyLoginIcon } from '../shared/icons/PasskeyLoginIcon';
import { LinkButton } from '../shared/LinkButton';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { PrimaryButton } from '../shared/PrimaryButton';

const InitScreen = () => {
  const { config, setFlags, loadedMs } = useLoginSecondFactorProcess();
  const [loginInitState, setLoginInitState] = useState(LoginInitState.SilentLoading);
  const [loginStartRes, setLoginStartRes] = useState<ConnectLoginStartRsp | undefined>();
  const [actionLoading, setActionLoading] = useState(false);
  const { sharedConfig, getConnectService } = useShared();
  const statefulLoader = useRef(
    new StatefulLoader(
      () => setLoginInitState(LoginInitState.Loading),
      () => {
        config.onLoaded('loading finished');
        setLoginInitState(LoginInitState.Loaded);
      },
      () => {
        config.onLoaded('loading finished');
        setLoginInitState(LoginInitState.Loaded);
      },
    ),
  );

  useEffect(() => {
    const init = async (ac: AbortController) => {
      statefulLoader.current.start();
      const res = await getConnectService().loginInit(ac);
      if (res.err) {
        if (res.val.ignore) {
          return;
        }

        statefulLoader.current.finishWithError();
        return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
      }

      let connectToken = '';
      try {
        connectToken = await config.loginTokenProvider();
      } catch {
        // TODO: handle error
      }

      // we load flags from backend first, then we override them with the ones that are specified in the component's config
      const flags = new Flags(res.val.flags);
      if (sharedConfig.flags) {
        flags.addFlags(sharedConfig.flags);
      }
      setFlags(flags);

      if (!res.val.loginAllowed) {
        return handleSituation(LoginSituationCode.DeniedByPartialRollout);
      }

      const resStart = await getConnectService().loginStart(
        '',
        PasskeyLoginSource.TextField,
        loadedMs,
        connectToken,
        ac,
      );
      if (resStart.err) {
        if (resStart.val.ignore) {
          return;
        }

        if (resStart.val instanceof ConnectUserNotFound) {
          return handleSituation(LoginSituationCode.UserNotFound);
        }

        return handleSituation(LoginSituationCode.CboApiNotAvailablePreAuthenticator);
      }

      setLoginStartRes(resStart.val);

      statefulLoader.current.finish();
    };

    log.debug('useEffect init-screen');
    const ac = new AbortController();
    void init(ac);

    return () => {
      log.debug('useEffect cleanup init-screen');
      ac.abort();
      getConnectService().dispose();
    };
  }, [getConnectService]);

  const handleSubmit = async () => {
    if (actionLoading || !loginStartRes) {
      return;
    }

    setActionLoading(true);
    const res = await getConnectService().loginContinue(loginStartRes);
    if (res.err) {
      if (res.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(LoginSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(LoginSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    console.log('loginContinue', res.val);

    try {
      await config.onComplete(res.val.session);
    } catch {
      return handleSituation(LoginSituationCode.CtApiNotAvailablePostAuthenticator);
    }
  };

  const handleSituation = (situationCode: LoginSituationCode) => {
    log.debug(`situation: ${situationCode}`);

    const message = getLoginErrorMessage(situationCode);

    switch (situationCode) {
      case LoginSituationCode.ExplicitFallbackByUser:
        config.onFallback(message);

        void getConnectService().recordEventLoginExplicitAbort();
        break;
      default:
        config.onFallback(message);
        break;
    }
  };

  switch (loginInitState) {
    case LoginInitState.SilentLoading:
      return <></>;
    case LoginInitState.Loading:
      return (
        <div className='cb-login-loader-container'>
          <LoadingSpinner className='cb-login-loader' />
        </div>
      );
    case LoginInitState.Loaded:
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
            isLoading={actionLoading}
            className='cb-login-error-soft-button'
          >
            Login with passkey
          </PrimaryButton>
          <LinkButton
            onClick={() => handleSituation(LoginSituationCode.ExplicitFallbackByUser)}
            className='cb-login-error-soft-fallback'
          >
            Receive an SMS instead
          </LinkButton>
        </>
      );
  }
};

export default InitScreen;
