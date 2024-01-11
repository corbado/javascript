import { aaguidMappings, hasDarkMode } from '@corbado/shared-ui';
import React from 'react';

import { PasskeyDefaultIcon } from '../ui/icons/Icons';

export interface PasskeyAgentIconProps {
  aaguid: string;
}

const PasskeyAgentIcon = ({ aaguid }: PasskeyAgentIconProps) => {
  const iconData = aaguidMappings[aaguid];
  const iconSrc = hasDarkMode() ? iconData?.iconDark ?? iconData?.icon : iconData?.icon;

  return (
    <div className='cb-passkey-list-icon'>
      {iconSrc ? (
        <img
          src={iconSrc}
          alt={iconData?.name ?? 'Passkey'}
        />
      ) : (
        <PasskeyDefaultIcon />
      )}
    </div>
  );
};

export default PasskeyAgentIcon;
