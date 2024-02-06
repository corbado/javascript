import cancelSrc from '@corbado/shared-ui/assets/cancel.svg';
import deleteSrc from '@corbado/shared-ui/assets/delete.svg';
import fingerprintSrc from '@corbado/shared-ui/assets/fingerprint.svg';
import gmailSrc from '@corbado/shared-ui/assets/gmail.svg';
import corbadoLogoSrc from '@corbado/shared-ui/assets/logo.svg';
import outlookSrc from '@corbado/shared-ui/assets/outlook.svg';
import passkeyDefaultSrc from '@corbado/shared-ui/assets/passkey-default.svg';
import yahooSrc from '@corbado/shared-ui/assets/yahoo.svg';
import type { CSSProperties } from 'react';
import React from 'react';

import { Icon } from './Icon';

export type IconProps = {
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

export const DeleteIcon = (props: IconProps) => {
  return (
    <Icon
      src={deleteSrc}
      alt='delete'
      {...props}
    />
  );
};

export const PasskeyDefaultIcon = (props: IconProps) => {
  return (
    <Icon
      src={passkeyDefaultSrc}
      alt='passkey-default'
      {...props}
    />
  );
};

export const YahooIcon = (props: IconProps) => {
  return (
    <Icon
      src={yahooSrc}
      alt='yahoo'
      {...props}
    />
  );
};

export const GmailIcon = (props: IconProps) => {
  return (
    <Icon
      src={gmailSrc}
      alt='gmail'
      {...props}
    />
  );
};

export const OutlookIcon = (props: IconProps) => {
  return (
    <Icon
      src={outlookSrc}
      alt='outlook'
      {...props}
    />
  );
};

export const FingerprintIcon = (props: IconProps) => {
  return (
    <Icon
      src={fingerprintSrc}
      alt='fingerprint'
      {...props}
    />
  );
};

export const CancelIcon = (props: IconProps) => {
  return (
    <Icon
      src={cancelSrc}
      alt='cancel'
      {...props}
    />
  );
};

export const CorbadoLogoIcon = (props: IconProps) => {
  return (
    <Icon
      src={corbadoLogoSrc}
      alt='corbado-logo'
      {...props}
    />
  );
};
