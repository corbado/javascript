import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface LinkProps {
  href: string;
  className?: string;
}

export const Link: FC<PropsWithChildren<LinkProps>> = ({ href, className, children }) => {
  return (
    <a
      href={href}
      className={`cb-link-2 ${className}`}
    >
      {children}
    </a>
  );
};
