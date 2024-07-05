import React from 'react';

export type Props = {
  name: string;
  createdAt: string | Date;
  lastUsed: string | Date;
  browser: string;
  os: 'Windows' | 'Mac' | 'Android' | 'iOS';
  isThisDevice?: boolean;
  isSynced?: boolean;
  isHybrid?: boolean;
};

export const PasskeyListItem: FC<Props> = ({ name, createdAt, browser, os, isThisDevice, isSynced, isHybrid }) => {
  return (
    <div className='cb-passkey-info-list-item'>
      <div className='cb-passkey-info-list-item__icon'>{icon}</div>
      <div className='cb-passkey-info-list-item__text'>
        <div className='cb-span cb-bold'>{title}</div>
        <div className='cb-span'>{description}</div>
      </div>
    </div>
  );
};
