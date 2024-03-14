import emailLinkSuccessSrc from '@corbado/shared-ui/assets/email-link-success.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const EmailLinkSuccessIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, emailLinkSuccessSrc, '--cb-primary-color');

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='device-icon'
      {...props}
    />
  );
});
