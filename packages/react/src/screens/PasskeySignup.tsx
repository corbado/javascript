import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonType, PasscodeScreensWrapper } from '../components/PasscodeScreensWrapper';

export const PasskeySignup = () => {
    const { t } = useTranslation();

    const email_address = 'janina+test125@corbado.com';

    const header = <Trans i18nKey="passkey_signup.header">
        text <span className="text-primary-color underline">x</span> text
    </Trans>;

    const subHeader = <Trans i18nKey="passkey_signup.sub-header">
        text <span className="text-secondary-font-color">{{email_address} as any}</span> text
    </Trans>;

    const primaryButton = t('passkey_signup.primary_btn');
    const secondaryButton = t('passkey_signup.secondary_btn');
    const tertiaryButton = t('passkey_signup.tertiary_btn');

    const handleCreateAccount = () => console.log('Create Account with Passkey');
    const handleSendOtp = () => console.log('Send email OTP');
    const handleBack = () => console.log('Go Back');

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
            <PasscodeScreensWrapper
                {...props}
            />
        </>
    )
}
