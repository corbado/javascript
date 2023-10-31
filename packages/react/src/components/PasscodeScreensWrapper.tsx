import React from 'react';
import Text from '../components/Text';
import Button from '../components/Button';
import { HorizontalRule } from '../components/HorizontalRule';

export type ButtonType = 'primary' | 'secondary' | 'tertiary';

interface Props {
    header: React.ReactNode;
    subHeader: React.ReactNode;
    primaryButton: string;
    secondaryButton: string;
    tertiaryButton?: string;
    showHorizontalRule?: boolean;
    onClick(btn: ButtonType): void;
}

export const PasscodeScreensWrapper: React.FC<Props> = ({
    header,
    subHeader,
    primaryButton,
    secondaryButton,
    tertiaryButton,
    showHorizontalRule = false,
    onClick
}) => {
    return (
        <div>
            <Text variant="header">{header}</Text>
            {subHeader && <Text variant="sub-header" className='mt-4'>{subHeader}</Text>}
            <div className="finger-print-icon mx-auto"></div>
            {primaryButton && <Button variant='primary' onClick={() => onClick('primary')}>{primaryButton}</Button>}
            {showHorizontalRule && <HorizontalRule />}
            {secondaryButton && <Button variant='secondary' onClick={() => onClick('secondary')}>{secondaryButton}</Button>}
            {tertiaryButton && <Button className='my-0 !py-0' variant='tertiary' onClick={() => onClick('tertiary')}>{tertiaryButton}</Button>}
        </div>
    )
}
