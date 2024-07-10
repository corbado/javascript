import { Passkey } from '@corbado/web-core/dist/api/v2';
import React, { FC } from 'react';
import { PasskeyListItem } from '../shared/PasskeyListItem';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { PlusIcon } from '../shared/icons/PlusIcon';
import PasskeyEmptyList from './PasskeyEmptyList';

interface PasskeyListProps {
  passkeys: Passkey[];
  onDeleteClick: (id: string) => void;
  isLoading: boolean;
  onAppendClick: () => void;
}

const PasskeyList: FC<PasskeyListProps> = ({ passkeys, isLoading, onDeleteClick, onAppendClick }) => {
  if (isLoading)
    return (
      <div className='cb-passkey-list__loader-container'>
        <LoadingSpinner className='cb-passkey-list__loader' />
      </div>
    );

  return (
    <div className='cb-passkey-list-container'>
      {passkeys.length ? (
        passkeys.map(passkey => (
          <PasskeyListItem
            onDeleteClick={() => {
              onDeleteClick(passkey.id);
            }}
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
        ))
      ) : (
        <PasskeyEmptyList />
      )}

      <div className='cb-passkey-list__append-cta'>
        <Button
          className='cb-passkey-list__append-button'
          onClick={() => (isLoading ? null : void onAppendClick())}
          isLoading={isLoading}
        >
          <p>Add a passkey</p>
          <PlusIcon className='cb-passkey-list__append-icon' />
        </Button>
      </div>
    </div>
  );
};

export default PasskeyList;
