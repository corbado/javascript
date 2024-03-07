import faceIdSrc from '@corbado/shared-ui/assets/face-id.svg';
import type { FC } from 'react';
import React from 'react';

import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const FaceIdIcon: FC<IconProps> = props => {
  return (
    <Icon
      src={faceIdSrc}
      {...props}
    />
  );
};
