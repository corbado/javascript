import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { Passkey } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useManageProcess from '../../hooks/useManageProcess';
import useModal from '../../hooks/useModal';
import useShared from '../../hooks/useShared';
import { ManageScreenType } from '../../types/screenTypes';
import { CorbadoTokens } from '../../types/tokens';
import { Button } from '../shared/Button';
import PasskeyList from './PasskeyList';

const PasskeyListScreen = () => {
  const { navigateToScreen, config } = useManageProcess();
  const { setPasskeyListToken, passkeyListToken } = useManageProcess();
  const { show, hide } = useModal();
  const { getConnectService } = useShared();

  const [passkeyList, setPasskeyList] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      setLoading(true);
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
      setLoading(false);
    },
    [config, loading, passkeyListToken],
  );

  const onAppendClick = useCallback(async () => {
    setLoading(true);
    const appendToken = await config.corbadoTokenProvider(CorbadoTokens.PasskeyAppend);

    const startAppendRes = await getConnectService().startAppend(appendToken);

    if (startAppendRes.err || !startAppendRes.val.attestationOptions) {
      setLoading(false);
      log.error('error:', startAppendRes.val);
      show(AlreadyExistingModal());

      return;
    }

    const res = await getConnectService().completeAppend(startAppendRes.val.attestationOptions);

    if (res.err) {
      setLoading(false);
      log.error('error:', res.val);

      show(AlreadyExistingModal());
      return;
    }

    console.log('get passkey list');
    await getPasskeyList(config);
    setLoading(false);
  }, [config, setLoading, passkeyListToken]);

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

  const DeleteModalContent = (selectedPasskeyId: string) => (
    <div className='cb-passkey-list__modal'>
      <h2 className='cb-passkey-list__modal-title'>Remove this passkey ?</h2>
      <p className='cb-passkey-list__modal-description'>You will not be able to use this passkey for login.</p>

      <div className='cb-passkey-list__modal-cta'>
        <Button
          onClick={() => hide()}
          className='cb-passkey-list__modal-button-cancel'
          isLoading={loading}
        >
          Cancel
        </Button>

        <Button
          onClick={() => void onDeleteClick(selectedPasskeyId)}
          className='cb-passkey-list__modal-button-submit'
          isLoading={loading}
        >
          Remove
        </Button>
      </div>
    </div>
  );

  const AlreadyExistingModal = () => (
    <div className='cb-passkey-list__modal'>
      <h2 className='cb-passkey-list__modal-title'>You already have a passkey on this device</h2>
      <p className='cb-passkey-list__modal-description'>You will not be able to use this passkey for login.</p>

      <div className='cb-passkey-list__modal-cta'>
        <Button
          onClick={() => hide()}
          className='cb-passkey-list__modal-button-submit'
        >
          Okay
        </Button>
      </div>
    </div>
  );

  return (
    <PasskeyList
      passkeys={passkeyList}
      onDeleteClick={id => {
        show(DeleteModalContent(id));
      }}
      isLoading={loading}
      onAppendClick={() => void onAppendClick()}
    />
  );
};

export default PasskeyListScreen;
