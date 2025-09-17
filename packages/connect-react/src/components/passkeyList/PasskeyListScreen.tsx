import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { ConnectError, Passkey } from '@corbado/web-core';
import { ConnectErrorType } from '@corbado/web-core';
import log from 'loglevel';
import React, { useEffect, useRef, useState } from 'react';

import useManageProcess from '../../hooks/useManageProcess';
import useModal from '../../hooks/useModal';
import useShared from '../../hooks/useShared';
import { getPasskeyListErrorMessage, PasskeyListSituationCode } from '../../types/situations';
import { ConnectTokenType } from '../../types/tokens';
import { StatefulLoader } from '../../utils/statefulLoader';
import AlreadyExistingModal from './AlreadyExistingModal';
import DeleteModal from './DeleteModal';
import PasskeyAppendNotSupportedLightModal from './PasskeyAppendNotSupportedLightModal';
import PasskeyAppendNotSupportedModal from './PasskeyAppendNotSupportedModal';
import PasskeyList, { PasskeyListState } from './PasskeyList';

const PasskeyListScreen = () => {
  const { config } = useManageProcess();
  const { setPasskeyListToken, passkeyListToken } = useManageProcess();
  const { show, hide } = useModal();
  const { getConnectService } = useShared();

  const [passkeyList, setPasskeyList] = useState<Passkey[]>([]);
  const [passkeyListState, setPasskeyListState] = useState<PasskeyListState>(PasskeyListState.SilentLoading);
  const [appendLoading, setAppendLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appendAllowed, setAppendAllowed] = useState<boolean>(false);
  const statefulLoader = useRef(
    new StatefulLoader(
      () => setPasskeyListState(PasskeyListState.Loading),
      () => setPasskeyListState(PasskeyListState.Loaded),
      () => setPasskeyListState(PasskeyListState.LoadingFailed),
    ),
  );

  const simulateError = (): boolean => {
    const urlParams = new URLSearchParams(window.location.search);
    const maybeError = urlParams.get('cboSimulate');
    if (!maybeError) {
      return false;
    }

    // parse string to AppendSituationCode
    const typed = PasskeyListSituationCode[maybeError as keyof typeof PasskeyListSituationCode];
    handleSituation(typed);

    return true;
  };

  useEffect(() => {
    const init = async (ac: AbortController) => {
      if (simulateError()) {
        return;
      }

      statefulLoader.current.start();
      log.debug('running init');
      const res = await getConnectService().manageInit(ac);
      log.debug(res.val);
      if (res.err) {
        if (res.val.type === ConnectErrorType.Cancel) {
          return;
        }

        return handleSituation(PasskeyListSituationCode.CboApiNotAvailableDuringInitialLoad, res.val);
      }

      // we use the manageAllowed flag to determine if appending a passkey is allowed
      setAppendAllowed(res.val.manageAllowed);
      await getPasskeyList(config);
    };

    const ac = new AbortController();
    void init(ac);

    return () => {
      ac.abort();
      getConnectService().dispose();
    };
  }, [getConnectService]);

  const onDeleteClick = async (credentialsId?: string) => {
    if (!credentialsId) {
      return;
    }

    let deleteToken;
    try {
      deleteToken = await config.connectTokenProvider(ConnectTokenType.PasskeyDelete);
    } catch {
      return handleSituation(PasskeyListSituationCode.CtApiNotAvailablePreDelete);
    }

    const deletePasskeyRes = await getConnectService().manageDelete(deleteToken, credentialsId);
    if (deletePasskeyRes.err) {
      return handleSituation(PasskeyListSituationCode.CboApiNotAvailableDuringDelete, deletePasskeyRes.val);
    }

    await getPasskeyList(config);
    hide();
  };

  const onAppendClick = async () => {
    if (appendLoading) {
      return;
    }

    setAppendLoading(true);
    setErrorMessage(null);
    let appendToken;
    try {
      appendToken = await config.connectTokenProvider(ConnectTokenType.PasskeyAppend);
    } catch {
      return handleSituation(PasskeyListSituationCode.CtApiNotAvailablePreAuthenticator);
    }

    const loadedMs = Date.now();
    const startAppendRes = await getConnectService().startAppend(appendToken, loadedMs, undefined, true);
    if (startAppendRes.err) {
      return handleSituation(PasskeyListSituationCode.CboApiNotAvailablePreAuthenticator, startAppendRes.val);
    }

    if (!startAppendRes.val.attestationOptions) {
      if (startAppendRes.val.isRestrictedBrowser) {
        return handleSituation(PasskeyListSituationCode.CboApiPasskeysNotSupportedLight);
      }

      return handleSituation(PasskeyListSituationCode.CboApiPasskeysNotSupported);
    }

    const res = await getConnectService().completeAppend(startAppendRes.val.attestationOptions);
    if (res.err) {
      if (res.val.type === ConnectErrorType.Cancel) {
        return handleSituation(PasskeyListSituationCode.ClientPasskeyOperationCancelled, res.val);
      }

      if (res.val.type === ConnectErrorType.ExcludeCredentialsMatch) {
        return handleSituation(PasskeyListSituationCode.ClientExcludeCredentialsMatch, res.val);
      }

      return handleSituation(PasskeyListSituationCode.CboApiNotAvailablePostAuthenticator, res.val);
    }

    log.debug('get passkey list');
    await getPasskeyList(config);
    setAppendLoading(false);
  };

  const fetchListToken = async (config: CorbadoConnectPasskeyListConfig) =>
    await config.connectTokenProvider(ConnectTokenType.PasskeyList);

  const getPasskeyList = async (config: CorbadoConnectPasskeyListConfig, triggerSignalAllAccepted = false) => {
    let listTokenRes = passkeyListToken;
    if (!listTokenRes) {
      try {
        listTokenRes = await fetchListToken(config);
      } catch {
        return handleSituation(PasskeyListSituationCode.CtApiNotAvailableDuringInitialLoad);
      }
    }

    const passkeyList = await getConnectService().manageList(listTokenRes, triggerSignalAllAccepted);
    if (passkeyList.err) {
      return handleSituation(PasskeyListSituationCode.CboApiNotAvailableDuringInitialLoad, passkeyList.val);
    }

    setPasskeyListToken(listTokenRes);
    setPasskeyList(passkeyList.val.passkeys);
    statefulLoader.current.finish();
  };

  const handleSituation = (situationCode: PasskeyListSituationCode, error?: ConnectError) => {
    const messageCode = `situation: ${situationCode}`;
    log.debug(messageCode);

    const message = getPasskeyListErrorMessage(situationCode);
    switch (situationCode) {
      case PasskeyListSituationCode.ClientExcludeCredentialsMatch:
        setAppendLoading(false);
        void getConnectService().recordEventAppendCredentialExistsError(`${messageCode} ${error?.track()}`);
        show(<AlreadyExistingModal hide={hide} />);
        break;
      case PasskeyListSituationCode.CboApiPasskeysNotSupportedLight:
        setAppendLoading(false);
        show(<PasskeyAppendNotSupportedLightModal hide={hide} />);
        break;
      case PasskeyListSituationCode.CboApiPasskeysNotSupported:
        setAppendLoading(false);
        show(<PasskeyAppendNotSupportedModal hide={hide} />);
        break;
      case PasskeyListSituationCode.CboApiNotAvailableDuringInitialLoad:
      case PasskeyListSituationCode.CtApiNotAvailableDuringInitialLoad:
        statefulLoader.current.onLoadingError();

        if (message) {
          setErrorMessage(message);
        }

        void getConnectService().recordEventManageErrorUnexpected(`${messageCode} ${error?.track()}`);
        break;
      case PasskeyListSituationCode.CtApiNotAvailablePreDelete:
      case PasskeyListSituationCode.CboApiNotAvailableDuringDelete:
        hide();
        if (message) {
          setErrorMessage(message);
        }

        void getConnectService().recordEventManageErrorUnexpected(`${messageCode} ${error?.track()}`);
        break;
      case PasskeyListSituationCode.CtApiNotAvailablePreAuthenticator:
      case PasskeyListSituationCode.CboApiNotAvailablePreAuthenticator:
      case PasskeyListSituationCode.CboApiNotAvailablePostAuthenticator:
      case PasskeyListSituationCode.ClientPasskeyOperationCancelled:
      default:
        setAppendLoading(false);
        if (message) {
          setErrorMessage(message);
        }

        void getConnectService().recordEventManageErrorUnexpected(`${messageCode} ${error?.track()}`);
    }
  };

  return (
    <PasskeyList
      passkeys={passkeyList}
      onDeleteClick={passkey => {
        setErrorMessage(null);
        show(
          <DeleteModal
            passkey={passkey}
            onDeleteClick={onDeleteClick}
            hide={hide}
          />,
        );
      }}
      state={passkeyListState}
      onAppendClick={appendAllowed ? () => void onAppendClick() : undefined}
      appendLoading={appendLoading}
      hardErrorMessage={errorMessage}
    />
  );
};

export default PasskeyListScreen;
