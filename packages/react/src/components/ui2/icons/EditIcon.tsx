import editSrc from '@corbado/shared-ui/assets/edit.svg';
import type { FC } from 'react';
import React from 'react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const EditIcon: FC<IconProps> = props => {
  return (
    <Icon
      src={editSrc}
      {...props}
    />
  );
};
