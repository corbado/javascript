import React from 'react'
import {Trans, useTranslation} from 'react-i18next';

import type {ButtonType} from '../components/PasscodeScreensWrapper';
import {PasscodeScreensWrapper} from '../components/PasscodeScreensWrapper';
import useUserData from "../hooks/useUserData";
import {useCorbado} from "@corbado/react-sdk";
import useFlowHandler from "../hooks/useFlowHandler";

export const CreatePasskey = () => {
    const {t} = useTranslation();
    const {email, userName} = useUserData()
    const {signUpWithPasskey} = useCorbado()
    const {navigateNext} = useFlowHandler()

    const header = t('create_passkey.header');
    const body =
        <Trans i18nKey="create_passkey.body">
            With passkeys, you don’t need to remember complex passwords anymore. Log in securely to using <strong>Face
            ID,
            Touch ID or screen lock code</strong>.
        </Trans>

    const primaryButton = t('create_passkey.primary_btn');
    const secondaryButton = t('create_passkey.secondary_btn');

    const handleCreatePasskey = async () => {
        if (!email || !userName) {
            return
        }

        try {
            await signUpWithPasskey(email, userName)
            return navigateNext('passkey_success')
        } catch (e) {
            return navigateNext('passkey_error')
        }
    }
    const handleBack = () => {
        return navigateNext('email_otp')
    }

    const handleClick = async (btn: ButtonType) => {
        if (btn === 'primary') {
            return handleCreatePasskey();
        }

        return handleBack();
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
