import React from 'react';

interface AdditionalProps {
  className: string;
  target?: string;
}

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & React.PropsWithChildren<AdditionalProps>;

export const Link: React.FunctionComponent<Props> = ({ children, target = '_blank', className, ...rest }) => {
  return (
    <a
      target={target}
      className={` ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
};
