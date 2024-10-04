import type { PassKeyItem } from '@corbado/types';
import type { FC } from 'react';
import React, { memo } from 'react';

import { useCorbado } from '../../hooks/useCorbado';
import useTheme from '../../hooks/useTheme';
import { PasskeyDefaultIcon } from '../ui/icons/PasskeyDefaultIcon';
import { PasskeyDelete } from './PasskeyDelete';
import { PasskeyDetails } from './PasskeyDetails';

export interface PasskeyListItemProps {
  passkey: PassKeyItem;
  fetchPasskeys: () => Promise<void>;
}

export const PasskeyListItem: FC<PasskeyListItemProps> = memo(({ passkey, fetchPasskeys }) => {
  const { deletePasskey } = useCorbado();
  const { darkMode } = useTheme();
  const icon = darkMode ? passkey.aaguidDetails.iconDark : passkey.aaguidDetails.iconLight;

  const handleDeletePasskey = async (id: string) => {
    await deletePasskey(id);
    await fetchPasskeys();
  };

  return (
    <div
      key={passkey.id}
      className='cb-passkey-list-card'
    >
      <div className='cb-passkey-list-icon cb-passkey-list-icon-left'>
        {icon ? (
          <img
            src={icon}
            alt={passkey.authenticatorAAGUID}
          />
        ) : (
          <PasskeyDefaultIcon />
        )}
      </div>
      <PasskeyDetails passkey={passkey} />
      <PasskeyDelete
        passkeyId={passkey.id}
        onPasskeyDelete={handleDeletePasskey}
      />
    </div>
  );
});
