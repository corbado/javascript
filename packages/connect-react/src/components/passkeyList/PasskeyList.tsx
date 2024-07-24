import type { Passkey } from '@corbado/web-core/dist/api/v2';
import type { FC } from 'react';
import React from 'react';

import { Button } from '../shared/Button';
import { PlusIcon } from '../shared/icons/PlusIcon';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { PasskeyListItem } from '../shared/PasskeyListItem';
import PasskeyEmptyList from './PasskeyEmptyList';

interface PasskeyListProps {
  passkeys: Passkey[];
  onDeleteClick: (passkey: Passkey) => void;
  isLoading: boolean;
  onAppendClick: () => void;
  appendLoading: boolean;
  deleteLoading: boolean;
}

const PasskeyList: FC<PasskeyListProps> = ({
  passkeys,
  isLoading,
  onDeleteClick,
  onAppendClick,
  appendLoading,
  deleteLoading,
}) => {
  const [selectedPasskey, setSelectedPasskey] = React.useState<Passkey | null>(null);

  return (
    <>
      <div className='cb-passkey-list-container'>
        {isLoading ? (
          <div className='cb-passkey-list-loader-container'>
            <LoadingSpinner className='cb-passkey-list-loader' />
          </div>
        ) : passkeys.length ? (
          [...passkeys, ...passkeys].map(passkey => (
            <PasskeyListItem
              onDeleteClick={() => {
                setSelectedPasskey(passkey);
                onDeleteClick(passkey);
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
              isDeleteLoading={deleteLoading && selectedPasskey === passkey}
            />
          ))
        ) : (
          <PasskeyEmptyList />
        )}
      </div>

      <div className='cb-passkey-list-append-cta'>
        <Button
          className='cb-passkey-list-append-button'
          onClick={() => (isLoading ? null : void onAppendClick())}
          isLoading={appendLoading}
        >
          <p>Add a passkey</p>
          <PlusIcon className='cb-passkey-list-append-icon' />
        </Button>
      </div>
    </>
  );
};

export default PasskeyList;
