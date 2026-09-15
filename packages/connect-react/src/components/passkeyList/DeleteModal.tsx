import type { Passkey } from '@corbado/web-core';
import React from 'react';

import { BaseModal } from '../shared/BaseModal';
import { PasskeyListItem } from '../shared/PasskeyListItem';

type Props = {
  onDeleteClick: (passkey: Passkey) => Promise<void>;
  hide: () => void;
  passkey: Passkey;
};

const DeleteModal = ({ onDeleteClick, hide, passkey }: Props) => (
  <BaseModal
    onPrimaryButton={() => onDeleteClick(passkey)}
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
        isSynced={passkey.backupState}
        isHybrid={passkey.transport.includes('hybrid')}
        key={passkey.id}
      />
    }
  />
);

export default DeleteModal;
