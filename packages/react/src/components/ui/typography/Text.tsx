import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface TextProps {
  className?: string;
  level?: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  fontFamilyVariant?: 'primary' | 'secondary';
  fontWeight?: 'normal' | 'bold';
  textColorVariant?: 'primary' | 'secondary' | 'header';
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
      className={`cb-${textColorVariant}-text-color cb-${fontWeight}-text-weight cb-${fontFamilyVariant}-text-font cb-text-${level}${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </span>
  );
};
