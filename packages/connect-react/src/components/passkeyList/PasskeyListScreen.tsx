import React, { useCallback, useEffect, useState } from 'react';
import log from 'loglevel';

import { PasskeyListItem } from '../shared/PasskeyListItem';
import { startOfDay } from 'date-fns';
import { Button } from '../shared/Button';
import { PlusIcon } from '../shared/icons/PlusIcon';
import useManageProcess from '../../hooks/useManageProcess';
import useShared from '../../hooks/useShared';
import { ManageScreenType } from '../../types/screenTypes';
import { CorbadoTokens } from '../../types/tokens';
import { Passkey } from '@corbado/web-core/dist/api/v2';
import { CorbadoConnectPasskeyListConfig } from '@corbado/types';

const PasskeyListScreen = () => {
  const { navigateToScreen, config } = useManageProcess();
  const { getConnectService } = useShared();

  const [passkeyList, setPasskeyList] = useState<Array<Passkey>>([]);
  const [appendAllowed, setAppendAllowed] = useState(false);
  const [attestationOptions, setAttestationOptions] = useState('');
  const [ac, _] = useState(new AbortController());

  useEffect(() => {
    const init = async (ac: AbortController) => {
      log.debug('running init');
      const res = await getConnectService().manageInit(ac);

      log.debug(res.val);

      if (res.err) {
        log.error(res.val);
        return;
      }

      if (!res.val.manageAllowed) {
        log.debug('manage passkeys is not allowed');
        navigateToScreen(ManageScreenType.Invisible);
        return;
      }

      await getPasskeyList(ac, config);
      await startAppend(ac, config);
    };

    void init(ac);

    return () => {
      ac.abort();
      getConnectService().dispose();
    };
  }, [getConnectService, ac]);

  const onDeleteClick = useCallback(
    async (credentialId: string) => {
      const deleteToken = await config.corbadoTokenProvider(CorbadoTokens.PasskeyDelete);

      const deletePasskeyRes = await getConnectService().manageDelete(ac, deleteToken, credentialId);

      if (deletePasskeyRes.err) {
        return;
      }

      getPasskeyList(ac, config);
    },
    [config, ac],
  );

  const onAppendClick = useCallback(async () => {
    console.log('clicked');
    if (appendAllowed) {
      console.log(attestationOptions);
      const res = await getConnectService().completeAppend(attestationOptions);
      if (res.err) {
        log.error('error:', res.val);

        return;
      }

      getPasskeyList(ac, config);
    }
  }, [config, ac, appendAllowed, attestationOptions]);

  const getPasskeyList = async (ac: AbortController, config: CorbadoConnectPasskeyListConfig) => {
    const listTokenRes = await config.corbadoTokenProvider(CorbadoTokens.PasskeyList);

    log.debug(listTokenRes);

    if (!listTokenRes) {
      return;
    }

    const passkeyList = await getConnectService().manageList(ac, listTokenRes);

    if (passkeyList.err) {
      return;
    }

    setPasskeyList(passkeyList.val.passkeys);
  };

  const startAppend = async (ac: AbortController, config: CorbadoConnectPasskeyListConfig) => {
    const appendToken = await config.corbadoTokenProvider(CorbadoTokens.PasskeyAppend);

    const startAppendRes = await getConnectService().startAppend(appendToken, ac);
    if (startAppendRes.err) {
      setAppendAllowed(false);

      return;
    }

    if (startAppendRes.val.attestationOptions === '') {
      setAppendAllowed(false);

      return;
    }

    setAppendAllowed(true);
    setAttestationOptions(startAppendRes.val.attestationOptions);
  };

  return (
    <div className='cb-passkey-list-container'>
      {passkeyList.map(passkey => (
        <PasskeyListItem
          onDeleteClick={() => onDeleteClick(passkey.credentialID)}
          name={'name'}
          createdAt={passkey.created}
          lastUsed={passkey.lastUsed}
          browser={passkey.sourceBrowser}
          os={passkey.sourceOS}
          isThisDevice
          isSynced
          isHybrid
          key={passkey.id}
        />
      ))}

      {appendAllowed && (
        <div className='cb-passkey-list__append-cta'>
          <Button
            className='cb-passkey-list__append-button'
            onClick={() => void onAppendClick()}
          >
            <p>Add a passkey</p>
            <PlusIcon className='cb-passkey-list__append-icon' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PasskeyListScreen;
