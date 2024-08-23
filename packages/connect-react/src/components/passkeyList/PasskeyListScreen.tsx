import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { CorbadoError, Passkey } from '@corbado/web-core';
import {
  ConnectRequestTimedOut,
  ExcludeCredentialsMatchError,
  PasskeyChallengeCancelledError,
} from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useLoading from '../../hooks/useLoading';
import useManageProcess from '../../hooks/useManageProcess';
import useModal from '../../hooks/useModal';
import useShared from '../../hooks/useShared';
import { ManageScreenType } from '../../types/screenTypes';
import { ConnectTokenType } from '../../types/tokens';
import aaguidMappings from '../../utils/aaguidMappings';
import { CrossIcon } from '../shared/icons/CrossIcon';
import { PasskeyListItem } from '../shared/PasskeyListItem';
import { PrimaryButton } from '../shared/PrimaryButton';
import { SecondaryButton } from '../shared/SecondaryButton';
import PasskeyList from './PasskeyList';

const REQUEST_TIMEOUT_ERROR_MESSAGE =
  'Something went wrong. Please check if you can access the internet and try again later';

const PasskeyListScreen = () => {
  const { navigateToScreen, config } = useManageProcess();
  const { setPasskeyListToken, passkeyListToken } = useManageProcess();
  const { show, hide } = useModal();
  const { getConnectService } = useShared();

  const [passkeyList, setPasskeyList] = useState<Passkey[]>([]);
  const { loading, startLoading, finishLoading, isInitialLoadingStarted } = useLoading();
  const [deletePending, setDeletePending] = useState<boolean>(false);
  const [appendPending, setAppendPending] = useState<boolean>(false);
  const [hardErrorMessage, setHardErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async (ac: AbortController) => {
      startLoading();
      log.debug('running init');
      const res = await getConnectService().manageInit(ac);

      log.debug(res.val);

      if (res.err) {
        finishLoading();

        if (res.val instanceof ConnectRequestTimedOut) {
          setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);
          return;
        }

        log.error(res.val);
        return;
      }

      if (!res.val.manageAllowed) {
        finishLoading();
        log.debug('manage passkeys is not allowed');
        navigateToScreen(ManageScreenType.Invisible);
        return;
      }

      await getPasskeyList(config);
      finishLoading();
    };

    const ac = new AbortController();
    void init(ac);

    return () => {
      ac.abort();
      getConnectService().dispose();
    };
  }, [getConnectService]);

  const onDeleteClick = useCallback(
    async (credentialsId?: string) => {
      if (deletePending) {
        return;
      }

      setDeletePending(true);
      hide();
      if (!credentialsId) {
        return;
      }

      let deleteToken;

      try {
        deleteToken = await config.connectTokenProvider(ConnectTokenType.PasskeyDelete);
      } catch {
        setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);

        finishLoading();
        setDeletePending(false);
        return;
      }

      const deletePasskeyRes = await getConnectService().manageDelete(deleteToken, credentialsId);

      if (deletePasskeyRes.err) {
        if (deletePasskeyRes.val instanceof ConnectRequestTimedOut) {
          setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);
        }

        finishLoading();
        setDeletePending(false);
        return;
      }

      await getPasskeyList(config);
      setDeletePending(false);
    },
    [config, passkeyListToken, deletePending],
  );

  const onAppendClick = useCallback(async () => {
    if (appendPending) {
      return;
    }

    setAppendPending(true);
    setHardErrorMessage(null);

    let appendToken;
    try {
      appendToken = await config.connectTokenProvider(ConnectTokenType.PasskeyAppend);
    } catch {
      setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);
      setAppendPending(false);
      return;
    }

    const loadedMs = Date.now();
    const startAppendRes = await getConnectService().startAppend(appendToken, loadedMs, undefined, true);
    if (startAppendRes.err || !startAppendRes.val) {
      handlePreWebauthnError(startAppendRes.err ? startAppendRes.val : undefined);
      return;
    }

    const res = await getConnectService().completeAppend(startAppendRes.val.attestationOptions);
    if (res.err) {
      handlePostWebauthnError(res.val);
      return;
    }

    log.debug('get passkey list');
    await getPasskeyList(config);
    setAppendPending(false);
  }, [config, passkeyListToken, appendPending]);

  const handlePreWebauthnError = (error?: CorbadoError) => {
    setAppendPending(false);

    if (error instanceof ConnectRequestTimedOut) {
      setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);
      return;
    }

    setHardErrorMessage(
      'An unexpected error occurred. Please reload this page and try again. If the problem persists, please contact support.',
    );
  };

  const handlePostWebauthnError = (error: CorbadoError) => {
    setAppendPending(false);

    if (error instanceof PasskeyChallengeCancelledError) {
      setHardErrorMessage('Passkey creation was interrupted. You can try again by clicking the "Add passkey" button.');
      return;
    }

    if (error instanceof ExcludeCredentialsMatchError) {
      void getConnectService().recordEventAppendCredentialExistsError();
      show(AlreadyExistingModal());
      return;
    }

    if (error instanceof ConnectRequestTimedOut) {
      setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);
      return;
    }

    setHardErrorMessage(
      'An unexpected error occurred. Please reload this page and try again. If the problem persists, please contact support.',
    );
  };

  const fetchListToken = async (config: CorbadoConnectPasskeyListConfig) =>
    await config.connectTokenProvider(ConnectTokenType.PasskeyList);

  const getPasskeyList = async (config: CorbadoConnectPasskeyListConfig) => {
    let listTokenRes = passkeyListToken;

    if (!listTokenRes) {
      try {
        listTokenRes = await fetchListToken(config);
      } catch {
        setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);
        return;
      }

      if (!listTokenRes) {
        return;
      }
    }

    let passkeyList = await getConnectService().manageList(listTokenRes);

    if (passkeyList.err) {
      if (passkeyList.val instanceof ConnectRequestTimedOut) {
        setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);
        return;
      }

      listTokenRes = await fetchListToken(config);
      if (!listTokenRes) {
        return;
      }

      passkeyList = await getConnectService().manageList(listTokenRes);
      if (passkeyList.err) {
        if (passkeyList.val instanceof ConnectRequestTimedOut) {
          setHardErrorMessage(REQUEST_TIMEOUT_ERROR_MESSAGE);
        }
        return;
      }
    }

    setPasskeyListToken(listTokenRes);
    setPasskeyList(passkeyList.val.passkeys);
  };

  const DeleteModalContent = useCallback(
    (passkey: Passkey) => {
      if (passkeyList) {
        return (
          <div className='cb-passkey-list-modal'>
            <div className='cb-passkey-list-modal-header'>
              <h2 className='cb-h2'>Delete passkey</h2>
              <CrossIcon
                className='cb-passkey-list-modal-exit-icon'
                onClick={() => hide()}
              />
            </div>
            <p className='cb-p'>
              Are you sure you want to delete this passkey? You will have to set it up again by adding a passkey in your
              settings.
            </p>

            <div className='cb-passkey-list-modal-content'>
              <PasskeyListItem
                name={aaguidMappings[passkey.authenticatorAAGUID]?.name ?? 'Passkey'}
                icon={aaguidMappings[passkey.authenticatorAAGUID]?.icon_light}
                createdAt={passkey.created}
                lastUsed={passkey.lastUsed}
                browser={passkey.sourceBrowser}
                os={passkey.sourceOS}
                isThisDevice={false}
                isSynced
                isHybrid
                key={passkey.id}
              />
            </div>

            <div className='cb-passkey-list-modal-cta'>
              <SecondaryButton
                onClick={() => hide()}
                className='cb-passkey-list-modal-button-cancel'
                isLoading={loading}
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                onClick={() => void onDeleteClick(passkey.id)}
                className='cb-passkey-list-modal-button-submit'
                isLoading={loading}
              >
                Delete
              </PrimaryButton>
            </div>
          </div>
        );
      }

      return <></>;
    },
    [passkeyList, loading],
  );

  const AlreadyExistingModal = () => (
    <div className='cb-passkey-list-modal'>
      <div className='cb-passkey-list-modal-header'>
        <h2 className='cb-h2'>No passkey created</h2>
        <CrossIcon
          className='cb-passkey-list-modal-exit-icon'
          onClick={() => hide()}
        />
      </div>

      <p className='cb-p'>You already have a passkey that can be used on this device. </p>
      <p className='cb-p'>There is no need to create a new one.</p>

      <div className='cb-passkey-list-modal-content'></div>

      <PrimaryButton
        onClick={() => hide()}
        className='cb-passkey-list-modal-button-submit'
      >
        Okay
      </PrimaryButton>
    </div>
  );

  if (!isInitialLoadingStarted) {
    return <></>;
  }

  return (
    <PasskeyList
      passkeys={passkeyList}
      onDeleteClick={passkey => {
        setHardErrorMessage(null);
        show(DeleteModalContent(passkey));
      }}
      isLoading={loading}
      onAppendClick={() => void onAppendClick()}
      appendLoading={appendPending}
      deleteLoading={deletePending}
      hardErrorMessage={hardErrorMessage}
    />
  );
};

export default PasskeyListScreen;
