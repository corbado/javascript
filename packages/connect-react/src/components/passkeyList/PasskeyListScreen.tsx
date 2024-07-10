import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { Passkey } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useManageProcess from '../../hooks/useManageProcess';
import useShared from '../../hooks/useShared';
import { ManageScreenType } from '../../types/screenTypes';
import { CorbadoTokens } from '../../types/tokens';
import { Button } from '../shared/Button';
import useModal from '../../hooks/useModal';
import PasskeyList from './PasskeyList';

const PasskeyListScreen = () => {
  const { navigateToScreen, config } = useManageProcess();
  const { show, hide } = useModal();
  const { getConnectService } = useShared();

  const [passkeyList, setPasskeyList] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ac, _] = useState(new AbortController());

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

      await getPasskeyList(ac, config);
      setLoading(false);
    };

    void init(ac);

    return () => {
      ac.abort();
      getConnectService().dispose();
    };
  }, [getConnectService, ac, setLoading]);

  const onDeleteClick = useCallback(
    async (credentialsId?: string) => {
      setLoading(true);
      hide();
      if (!credentialsId) return;

      const deleteToken = await config.corbadoTokenProvider(CorbadoTokens.PasskeyDelete);

      const deletePasskeyRes = await getConnectService().manageDelete(ac, deleteToken, credentialsId);

      if (deletePasskeyRes.err) {
        setLoading(false);
        return;
      }

      await getPasskeyList(ac, config);
      setLoading(false);
    },
    [config, ac, loading],
  );

  const onAppendClick = useCallback(async () => {
    setLoading(true);
    const appendToken = await config.corbadoTokenProvider(CorbadoTokens.PasskeyAppend);
    const startAppendRes = await getConnectService().startAppend(appendToken, ac);
    if (startAppendRes.err) {
      setLoading(false);
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
    await getPasskeyList(ac, config);
    setLoading(false);
  }, [config, ac, loading]);

  const getPasskeyList = async (ac: AbortController, config: CorbadoConnectPasskeyListConfig) => {
    const listTokenRes = await config.corbadoTokenProvider(CorbadoTokens.PasskeyList);

    log.debug(listTokenRes);

    if (!listTokenRes) {
      return;
    }

    const passkeyList = await getConnectService().manageList(ac, listTokenRes);
    console.log(passkeyList);
    if (passkeyList.err) {
      return;
    }

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
          onClick={() => onDeleteClick(selectedPasskeyId)}
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
      onAppendClick={onAppendClick}
    />
  );
};

export default PasskeyListScreen;
