import React from 'react'
import { useTranslation } from 'react-i18next';
import { ButtonType, PasscodeScreensWrapper } from '../components/PasscodeScreensWrapper';

export const CreatePasskey = () => {
    const { t } = useTranslation();

    const header = t('create_passkey_error.header');
    const body = t('create_passkey_error.body');

    const primaryButton = t('create_passkey_error.primary_btn');
    const secondaryButton = t('create_passkey_error.secondary_btn');
    const tertiaryButton = t('create_passkey_error.tertiary');

    const handleCreatePasskey = () => console.log('Try again');
    const handleSendOtp = () => console.log('Send email OTP');
    const handleBack = () => console.log('Go back');

    const handleClick = (btn: ButtonType) => {
        if (btn === 'primary') {
            return handleCreatePasskey();
        }
        if (btn === 'secondary') {
            return handleSendOtp();
        }
        handleBack();
    }

    const props = {
        header,
        body,
        primaryButton,
        secondaryButton,
        tertiaryButton,
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
