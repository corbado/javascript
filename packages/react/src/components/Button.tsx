import React from 'react';

import { Spinner } from './Spinner';

interface AdditionalProps {
    variant?: 'primary' | 'secondary' | 'tertiary';
    fullWidth?: boolean;
    isLoading?: boolean;
}

const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & React.PropsWithChildren<AdditionalProps>;

const Button: React.FunctionComponent<Props> = ({
    variant = 'tertiary',
    fullWidth = true,
    isLoading = false,
    className = '',
    disabled,
    children,
    ...rest
}) => {

    const classes = `${variants[variant]} ${className} ${fullWidth ? 'w-full' : ''}`;
    return (
        <button
            className={classes}
            disabled={disabled}
            {...rest}
        >
            {isLoading ? <Spinner /> : children}
        </button>
    );
};

export default Button;