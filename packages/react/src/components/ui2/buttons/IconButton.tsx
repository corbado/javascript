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
      className='cb-icon-button-2'
      href={href}
    >
      <span className='cb-icon-button-icon-2'>{icon}</span>
      <Text
        fontFamilyVariant='secondary'
        textColorVariant='secondary'
        fontWeight='bold'
      >
        {label}
      </Text>
    </a>
  );
};
