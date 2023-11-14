import { useCorbadoAuth, useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react'
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';

export const CreatePasskeyBenefit = () => {
    const { t } = useTranslation();

    const { navigateToNextScreen } = useCorbadoFlowHandler();
    const { isAuthenticated, passkeyRegister } = useCorbadoAuth();

    const isUserAuthenticated = isAuthenticated();

    const header = t('create_passkey.header');
    const body = <Trans i18nKey="create_passkey.body">
        With passkeys, you don’t need to remember complex passwords anymore. Log in securely to using <strong>Face ID, Touch ID or screen lock code</strong>.
    </Trans>;

    const primaryButton = t('create_passkey.primary_btn');
    const secondaryButton = t('create_passkey.secondary_btn');
    const tertiaryButton = t('create_passkey.tertiary_btn');

    const createPasskey = async () => {
        try {
            const response = await passkeyRegister();
            if (response) {
                await navigateToNextScreen({ success: true });
            }
        } catch (error) {
            console.log(error);
            await navigateToNextScreen({ failure: true });
        }
    }

    const handleCreatePasskey = () => void createPasskey();
    const handleBackOrLater = () => navigateToNextScreen({ maybeLater: true, isUserAuthenticated });

    const handleClick = (btn: ButtonType) => {
        if (btn === 'primary') {
            return handleCreatePasskey();
        }
        void handleBackOrLater();
    }

    const props = {
        header,
        body,
        primaryButton,
        secondaryButton: isUserAuthenticated ? secondaryButton: undefined,
        tertiaryButton: !isUserAuthenticated ? tertiaryButton : undefined,
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
