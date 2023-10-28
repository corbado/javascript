import React from 'react'

type Variants = 'header' | 'sub-header' | 'body';

interface Props {
    variant?: Variants;
    children: React.ReactNode;
    className?: string;
}

const Text: React.FC<Props> = ({ variant = 'body', children, className = '' }) => {
    if (variant === 'header') {
        return (<h1 className={`header ${className}`}>{children}</h1>);
    }
    if (variant === 'sub-header') {
        return (<h2 className={`sub-header ${className}`}>{children}</h2>);
    }
    return (<p className={`body ${className}`}>{children}</p>);
};

export default Text;