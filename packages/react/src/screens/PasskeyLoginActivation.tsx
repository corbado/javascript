import { useCorbadoAuth, useCorbadoFlowHandler } from '@corbado/react-sdk';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';

export const PasskeyLoginActivation = () => {
    const { t } = useTranslation();
    const { navigateToNextScreen } = useCorbadoFlowHandler();
    const { passkeyAppend } = useCorbadoAuth();


    const showBenefit = () => void navigateToNextScreen({ showBenefit: true });

    const header = <Trans i18nKey="activate_passkey.header">
        text <span onClick={showBenefit} className="text-primary-color underline">x</span>
    </Trans>;

    const primaryButton = t('activate_passkey.primary_btn');
    const secondaryButton = t('activate_passkey.secondary_btn');

    const appendPasskey = async () => {
        try {
            const response = await passkeyAppend();
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

    const handlePasskeyActivation = () => void appendPasskey();
    const handleLater = () => void navigateToNextScreen({ maybeLater: true });

    const handleClick = (btn: ButtonType) => {

        if (btn === 'primary') {
            return handlePasskeyActivation();
        }
        handleLater();
    }

    const props = {
        header,
        primaryButton,
        secondaryButton,
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
