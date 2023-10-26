import React from 'react';

interface AdditionalProps {
    link: string;
    className: string;
}

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & React.PropsWithChildren<AdditionalProps>;

const Link: React.FunctionComponent<Props> = ({ children, link, className }) => {
  return (
    <a href={link} className={` ${className}`}>{children}</a>
  );
}

export default Link;