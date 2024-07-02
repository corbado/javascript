import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface Props {
  onClick: () => void;
  className?: string;
}

export const LinkButton: FC<PropsWithChildren<Props>> = ({ onClick, className, children }) => {
  return (
    <div
      onClick={onClick}
      className={`cb-link-button ${className}`}
    >
      {children}
    </div>
  );
};
