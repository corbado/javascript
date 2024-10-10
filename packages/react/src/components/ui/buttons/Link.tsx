import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface LinkProps {
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Link: FC<PropsWithChildren<LinkProps>> = ({ href, className, children, onClick }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`cb-link cb-secondary-link ${className}`}
    >
      {children}
    </a>
  );
};
