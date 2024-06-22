import React from 'react';

export type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export const PasskeyInfoListItem = ({ title, description, icon }: Props) => {
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
