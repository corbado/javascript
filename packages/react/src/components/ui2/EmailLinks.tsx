import type { FC } from 'react';
import React from 'react';

import { IconButton } from './buttons/IconButton';
import { GmailIcon } from './icons/GmailIcon';
import { OutlookIcon } from './icons/OutlookIcon';
import { YahooIcon } from './icons/YahooIcon';

interface EmailLinksProps {
  className?: string;
  gmailButtonLabel: string;
  yahooButtonLabel: string;
  outlookButtonLabel: string;
}

export const EmailLinks: FC<EmailLinksProps> = ({
  className,
  gmailButtonLabel,
  yahooButtonLabel,
  outlookButtonLabel,
}) => {
  return (
    <div className={`cb-email-links-2 ${className ? ` ${className}` : ''}`}>
      <IconButton
        icon={<GmailIcon />}
        label={gmailButtonLabel}
        href='https://mail.google.com/mail/u/0/#search/from%3A%40corbado+in%3Aanywhere'
      />
      <IconButton
        icon={<YahooIcon />}
        label={yahooButtonLabel}
        href='https://mail.yahoo.com/d/search/keyword=corbado.com'
      />
      <IconButton
        icon={<OutlookIcon />}
        label={outlookButtonLabel}
        href='https://outlook.office.com/mail/0/inbox'
      />
    </div>
  );
};
