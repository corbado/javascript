import type { AnchorHTMLAttributes, FunctionComponent, ReactNode } from 'react';
import React from 'react';

import { Text } from '../typography/Text';

export interface IconButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ReactNode;
  label: string;
  href: string;
}

export const IconButton: FunctionComponent<IconButtonProps> = ({ target = '_blank', icon, label, href }) => {
  return (
    <a
      target={target}
      className='cb-icon-button'
      href={href}
    >
      <span className='cb-icon-button-icon'>{icon}</span>
      <Text
        fontFamilyVariant='primary'
        textColorVariant='primary'
      >
        {label}
      </Text>
    </a>
  );
};
