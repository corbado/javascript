import React from 'react'
import { Trans, useTranslation } from 'react-i18next';
import { ButtonType, PasscodeScreensWrapper } from '../components/PasscodeScreensWrapper';

export const CreatePasskey = () => {
    const { t } = useTranslation();

    const header = t('create_passkey.header');
    const body = <Trans i18nKey="create_passkey.body">
        With passkeys, you don’t need to remember complex passwords anymore. Log in securely to using <strong>Face ID, Touch ID or screen lock code</strong>.
    </Trans>;;

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
        body,
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
