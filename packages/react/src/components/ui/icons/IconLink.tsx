import type { AnchorHTMLAttributes, FunctionComponent, ReactNode } from 'react';
import React from 'react';

export interface IconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ReactNode;
  label: string;
}

export const IconLink: FunctionComponent<IconLinkProps> = ({ target = '_blank', icon, label }) => {
  return (
    <a
      target={target}
      className={`cb-link-icon`}
    >
      {icon} <p>{label}</p>
    </a>
  );
};
