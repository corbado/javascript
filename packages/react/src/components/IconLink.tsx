import type { AnchorHTMLAttributes, FunctionComponent, ReactNode, SVGProps } from 'react';
import React from 'react';

export interface IconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: ReactNode;
}

export const IconLink: FunctionComponent<IconLinkProps> = ({ target = '_blank', className, Icon, label, ...rest }) => {
  return (
    <a
      target={target}
      className={`cb-link-icon ${className}`}
      {...rest}
    >
      <Icon className='cb-icon' /> <p className={``}>{label}</p>
    </a>
  );
};
