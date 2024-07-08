import React, { useEffect } from 'react';
import log from 'loglevel';

import { PasskeyListItem } from '../shared/PasskeyListItem';
import { startOfDay } from 'date-fns';
import { Button } from '../shared/Button';
import { PlusIcon } from '../shared/icons/PlusIcon';
import useManageProcess from '../../hooks/useManageProcess';
import useShared from '../../hooks/useShared';
import { ManageScreenType } from '../../types/screenTypes';

const PasskeyListScreen = () => {
  const { navigateToScreen } = useManageProcess();
  const { getConnectService } = useShared();

  useEffect(() => {
    const init = async (ac: AbortController) => {
      log.debug('running init');
      const res = await getConnectService().manageInit(ac);

      if (res.err) {
        log.error(res.val);
        return;
      }

      if (!res.val.manageAllowed) {
        log.debug('manage passkeys is not allowed');
        navigateToScreen(ManageScreenType.Invisible);
        return;
      }
    };

    const ac = new AbortController();
    void init(ac);

    return () => {
      ac.abort();
      getConnectService().dispose();
    };
  }, [getConnectService]);

  return (
    <div className='cb-passkey-list-container'>
      <PasskeyListItem
        onDeleteClick={() => {}}
        name={'Name'}
        createdAt={startOfDay(new Date())}
        lastUsed={startOfDay(new Date())}
        browser={'Chrome'}
        os={'Windows'}
        isThisDevice
        isSynced
      />
      <PasskeyListItem
        onDeleteClick={() => {}}
        name={'Name'}
        createdAt={startOfDay(new Date())}
        lastUsed={startOfDay(new Date())}
        browser={'Safari'}
        os={'macOs'}
        isHybrid
      />

      <div className='cb-passkey-list__append-cta'>
        <Button className='cb-passkey-list__append-button'>
          <p>Add a passkey</p>
          <PlusIcon className='cb-passkey-list__append-icon' />
        </Button>
      </div>
    </div>
  );
};

export default PasskeyListScreen;
