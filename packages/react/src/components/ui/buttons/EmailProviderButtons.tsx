import React from 'react';

import { IconLink } from '../icons/IconLink';
import { GmailIcon, OutlookIcon, YahooIcon } from '../icons/Icons';

export const EmailProviderButtons = () => {
  return (
    <div className='cb-email-links'>
      <IconLink
        icon={<GmailIcon />}
        label='Google'
        href='https://mail.google.com/mail/u/0/#search/from%3A%40corbado+in%3Aanywhere'
      />
      <IconLink
        icon={<YahooIcon />}
        label='Yahoo'
        href='https://mail.yahoo.com/d/search/keyword=corbado.com'
      />
      <IconLink
        icon={<OutlookIcon />}
        label='Outlook'
        href='https://outlook.office.com/mail/0/inbox'
      />
    </div>
  );
};
