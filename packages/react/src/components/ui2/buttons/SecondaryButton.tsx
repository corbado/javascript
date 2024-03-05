import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface SecondaryButtonProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick: () => void;
}

export const SecondaryButton: FC<PropsWithChildren<SecondaryButtonProps>> = ({
  variant = 'primary',
  className,
  children,
  onClick,
}) => {
  return (
    <span
      className={`cb-link-2 cb-${variant}-link-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
