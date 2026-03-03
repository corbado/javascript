import type { FC } from 'react';
import React from 'react';

import outlookSrc from '../../../shared-ui/assets/outlook.svg';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const OutlookIcon: FC<IconProps> = props => {
  return (
    <Icon
      src={outlookSrc}
      {...props}
    />
  );
};
