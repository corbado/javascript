import React from 'react'

type Variants = 'header' | 'sub-header' | 'body';

interface Props {
    variant: Variants;
    children: React.ReactNode;
}

const Text: React.FunctionComponent<Props> = ({ variant = 'body', children }) => {
    if (variant === 'header') {
        return (<h1 className='header'>{children}</h1>);
    }
    if (variant === 'sub-header') {
        return (<h2 className='sub-header'>{children}</h2>);
    }
    return (<p className='body'>{children}</p>);
};

export default Text;