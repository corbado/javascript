import passkeyHybridSrc from '@corbado/shared-ui/assets/passkey-hybrid.svg';
import passkeyHybridDarkSrc from '@corbado/shared-ui/assets/passkey-hybrid-dark.svg';
import type { FC } from 'react';
import React from 'react';

import useTheme from '../../../hooks/useTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const PasskeyHybridIcon: FC<IconProps> = props => {
  const { darkMode } = useTheme();
  return (
    <Icon
      src={darkMode ? passkeyHybridDarkSrc : passkeyHybridSrc}
      {...props}
    />
  );
};

export default PasskeyHybridIcon;
