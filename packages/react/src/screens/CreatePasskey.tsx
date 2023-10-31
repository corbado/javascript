import React from 'react'
import { useTranslation } from 'react-i18next';
import { ButtonType, PasscodeScreensWrapper } from '../components/PasscodeScreensWrapper';

export const CreatePasskey = () => {
    const { t } = useTranslation();

    const header = t('create_passkey.header');

    const primaryButton = t('create_passkey.primary_btn');
    const secondaryButton = t('create_passkey.secondary_btn');

    const handleCreatePasskey = () => console.log('Create Passkey');
    const handleBack = () => console.log('Maybe Later');

    const handleClick = (btn: ButtonType) => {
        if (btn === 'primary') {
            return handleCreatePasskey();
        }
        handleBack();
    }

    const props = {
        header,
        primaryButton,
        secondaryButton,
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
