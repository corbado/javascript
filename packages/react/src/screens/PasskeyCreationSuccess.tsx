import React from 'react'
import { useTranslation } from 'react-i18next';
import { PasscodeScreensWrapper } from '../components/PasscodeScreensWrapper';

export const PasskeyCreationSuccess = () => {
    const { t } = useTranslation();

    const header = t('create_passkey_success.header');
    const secondaryHeader = t('create_passkey_success.body');

    const primaryButton = t('generic.continue');

    const handleContinue = () => console.log('Continue');

    const handleClick = () => {
        handleContinue();
    }

    const props = {
        header,
        secondaryHeader,
        primaryButton,
        onClick: handleClick
    }

    return (
        <>
            <PasscodeScreensWrapper
                {...props}
            />
        </>
    )
}
