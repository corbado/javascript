import type { TFunction } from 'i18next';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import type { IconButtonProps } from './buttons/IconButton';
import { IconButton } from './buttons/IconButton';
import AppleIcon from './icons/AppleLogo';
import { GmailIcon } from './icons/GmailIcon';
import { OutlookIcon } from './icons/OutlookIcon';
import { YahooIcon } from './icons/YahooIcon';
import type { TextProps } from './typography';

interface EmailLinksProps {
  className?: string;
  email: string;
  t: TFunction;
}

export const EmailLinks: FC<EmailLinksProps> = ({ email: initialEmail, t, className }) => {
  const emailButton = useMemo(() => {
    const email = initialEmail.toLowerCase();
    const labelProps: TextProps = {
      level: '2',
      textColorVariant: 'primary',
    };
    let iconButtonProps: IconButtonProps | null = null;

    if (email.includes('@gmail') || email.includes('@googlemail')) {
      iconButtonProps = {
        icon: <GmailIcon />,
        label: t('button_gmail'),
        href: 'https://mail.google.com/mail/u/0/#search/from%3A%40corbado+in%3Aanywhere',
      };
    } else if (email.includes('@yahoo')) {
      iconButtonProps = {
        icon: <YahooIcon />,
        label: t('button_yahoo'),
        href: 'https://mail.yahoo.com/d/folders/1/messages/new?reason=U&filterBy=Inbox&filterIn=Inbox&sort=date&order=desc',
      };
    } else if (email.includes('@outlook') || email.includes('@hotmail') || email.includes('@live')) {
      iconButtonProps = {
        icon: <OutlookIcon />,
        label: t('button_outlook'),
        href: 'https://outlook.office.com/mail/0/inbox',
      };
    } else if (email.includes('@icloud')) {
      iconButtonProps = {
        icon: <AppleIcon />,
        label: t('button_icloud'),
        //TODO: Update this link to the correct one for iCloud mail
        href: 'https://www.icloud.com/mail',
      };
    }

    if (iconButtonProps) {
      return (
        <IconButton
          className='cb-email-link'
          labelProps={labelProps}
          {...iconButtonProps}
        />
      );
    }

    return null;
  }, [initialEmail]);

  return emailButton ? (
    <div className={`cb-email-links ${className ? ` ${className}` : ''}`}>{emailButton}</div>
  ) : (
    <div className='cb-phone-otp-input-container'></div>
  );
};
