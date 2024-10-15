import type { Passkey } from '@corbado/web-core';
import type { FC } from 'react';
import React from 'react';

import { PlusIcon } from '../shared/icons/PlusIcon';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Notification } from '../shared/Notification';
import { PasskeyListItem } from '../shared/PasskeyListItem';
import { PrimaryButton } from '../shared/PrimaryButton';
import PasskeyEmptyList from './PasskeyEmptyList';

export enum PasskeyListState {
  SilentLoading,
  Loading,
  Loaded,
  LoadingFailed,
}

interface PasskeyListProps {
  passkeys: Passkey[];
  onDeleteClick: (passkey: Passkey) => void;
  state: PasskeyListState;
  onAppendClick?: () => void;
  appendLoading: boolean;
  hardErrorMessage: string | null;
}

const PasskeyList: FC<PasskeyListProps> = ({
  passkeys,
  state,
  onDeleteClick,
  onAppendClick,
  appendLoading,
  hardErrorMessage,
}) => {
  const drawContent = () => {
    switch (state) {
      case PasskeyListState.SilentLoading:
        return <></>;
      case PasskeyListState.Loading:
        return (
          <div className='cb-passkey-list-loader-container'>
            <LoadingSpinner className='cb-passkey-list-loader' />
          </div>
        );
      case PasskeyListState.LoadingFailed:
        return <PasskeyEmptyList message='Passkey list is unavailable. Please try again later.' />;
      case PasskeyListState.Loaded:
        if (passkeys.length === 0) {
          return <PasskeyEmptyList message='There is currently no passkey saved for this account.' />;
        }

        return passkeys.map(passkey => (
          <PasskeyListItem
            onDeleteClick={() => {
              onDeleteClick(passkey);
            }}
            name={passkey.aaguidDetails.name}
            icon={passkey.aaguidDetails.iconLight}
            createdAt={passkey.created}
            lastUsed={passkey.lastUsed}
            browser={passkey.sourceBrowser}
            os={passkey.sourceOS}
            isThisDevice={false}
            isSynced={passkey.backupState}
            isHybrid={passkey.transport.includes('hybrid')}
            key={passkey.id}
          />
        ));
    }
  };

  return (
    <>
      {hardErrorMessage ? (
        <Notification
          message={hardErrorMessage}
          className='cb-p cb-error-notification'
        />
      ) : null}
      {drawContent()}
      {onAppendClick ? (
        <div className='cb-passkey-list-append-cta'>
          <PrimaryButton
            className='cb-passkey-list-append-button'
            onClick={() => onAppendClick()}
            isLoading={appendLoading}
          >
            <span>Add a passkey</span>
            <PlusIcon className='cb-passkey-list-append-icon' />
          </PrimaryButton>
        </div>
      ) : null}
    </>
  );
};

export default PasskeyList;
