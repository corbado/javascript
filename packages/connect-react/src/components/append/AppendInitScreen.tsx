import { ExcludeCredentialsMatchError, PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { AppendSituationCode, getAppendErrorMessage } from '../../types/situations';
import { StatefulLoader } from '../../utils/statefulLoader';
import { Button } from '../shared/Button';
import { FingerprintIcon } from '../shared/icons/FingerprintIcon';
import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { SuccessIcon } from '../shared/icons/SuccessIcon';
import { LinkButton } from '../shared/LinkButton';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Notification } from '../shared/Notification';
import { PasskeyInfoListItem } from '../shared/PasskeyInfoListItem';
import { PrimaryButton } from '../shared/PrimaryButton';
import AppendBenefitsScreen from './AppendBenetifsScreen';

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
    navigateToScreen(AppendScreenType.Success);
  }, [attestationOptions, config, getConnectService]);

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
        void handleErrorHard(situationCode);

        statefulLoader.current.finishWithError();
        break;
      case AppendSituationCode.ClientPasskeyOperationCancelled:
        void handleErrorSoft(situationCode);
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

  switch (appendInitState) {
    case AppendInitState.SilentLoading:
      return <></>;
    case AppendInitState.Loading:
      return (
        <div className='cb-passkey-list-loader-container'>
          <LoadingSpinner className='cb-passkey-list-loader' />
        </div>
      );
    case AppendInitState.ShowBenefits:
      return <AppendBenefitsScreen onClick={() => setAppendInitState(AppendInitState.Loaded)} />;
    case AppendInitState.Loaded:
      return (
        <>
          <div className='cb-append-header'>
            <h2 className='cb-h2'>Activate a passkey</h2>
            <div className='cb-append-skip-container'>
              <LinkButton
                className='cb-append-skip'
                onClick={() => void handleSituation(AppendSituationCode.ExplicitSkipByUser)}
              >
                Skip
              </LinkButton>
            </div>
          </div>
          <div className='cb-h3'>Fast and secure sign-in with passkeys</div>
          {errorMessage ? (
            <Notification
              className='cb-error-notification'
              message={errorMessage}
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
              onClick={() => setAppendInitState(AppendInitState.ShowBenefits)}
              className='cb-outline-button'
            >
              Learn more
            </Button>
            <PrimaryButton
              isLoading={appendLoading}
              type='submit'
              onClick={() => void handleSubmit()}
              className='cb-append-activate-button'
            >
              Activate passkey
            </PrimaryButton>
          </div>
        </>
      );
  }
};

export default AppendInitScreen;
