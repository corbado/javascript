import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Text from '../components/Text';
import Button from '../components/Button';
import { Gmail, Yahoo, Outlook } from '../components/icons';
import OTPInput from '../components/OTPInput';
import Link from '../components/Link';

export const EmailLink = () => {
    const { t } = useTranslation();

    const handleOtp = (otp: string[]) => {
        console.log({ otp })
    }

    return (
        <>
            <Text variant="header">{t('email_link.header')}</Text>
            <Text className='font-medium'>
                {/* "text" is a placeholder value for translations */}
                <Trans i18nKey="email_link.body">
                    text <span className='text-secondary-font-color'>email adress</span> text
                </Trans>
            </Text>
            <div className='grid grid-cols-3 gap-3 mt-4'>
                <Link route="" className="flex items-center email-client h-12 border border-light-color rounded-full px-3">
                    <Gmail /> <Text className='font-bold pl-2'>Google</Text>
                </Link>
                <Link route="" className="flex items-center email-client h-12 border border-light-color rounded-full px-3">
                    <Yahoo /> <Text className='font-bold pl-2'>Yahoo</Text>
                </Link>
                <Link route="" className="flex items-center email-client h-12 border border-light-color rounded-full px-3">
                    <Outlook /> <Text className='font-bold pl-2'>Outlook</Text>
                </Link>
            </div>
            <OTPInput emittedOTP={handleOtp} />
            <Button className='mt-4' variant='primary'>{t('generic.continue')}</Button>
            <Button variant='tertiary'>{t('generic.cancel')}</Button>
        </>
    )
}