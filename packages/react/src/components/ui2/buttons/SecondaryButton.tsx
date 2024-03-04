import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface SecondaryButtonProps {
  className?: string;
  onClick: () => void;
}

export const SecondaryButton: FC<PropsWithChildren<SecondaryButtonProps>> = ({ className, children, onClick }) => {
  return (
    <span
      className={`cb-link-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
