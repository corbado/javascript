import React from 'react';

import Button from './Button';
import { HorizontalRule } from './HorizontalRule';
import Text from './Text';

export type ButtonType = 'primary' | 'secondary' | 'tertiary';

interface Props {
    header: React.ReactNode;
    subHeader?: React.ReactNode;
    secondaryHeader?: React.ReactNode;
    body?: React.ReactNode;
    primaryButton: string;
    secondaryButton?: string;
    tertiaryButton?: string;
    showHorizontalRule?: boolean;
    onClick(btn: ButtonType): void;
    loading?: boolean
}

export const PasskeyScreensWrapper: React.FC<Props> = ({
    header,
    subHeader,
    secondaryHeader,
    body,
    primaryButton,
    secondaryButton,
    tertiaryButton,
    showHorizontalRule = false,
    onClick,
    loading = false
}) => {
    return (
        <div>
            <Text variant="header">{header}</Text>
            {subHeader && <Text variant="sub-header" className='mt-4'>{subHeader}</Text>}
            <div className="finger-print-icon mx-auto"></div>
            {secondaryHeader && <Text variant="header" className='my-4'>{secondaryHeader}</Text>}
            {body && <Text variant="body" className='my-4'>{body}</Text>}
            {primaryButton && <Button variant='primary' onClick={() => onClick('primary')} isLoading={loading} disabled={loading}>{primaryButton}</Button>}
            {showHorizontalRule && <HorizontalRule />}
            {secondaryButton && <Button variant='secondary' onClick={() => onClick('secondary')} isLoading={loading} disabled={loading}>{secondaryButton}</Button>}
            {tertiaryButton && <Button className='my-0 !py-0' variant='tertiary' onClick={() => onClick('tertiary')} isLoading={loading} disabled={loading}>{tertiaryButton}</Button>}
        </div>
    )
}
