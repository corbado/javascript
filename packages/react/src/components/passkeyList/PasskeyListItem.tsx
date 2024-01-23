import { useCorbado } from '@corbado/react-sdk';
import type { PassKeyItem } from '@corbado/types';
import type { FC } from 'react';
import React, { memo } from 'react';

import { PasskeyAgentIcon } from './PasskeyAgentIcon';
import { PasskeyDelete } from './PasskeyDelete';
import { PasskeyDetails } from './PasskeyDetails';

export interface PasskeyListItemProps {
  passkey: PassKeyItem;
  fetchPasskeys: () => Promise<void>;
}

export const PasskeyListItem: FC<PasskeyListItemProps> = memo(({ passkey, fetchPasskeys }) => {
  const { deletePasskey } = useCorbado();

  const handleDeletePasskey = async (id: string) => {
    await deletePasskey(id);
    await fetchPasskeys();
  };

  return (
    <div
      key={passkey.id}
      className='cb-passkey-list-card'
    >
      <PasskeyAgentIcon aaguid={passkey.aaguid} />
      <PasskeyDetails passkey={passkey} />
      <PasskeyDelete
        passkeyId={passkey.id}
        onPasskeyDelete={handleDeletePasskey}
      />
    </div>
  );
});
