import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { Passkey } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useManageProcess from '../../hooks/useManageProcess';
import useModal from '../../hooks/useModal';
import useShared from '../../hooks/useShared';
import { ManageScreenType } from '../../types/screenTypes';
import { CorbadoTokens } from '../../types/tokens';
import { CrossIcon } from '../shared/icons/CrossIcon';
import { PasskeyListItem } from '../shared/PasskeyListItem';
import PasskeyList from './PasskeyList';
import { PrimaryButton } from '../shared/PrimaryButton';
import { SecondaryButton } from '../shared/SecondaryButton';

const PasskeyListScreen = () => {
  const { navigateToScreen, config } = useManageProcess();
  const { setPasskeyListToken, passkeyListToken } = useManageProcess();
  const { show, hide } = useModal();
  const { getConnectService } = useShared();

  const [passkeyList, setPasskeyList] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletePending, setDeletePending] = useState<boolean>(false);
  const [appendPending, setAppendPending] = useState<boolean>(false);

  useEffect(() => {
    const init = async (ac: AbortController) => {
      setLoading(true);
      log.debug('running init');
      const res = await getConnectService().manageInit(ac);

      log.debug(res.val);

      if (res.err) {
        setLoading(false);
        log.error(res.val);
        return;
      }

      if (!res.val.manageAllowed) {
        setLoading(false);
        log.debug('manage passkeys is not allowed');
        navigateToScreen(ManageScreenType.Invisible);
        return;
      }

      await getPasskeyList(config);
      setLoading(false);
    };

    const ac = new AbortController();
    void init(ac);

    return () => {
      ac.abort();
      getConnectService().dispose();
    };
  }, [getConnectService, setLoading]);

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

      const deleteToken = await config.corbadoTokenProvider(CorbadoTokens.PasskeyDelete);

      const deletePasskeyRes = await getConnectService().manageDelete(deleteToken, credentialsId);

      if (deletePasskeyRes.err) {
        setLoading(false);
        return;
      }

      await getPasskeyList(config);
      setDeletePending(false);
    },
    [config, loading, passkeyListToken, deletePending],
  );

  const onAppendClick = useCallback(async () => {
    if (appendPending) {
      return;
    }

    setAppendPending(true);
    const appendToken = await config.corbadoTokenProvider(CorbadoTokens.PasskeyAppend);

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

    console.log('get passkey list');
    await getPasskeyList(config);
    setAppendPending(false);
  }, [config, setLoading, passkeyListToken, appendPending]);

  const fetchListToken = async (config: CorbadoConnectPasskeyListConfig) =>
    await config.corbadoTokenProvider(CorbadoTokens.PasskeyList);

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
          <div className='cb-passkey-list__modal'>
            <div className='cb-passkey-list__modal-header'>
              <h2 className='cb-passkey-list__modal-title'>Delete passkey</h2>
              <CrossIcon
                className='cb-passkey-list__modal-exit-icon'
                onClick={() => hide()}
              />
            </div>
            <p className='cb-passkey-list__modal-description'>
              Are you sure you want to delete this passkey? You will have to set it up again by adding a passkey in your
              settings.
            </p>

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

            <div className='cb-passkey-list__modal-cta'>
              <SecondaryButton
                onClick={() => hide()}
                className='cb-passkey-list__modal-button-cancel'
                isLoading={loading}
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                onClick={() => void onDeleteClick(passkey.id)}
                className='cb-passkey-list__modal-button-submit'
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
    [passkeyList],
  );

  const AlreadyExistingModal = () => (
    <div className='cb-passkey-list__modal'>
      <h2 className='cb-passkey-list__modal-title'>You already have a passkey on this device</h2>
      <p className='cb-passkey-list__modal-description'>You will not be able to use this passkey for login.</p>

      <div className='cb-passkey-list__modal-cta'>
        <PrimaryButton
          onClick={() => hide()}
          className='cb-passkey-list__modal-button-submit'
        >
          Okay
        </PrimaryButton>
      </div>
    </div>
  );

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
