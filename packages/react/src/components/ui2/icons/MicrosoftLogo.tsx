import microsoftSrc from '@corbado/shared-ui/assets/microsoft.svg';
import type { FC } from 'react';
import React from 'react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const MicrosoftIcon: FC<IconProps> = props => {
  return (
    <Icon
      src={microsoftSrc}
      {...props}
    />
  );
};

export default MicrosoftIcon;
