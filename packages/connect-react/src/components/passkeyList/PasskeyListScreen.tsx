import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { Passkey } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useLoading from '../../hooks/useLoading';
import useManageProcess from '../../hooks/useManageProcess';
import useModal from '../../hooks/useModal';
import useShared from '../../hooks/useShared';
import { ManageScreenType } from '../../types/screenTypes';
import { ConnectTokenType } from '../../types/tokens';
import { CrossIcon } from '../shared/icons/CrossIcon';
import { PasskeyListItem } from '../shared/PasskeyListItem';
import { PrimaryButton } from '../shared/PrimaryButton';
import { SecondaryButton } from '../shared/SecondaryButton';
import PasskeyList from './PasskeyList';

const PasskeyListScreen = () => {
  const { navigateToScreen, config } = useManageProcess();
  const { setPasskeyListToken, passkeyListToken } = useManageProcess();
  const { show, hide } = useModal();
  const { getConnectService } = useShared();

  const [passkeyList, setPasskeyList] = useState<Passkey[]>([]);
  const { loading, startLoading, finishLoading, isInitialLoadingStarted } = useLoading();
  const [deletePending, setDeletePending] = useState<boolean>(false);
  const [appendPending, setAppendPending] = useState<boolean>(false);

  useEffect(() => {
    const init = async (ac: AbortController) => {
      startLoading();
      log.debug('running init');
      const res = await getConnectService().manageInit(ac);

      log.debug(res.val);

      if (res.err) {
        finishLoading();
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

      const deleteToken = await config.connectTokenProvider(ConnectTokenType.PasskeyDelete);

      const deletePasskeyRes = await getConnectService().manageDelete(deleteToken, credentialsId);

      if (deletePasskeyRes.err) {
        finishLoading();
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
    const appendToken = await config.connectTokenProvider(ConnectTokenType.PasskeyAppend);

    const startAppendRes = await getConnectService().startAppend(appendToken, undefined, true);

    if (startAppendRes.err || !startAppendRes.val.attestationOptions) {
      setAppendPending(false);
      log.error('error:', startAppendRes.val);
      show(AlreadyExistingModal());

      return;
    }

    const res = await getConnectService().completeAppend(startAppendRes.val.attestationOptions);

    if (res.err) {
      setAppendPending(false);
      log.error('error:', res.val);

      show(AlreadyExistingModal());
      return;
    }

    log.debug('get passkey list');
    await getPasskeyList(config);
    setAppendPending(false);
  }, [config, passkeyListToken, appendPending]);

  const fetchListToken = async (config: CorbadoConnectPasskeyListConfig) =>
    await config.connectTokenProvider(ConnectTokenType.PasskeyList);

  const getPasskeyList = async (config: CorbadoConnectPasskeyListConfig) => {
    let listTokenRes = passkeyListToken;

    if (!listTokenRes) {
      listTokenRes = await fetchListToken(config);
      if (!listTokenRes) {
        return;
      }
    }

    let passkeyList = await getConnectService().manageList(listTokenRes);

    if (passkeyList.err) {
      listTokenRes = await fetchListToken(config);
      if (!listTokenRes) {
        return;
      }

      passkeyList = await getConnectService().manageList(listTokenRes);
      if (passkeyList.err) {
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
                name={'Passkey'}
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
                Remove
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
        <h2 className='cb-h2'>You already have a passkey on this device</h2>
        <CrossIcon
          className='cb-passkey-list-modal-exit-icon'
          onClick={() => hide()}
        />
      </div>

      <p className='cb-p'>You will not be able to use this passkey for login.</p>

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
        show(DeleteModalContent(passkey));
      }}
      isLoading={loading}
      onAppendClick={() => void onAppendClick()}
      appendLoading={appendPending}
      deleteLoading={deletePending}
    />
  );
};

export default PasskeyListScreen;
