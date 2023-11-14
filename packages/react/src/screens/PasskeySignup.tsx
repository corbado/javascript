import { useCorbadoAuth, useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';

export const PasskeySignup = () => {
    const { t } = useTranslation();

    const { navigateToNextScreen, navigateBack } = useCorbadoFlowHandler();
    const { passkeyRegister, getEmail } = useCorbadoAuth();

    const email = getEmail();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailPlaceholder = { email } as any;

    const showBenefit = () => void navigateToNextScreen({ showBenefit: true })

    const header = <Trans i18nKey="passkey_signup.header">
        text <span onClick={showBenefit} className="text-primary-color underline">x</span> text
    </Trans>;

    const subHeader = <Trans i18nKey="passkey_signup.sub-header">
        text <span className="text-secondary-font-color">{emailPlaceholder}</span> text
    </Trans>;

    const primaryButton = t('passkey_signup.primary_btn');
    const secondaryButton = t('passkey_signup.secondary_btn');
    const tertiaryButton = t('passkey_signup.tertiary_btn');

    const createPasskey = async () => {
        try {
            const response = await passkeyRegister();
            if (response) {
                await navigateToNextScreen({ success: true });
                return;
            }
            await navigateToNextScreen({ failure: false });
        } catch (error) {
            console.log(error);
            await navigateToNextScreen({ failure: true });
        }
    }

    const handleCreateAccount = () => void createPasskey();
    const handleSendOtp = () => void navigateToNextScreen({ sendOtpEmail: true });
    const handleBack = () => navigateBack();

    const handleClick = (btn: ButtonType) => {
        if (btn === 'primary') {
            return handleCreateAccount();
        }
        if (btn === 'secondary') {
            return handleSendOtp();
        }
        handleBack();
    }

    const props = {
        header,
        subHeader,
        primaryButton,
        showHorizontalRule: true,
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
