import type { AnchorHTMLAttributes, FunctionComponent, ReactNode } from 'react';
import React from 'react';

import { Icon, type IconProps } from './Icon';

export interface IconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: IconProps;
  label: ReactNode;
}

export const IconLink: FunctionComponent<IconLinkProps> = ({ target = '_blank', className, icon, label, ...rest }) => {
  return (
    <a
      target={target}
      className={`cb-link-icon ${className ? className : ''}`}
      {...rest}
    >
      <Icon
        className='cb-icon'
        {...icon}
      />{' '}
      <p>{label}</p>
    </a>
  );
};
