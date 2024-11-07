import type { Passkey } from '@corbado/web-core';
import React from 'react';

import { BaseModal } from '../shared/BaseModal';
import { PasskeyListItem } from '../shared/PasskeyListItem';

type Props = {
  onDeleteClick: (id: string) => Promise<void>;
  hide: () => void;
  passkey: Passkey;
};

const DeleteModal = ({ onDeleteClick, hide, passkey }: Props) => (
  <BaseModal
    onPrimaryButton={() => onDeleteClick(passkey.id)}
    onCloseButton={() => hide()}
    onSecondaryButton={() => hide()}
    headerText='Delete passkey'
    primaryButtonText='Delete'
    secondaryButtonText='Cancel'
    children={
      <PasskeyListItem
        name={passkey.aaguidDetails.name}
        icon={passkey.aaguidDetails.iconLight}
        createdAt={passkey.created}
        lastUsed={passkey.lastUsed}
        browser={passkey.sourceBrowser}
        os={passkey.sourceOS}
        isThisDevice={false}
        isSynced
        isHybrid
        key={passkey.id}
      />
    }
  />
);

export default DeleteModal;
