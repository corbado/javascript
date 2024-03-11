import yahooSrc from '@corbado/shared-ui/assets/yahoo.svg';
import type { FC } from 'react';
import React from 'react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const YahooIcon: FC<IconProps> = props => {
  return (
    <Icon
      src={yahooSrc}
      {...props}
    />
  );
};
