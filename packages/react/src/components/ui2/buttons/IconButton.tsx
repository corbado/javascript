import type { AnchorHTMLAttributes, FunctionComponent, ReactNode } from 'react';
import React from 'react';

import type { TextProps } from '../typography/Text';
import { Text } from '../typography/Text';

export interface IconButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  showIconOnly?: boolean;
  className?: string;
  labelProps?: TextProps;
}

export const IconButton: FunctionComponent<IconButtonProps> = ({
  icon,
  label,
  href,
  className,
  labelProps,
  showIconOnly = false,
  onClick,
  target = '_blank',
}) => {
  // TODO @Abdullah: Maybe we should rely on buttons instead of href for IconButton
  if (href) {
    return (
      <a
        target={target}
        className={`cb-icon-button${showIconOnly ? `-with-icon-only` : ''}${className ? ` ${className}` : ''}`}
        href={href}
      >
        <span className='cb-icon-button-icon'>{icon}</span>
        {!showIconOnly && <Text {...labelProps}>{label}</Text>}
      </a>
    );
  }

  return (
    <button
      className={`cb-icon-button${showIconOnly ? `-with-icon-only` : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
    >
      <span className='cb-icon-button-icon'>{icon}</span>
      {!showIconOnly && <Text {...labelProps}>{label}</Text>}
    </button>
  );
};
