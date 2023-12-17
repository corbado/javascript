import { aaguidMappings, getParsedUA } from '@corbado/shared-ui';
import type { PassKeyItem } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

export interface PasskeyDetailsProps {
  passkey: PassKeyItem;
}

const PasskeyDetails: FC<PasskeyDetailsProps> = ({ passkey }) => {
  const userAgent = getParsedUA(passkey.userAgent);
  const title = aaguidMappings[passkey.aaguid]?.name ?? 'Passkey';

  return (
    <div className='cb-passkey-list-details'>
      <div className='cb-passkey-list-header'>
        <div className='cb-passkey-list-header-title'>{title}</div>
        {passkey.backupState ? <div className='cb-passkey-list-header-badge'>Synced</div> : null}
      </div>
      <div>Credential ID: {passkey.id}</div>
      <div>
        Created: {passkey.created} with {userAgent?.browser.name} on {userAgent?.os.name}
      </div>
      <div>Last used: {passkey.lastUsed}</div>
      <div>Status: {passkey.status}</div>
    </div>
  );
};

export default PasskeyDetails;
