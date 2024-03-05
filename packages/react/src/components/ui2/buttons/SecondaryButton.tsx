import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { Text } from '../typography/Text';

export interface SecondaryButtonProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const SecondaryButton: FC<PropsWithChildren<SecondaryButtonProps>> = ({
  variant = 'primary',
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

  return (
    <span onClick={handleClick}>
      <Text
        level='3'
        fontWeight='normal'
        fontFamilyVariant='secondary'
        textColorVariant='secondary'
        className={`cb-link-2 cb-${variant}-link-2 ${disabled ? 'cb-disabled' : ''} ${className ? ` ${className}` : ''}`}
      >
        {children}
      </Text>
    </span>
  );
};
