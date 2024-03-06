import emailSrc from '@corbado/shared-ui/assets/email.svg';
import type { FC } from 'react';
import React from 'react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const EmailIcon: FC<IconProps> = props => {
  return (
    <Icon
      src={emailSrc}
      {...props}
    />
  );
};
