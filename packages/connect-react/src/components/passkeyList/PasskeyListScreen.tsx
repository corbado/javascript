import React from 'react';
import { PasskeyListItem } from '../shared/PasskeyListItem';
import { startOfDay } from 'date-fns';
import { Button } from '../shared/Button';
import { PlusIcon } from '../shared/icons/PlusIcon';

const PasskeyListScreen = () => {
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
          <p>Add a passkey </p>
          <PlusIcon className='cb-passkey-list__append-icon' />
        </Button>
      </div>
    </div>
  );
};

export default PasskeyListScreen;
