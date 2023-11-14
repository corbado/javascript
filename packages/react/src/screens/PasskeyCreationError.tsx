import { useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react'
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType} from '../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';

export const PasskeyCreationError = () => {
    const { t } = useTranslation();
    const { navigateToNextScreen, navigateBack } = useCorbadoFlowHandler();

    const showBenefit = () => void navigateToNextScreen({ showBenefit: true })

    const header = t('create_passkey_error.header');
    const body = <Trans i18nKey="create_passkey_error.body">
        Creating your account with <strong onClick={showBenefit} className='text-primary-color underline'>passkeys</strong> not possible. Try again or log in with email one time code.
    </Trans>;

    const primaryButton = t('create_passkey_error.primary_btn');
    const secondaryButton = t('create_passkey_error.secondary_btn');
    const tertiaryButton = t('create_passkey_error.tertiary_btn');

    const handleCreatePasskey = () => void navigateToNextScreen({ success: true });
    const handleSendOtp = () => void navigateToNextScreen({ sendOtpEmail: true });
    const handleBack = () => navigateBack();

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
            <PasskeyScreensWrapper
                {...props}
            />
        </>
    )
}
