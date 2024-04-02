import googleSrc from '@corbado/shared-ui/assets/google.svg';
import type { FC } from 'react';
import React from 'react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const GoogleIcon: FC<IconProps> = props => {
  return (
    <Icon
      src={googleSrc}
      {...props}
    />
  );
};

export default GoogleIcon;
