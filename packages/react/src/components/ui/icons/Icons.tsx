import deleteSrc from '@corbado/shared-ui/assets/delete.svg';
import fingerprintSrc from '@corbado/shared-ui/assets/fingerprint.svg';
import gmailSrc from '@corbado/shared-ui/assets/gmail.svg';
import outlookSrc from '@corbado/shared-ui/assets/outlook.svg';
import passkeyDefaultSrc from '@corbado/shared-ui/assets/passkey-default.svg';
import yahooSrc from '@corbado/shared-ui/assets/yahoo.svg';
import React from 'react';

import { Icon } from './Icon';

type Props = {
  onClick?: () => void;
  className?: string;
};

export const DeleteIcon = (props: Props) => {
  return (
    <Icon
      src={deleteSrc}
      alt='delete'
      {...props}
    />
  );
};

export const PasskeyDefaultIcon = (props: Props) => {
  return (
    <Icon
      src={passkeyDefaultSrc}
      alt='passkey-default'
      {...props}
    />
  );
};

export const YahooIcon = (props: Props) => {
  return (
    <Icon
      src={yahooSrc}
      alt='yahoo'
      {...props}
    />
  );
};

export const GmailIcon = (props: Props) => {
  return (
    <Icon
      src={gmailSrc}
      alt='gmail'
      {...props}
    />
  );
};

export const OutlookIcon = (props: Props) => {
  return (
    <Icon
      src={outlookSrc}
      alt='outlook'
      {...props}
    />
  );
};

export const FingerprintIcon = (props: Props) => {
  return (
    <Icon
      src={fingerprintSrc}
      alt='fingerprint'
      {...props}
    />
  );
};
