import type { Passkey } from '@corbado/web-core';
import type { FC } from 'react';
import React from 'react';

import { aaguidMappings } from '../../utils/aaguidMappings';
import { Button } from '../shared/Button';
import { PlusIcon } from '../shared/icons/PlusIcon';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Notification } from '../shared/Notification';
import { PasskeyListItem } from '../shared/PasskeyListItem';
import PasskeyEmptyList from './PasskeyEmptyList';

interface PasskeyListProps {
  passkeys: Passkey[];
  onDeleteClick: (passkey: Passkey) => void;
  isLoading: boolean;
  onAppendClick?: () => void;
  appendLoading: boolean;
  deleteLoading: boolean;
  hardErrorMessage: string | null;
}

const PasskeyList: FC<PasskeyListProps> = ({
  passkeys,
  isLoading,
  onDeleteClick,
  onAppendClick,
  appendLoading,
  deleteLoading,
  hardErrorMessage,
}) => {
  const [selectedPasskey, setSelectedPasskey] = React.useState<Passkey | null>(null);

  return (
    <>
      {hardErrorMessage ? (
        <Notification
          message={hardErrorMessage}
          className='cb-p cb-error-notification'
        />
      ) : null}
      <div className='cb-passkey-list-container'>
        {isLoading ? (
          <div className='cb-passkey-list-loader-container'>
            <LoadingSpinner className='cb-passkey-list-loader' />
          </div>
        ) : passkeys.length ? (
          passkeys.map(passkey => (
            <PasskeyListItem
              onDeleteClick={() => {
                setSelectedPasskey(passkey);
                onDeleteClick(passkey);
              }}
              name={aaguidMappings[passkey.authenticatorAAGUID]?.name ?? 'Passkey'}
              icon={aaguidMappings[passkey.authenticatorAAGUID]?.icon_light}
              createdAt={passkey.created}
              lastUsed={passkey.lastUsed}
              browser={passkey.sourceBrowser}
              os={passkey.sourceOS}
              isThisDevice={false}
              isSynced={passkey.backupState}
              isHybrid={passkey.transport.includes('hybrid')}
              key={passkey.id}
              isDeleteLoading={deleteLoading && selectedPasskey === passkey}
            />
          ))
        ) : (
          <PasskeyEmptyList />
        )}
      </div>

      {onAppendClick ? (
        <div className='cb-passkey-list-append-cta'>
          <Button
            className='cb-passkey-list-append-button'
            onClick={() => (isLoading ? null : onAppendClick())}
            isLoading={appendLoading}
          >
            <p>Add a passkey</p>
            <PlusIcon className='cb-passkey-list-append-icon' />
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default PasskeyList;
