import type { FC, ReactNode } from 'react';
import React, { useMemo } from 'react';

import { LoadingSpinner, Text, type TextProps } from '..';

export interface IconButtonProps {
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  showIconOnly?: boolean;
  className?: string;
  labelProps?: TextProps;
  disabled?: boolean;
  loading?: boolean;
}

export const IconButton: FC<IconButtonProps> = ({
  icon,
  label,
  href,
  className,
  labelProps,
  disabled,
  loading,
  showIconOnly = false,
  onClick,
}) => {
  const buttonClasses = `cb-icon-button${showIconOnly ? `-with-icon-only` : ''}${className ? ` ${className}` : ''}`;
  const content = useMemo(() => {
    return (
      <>
        <span className='cb-icon-button-icon'>{icon}</span>
        {!showIconOnly && <Text {...labelProps}>{label}</Text>}
      </>
    );
  }, [icon, label, showIconOnly, labelProps]);

  if (href) {
    return (
      <a
        className={buttonClasses}
        href={href}
        target='_blank'
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      title={showIconOnly ? label : undefined}
      disabled={disabled || loading}
    >
      {loading ? <LoadingSpinner className='cb-social-login-button-loading-spinner' /> : content}
    </button>
  );
};
