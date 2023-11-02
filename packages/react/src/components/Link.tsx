import React from 'react';

interface AdditionalProps {
    route: string;
    className: string;
}

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & React.PropsWithChildren<AdditionalProps>;

const Link: React.FunctionComponent<Props> = ({ children, route, className }) => {
  return (
    <a href={route} className={` ${className}`}>{children}</a>
  );
}

export default Link;