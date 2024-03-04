import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface TextProps {
  className?: string;
  level?: '1' | '2' | '3' | '4' | '5' | '6';
  fontFamilyVariant?: 'primary' | 'secondary';
  fontWeight?: 'normal' | 'bold';
  textColorVariant?: 'primary' | 'secondary';
}

export const Text: FC<PropsWithChildren<TextProps>> = ({
  level = '1',
  fontFamilyVariant = 'primary',
  fontWeight = 'normal',
  textColorVariant = 'primary',
  className,
  children,
}) => {
  return (
    <span
      className={`cb-${textColorVariant}-text-color-2 cb-${fontWeight}-text-weight-2 cb-${fontFamilyVariant}-text-font-2 cb-text-${level}-2 ${className ?? ''}`}
    >
      {children}
    </span>
  );
};
