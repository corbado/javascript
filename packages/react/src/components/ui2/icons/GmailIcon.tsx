import gmailSrc from '@corbado/shared-ui/assets/gmail.svg';
import type { FC } from 'react';
import React from 'react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const GmailIcon: FC<IconProps> = props => {
  return (
    <Icon
      src={gmailSrc}
      {...props}
    />
  );
};
