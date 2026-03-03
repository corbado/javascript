import type { FC } from 'react';
import React from 'react';

import microsoftSrc from '../../../shared-ui/assets/microsoft.svg';
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
