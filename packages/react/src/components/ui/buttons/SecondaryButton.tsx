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

  const computedClassName = `cb-link cb-secondary-link ${disabled ? 'cb-disabled' : ''} ${
    className ? ` ${className}` : ''
  }`;

  return (
    <button
      onClick={handleClick}
      className='cb-link'
    >
      <Text
        level='2'
        fontWeight='normal'
        fontFamilyVariant='secondary'
        textColorVariant='secondary'
        className={computedClassName}
      >
        {children}
      </Text>
    </button>
  );
};
