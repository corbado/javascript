import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { Passkey } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';
import React, { useCallback, useEffect, useState } from 'react';

import useManageProcess from '../../hooks/useManageProcess';
import useShared from '../../hooks/useShared';
import { ManageScreenType } from '../../types/screenTypes';
import { CorbadoTokens } from '../../types/tokens';
import { Button } from '../shared/Button';
import { PlusIcon } from '../shared/icons/PlusIcon';
import { PasskeyListItem } from '../shared/PasskeyListItem';

const PasskeyListScreen = () => {
  const { navigateToScreen, config } = useManageProcess();
  const { getConnectService } = useShared();

  const [passkeyList, setPasskeyList] = useState<Array<Passkey>>([]);
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

      await getPasskeyList(ac, config);
    },
    [config, ac],
  );

  const onAppendClick = useCallback(async () => {
    const appendToken = await config.corbadoTokenProvider(CorbadoTokens.PasskeyAppend);
    const startAppendRes = await getConnectService().startAppend(appendToken, ac);
    if (startAppendRes.err) {
      return;
    }

    if (startAppendRes.val.attestationOptions === '') {
      return;
    }

    const res = await getConnectService().completeAppend(startAppendRes.val.attestationOptions);
    if (res.err) {
      log.error('error:', res.val);

      return;
    }

    console.log('get passkey list');
    await getPasskeyList(ac, config);
  }, [config, ac]);

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

  return (
    <div className='cb-passkey-list-container'>
      {passkeyList.map(passkey => (
        <PasskeyListItem
          onDeleteClick={() => void onDeleteClick(passkey.id)}
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
      ))}

      <div className='cb-passkey-list__append-cta'>
        <Button
          className='cb-passkey-list__append-button'
          onClick={() => void onAppendClick()}
        >
          <p>Add a passkey</p>
          <PlusIcon className='cb-passkey-list__append-icon' />
        </Button>
      </div>
    </div>
  );
};

export default PasskeyListScreen;
