import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Text from '../components/Text';
import Button from '../components/Button';
import { HorizontalRule } from '../components/HorizontalRule';

export const PasskeySignup = () => {
    const { t } = useTranslation();

    const email_address = 'janina+test125@corbado.com';

    return (
        <>
            <Text variant="header">
                {/* "text" is a placeholder value for translations */}
                <Trans i18nKey="passkey_signup.header">
                    text <span className="text-primary-color underline">x</span> text
                </Trans>
            </Text>
            <Text variant="sub-header" className='mt-4'>
                {/* "text" is a placeholder value for translations */}
                <Trans i18nKey="passkey_signup.sub-header">
                    text <span className="text-secondary-font-color">{{email_address} as any}</span> text
                </Trans>
            </Text>
            <div className="finger-print-icon mx-auto"></div>
            <Button variant='primary'>{t('passkey_signup.primary_btn')}</Button>
            <HorizontalRule />
            <Button variant='secondary'>{t('passkey_signup.secondary_btn')}</Button>
            <Button className='my-0 !py-0' variant='tertiary'>{t('passkey_signup.tertiary_btn')}</Button>
        </>
    )
}
