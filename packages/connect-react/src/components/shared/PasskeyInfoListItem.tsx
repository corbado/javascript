import React from 'react';

export type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export const PasskeyInfoListItem = ({ title, description, icon }: Props) => {
  return (
    <div className='cb-passkey-info-list-item'>
      <div className='cb-passkey-info-list-item-icon'>{icon}</div>
      <div className='cb-passkey-info-list-item-text'>
        <div className='cb-span cb-bold cb-passkey-info-list-item-header'>{title}</div>
        <div className='cb-span'>{description}</div>
      </div>
    </div>
  );
};
