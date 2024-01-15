import type { AnchorHTMLAttributes, FunctionComponent, ReactNode } from 'react';
import React from 'react';

export interface IconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ReactNode;
  label: string;
  href: string;
}

export const IconLink: FunctionComponent<IconLinkProps> = ({ target = '_blank', icon, label, href }) => {
  return (
    <a
      target={target}
      className={`cb-link-icon`}
      href={href}
    >
      {icon} <p>{label}</p>
    </a>
  );
};
