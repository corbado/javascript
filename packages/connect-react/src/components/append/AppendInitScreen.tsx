import { ExcludeCredentialsMatchError, PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { AppendSituationCode, getAppendErrorMessage } from '../../types/situations';
import { StatefulLoader } from '../../utils/statefulLoader';
import AppendBenefits from './append-init/AppendBenetifs';
import AppendInitLoaded2 from './append-init/AppendInitLoaded2';
import AppendInitLoading from './append-init/AppendInitLoading';

export enum AppendInitState {
  SilentLoading,
  Loading,
  Loaded,
  ShowBenefits,
}

const AppendInitScreen = () => {
  const { config, navigateToScreen, handleErrorHard, handleErrorSoft, handleSkip, handleCredentialExistsError } =
    useAppendProcess();
  const { getConnectService } = useShared();
  const [attestationOptions, setAttestationOptions] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [appendLoading, setAppendLoading] = useState(false);
  const [appendInitState, setAppendInitState] = useState(AppendInitState.SilentLoading);
  const [skipping, setSkipping] = useState(false);
  const statefulLoader = useRef(
    new StatefulLoader(
      () => setAppendInitState(AppendInitState.Loading),
      () => {
        setAppendInitState(AppendInitState.Loaded);
      },
      () => {
        setAppendInitState(AppendInitState.Loaded);
      },
    ),
  );

  const simulateError = (): boolean => {
    const urlParams = new URLSearchParams(window.location.search);
    const maybeError = urlParams.get('cboSimulate');
    if (!maybeError) {
      return false;
    }

    // parse string to AppendSituationCode
    const typed = AppendSituationCode[maybeError as keyof typeof AppendSituationCode];
    void handleSituation(typed);

    return true;
  };

  useEffect(() => {
    const init = async (ac: AbortController) => {
      if (simulateError()) {
        return;
      }

      // get the time when the component is loaded (unix milliseconds)
      const loadedMs = Date.now();

      statefulLoader.current.start();
      const url = new URL(window.location.href);
      const invitationToken = url.searchParams.get('invitationToken');
      if (invitationToken) {
        getConnectService().setInvitation(invitationToken);
      }

      const res = await getConnectService().appendInit(ac);
      if (res.err) {
        if (res.val.ignore) {
          return;
        }

        return handleSituation(AppendSituationCode.CboApiNotAvailablePreAuthenticator);
      }

      if (!res.val.appendAllowed) {
        return handleSituation(AppendSituationCode.DeniedByPartialRollout);
      }

      let appendToken: string;
      try {
        appendToken = await config.appendTokenProvider();
      } catch {
        return handleSituation(AppendSituationCode.CtApiNotAvailablePreAuthenticator);
      }

      const startAppendRes = await getConnectService().startAppend(appendToken, loadedMs, ac);
      if (startAppendRes.err) {
        if (startAppendRes.val.ignore) {
          return;
        }

        return handleSituation(AppendSituationCode.CboApiNotAvailablePostAuthenticator);
      }

      if (startAppendRes.val.attestationOptions === '') {
        return handleSituation(AppendSituationCode.DeniedByPasskeyIntel);
      }

      if (startAppendRes.val.variant === 'after-hybrid') {
        navigateToScreen(AppendScreenType.AfterHybridLogin, {
          attestationOptions: startAppendRes.val.attestationOptions,
        });
        return;
      }

      if (startAppendRes.val.variant === 'after-error') {
        navigateToScreen(AppendScreenType.AfterError, { attestationOptions: startAppendRes.val.attestationOptions });
        return;
      }

      setAttestationOptions(startAppendRes.val.attestationOptions);
      statefulLoader.current.finish();
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
    if (appendLoading || skipping) {
      return;
    }

    setAppendLoading(true);
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

    setAppendLoading(false);
    navigateToScreen(AppendScreenType.Success, {
      aaguidName: res.val.passkeyOperation.aaguidDetails?.name,
      aaguidIcon: res.val.passkeyOperation.aaguidDetails?.iconLight,
    });
  }, [attestationOptions, config, getConnectService, appendLoading, skipping]);

  const handleSituation = async (situationCode: AppendSituationCode) => {
    log.debug(`situation: ${situationCode}`);

    const message = getAppendErrorMessage(situationCode);
    if (message) {
      setErrorMessage(message);
    }

    switch (situationCode) {
      case AppendSituationCode.CtApiNotAvailablePreAuthenticator:
      case AppendSituationCode.CboApiNotAvailablePreAuthenticator:
      case AppendSituationCode.CboApiNotAvailablePostAuthenticator:
        void handleErrorHard(situationCode, false);

        statefulLoader.current.finishWithError();
        break;
      case AppendSituationCode.ClientPasskeyOperationCancelled:
        void handleErrorSoft(situationCode, true);
        setAppendLoading(false);
        break;
      case AppendSituationCode.ClientExcludeCredentialsMatch:
        void handleCredentialExistsError();
        setAppendLoading(false);
        break;
      case AppendSituationCode.DeniedByPartialRollout:
      case AppendSituationCode.DeniedByPasskeyIntel:
        await handleSkip(situationCode, false);
        break;
      case AppendSituationCode.ExplicitSkipByUser:
        await handleSkip(situationCode, true);
        break;
    }
  };

  const onSkip = useCallback(() => {
    if (skipping || appendLoading) {
      return;
    }

    setSkipping(true);
    void handleSituation(AppendSituationCode.ExplicitSkipByUser);
  }, [skipping, appendLoading]);

  switch (appendInitState) {
    case AppendInitState.SilentLoading:
      return <></>;
    case AppendInitState.Loading:
      return <AppendInitLoading />;
    case AppendInitState.ShowBenefits:
      return <AppendBenefits onClick={() => setAppendInitState(AppendInitState.Loaded)} />;
    case AppendInitState.Loaded:
      return (
        <AppendInitLoaded2
          errorMessage={errorMessage}
          appendLoading={appendLoading}
          handleShowBenefits={() => setAppendInitState(AppendInitState.ShowBenefits)}
          handleSubmit={() => void handleSubmit()}
          handleSkip={() => onSkip()}
        />
      );
  }
};

export default AppendInitScreen;
