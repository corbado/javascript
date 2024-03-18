import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { Text } from '../typography/Text';

export interface SecondaryButtonProps {
  colorVariant?: 'default' | 'link';
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const SecondaryButton: FC<PropsWithChildren<SecondaryButtonProps>> = ({
  colorVariant = 'default',
  disabled,
  className,
  children,
  onClick,
}) => {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    onClick();
  };

  const variant = colorVariant === 'link' ? 'secondary' : 'primary';
  const computedClassName = `cb-link-2 cb-${variant}-link-2 ${disabled ? 'cb-disabled' : ''} ${className ? ` ${className}` : ''}`;

  return (
    <span onClick={handleClick}>
      <Text
        level='2'
        fontWeight='normal'
        fontFamilyVariant='secondary'
        textColorVariant='secondary'
        className={computedClassName}
      >
        {children}
      </Text>
    </span>
  );
};