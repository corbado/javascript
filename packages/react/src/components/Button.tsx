import React from 'react';

interface AdditionalProps {
    variant?: 'primary' | 'secondary' | 'tertiary';
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & React.PropsWithChildren<AdditionalProps>;

const Button: React.FunctionComponent<Props> = ({
    variant = 'primary',
    className,
    disabled,
    children,
    ...rest
}) => {
    return (
        <button
            className={`${className} btn-${variant}`}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;