import type { AnchorHTMLAttributes, FunctionComponent, ReactNode } from 'react';
import React from 'react';

import { Text } from '../typography/Text';

export interface IconButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ReactNode;
  label: string;
  href: string;
  showIconOnly?: boolean;
  className?: string;
}

export const IconButton: FunctionComponent<IconButtonProps> = ({
  icon,
  label,
  href,
  className,
  showIconOnly = false,
  target = '_blank',
}) => {
  return (
    <a
      target={target}
      className={`cb-icon-button${showIconOnly ? `-with-icon-only` : ''}${className ? ` ${className}` : ''}`}
      href={href}
    >
      <span className='cb-icon-button-icon'>{icon}</span>
      {!showIconOnly && (
        <Text
          fontFamilyVariant='secondary'
          textColorVariant='secondary'
        >
          {label}
        </Text>
      )}
    </a>
  );
};
