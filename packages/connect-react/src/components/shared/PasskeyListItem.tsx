import React, { FC } from 'react';
import { WindowsIcon } from './icons/WindowsIcon';
import { AppleIcon } from './icons/AppleIcon';
import { KeyIcon } from './icons/KeyIcon';
import { format } from 'date-fns';
import { LinkButton } from './LinkButton';
import { CrossIcon } from './icons/CrossIcon';
import { Tag } from './Tag';
import { SyncIcon } from './icons/SyncIcon';
import { ShieldTickIcon } from './icons/ShieldTickIcon';
import { EyeIcon } from './icons/EyeIcon';

export type Props = {
  name: string;
  createdAt: string | Date;
  lastUsed: string | Date;
  browser: string;
  os: 'Windows' | 'macOS' | 'Android' | 'iOS' | string;
  isThisDevice?: boolean;
  isSynced?: boolean;
  isHybrid?: boolean;
  onDeleteClick: () => void;
};

export const PasskeyListItem: FC<Props> = ({
  name,
  os,
  createdAt,
  browser,
  lastUsed,
  onDeleteClick,
  isSynced,
  isHybrid,
  isThisDevice,
}) => {
  const getIcon = () => {
    switch (os) {
      case 'Windows':
        return <WindowsIcon className='cb-passkey-list-item__icon' />;
      case 'macOS':
        return <AppleIcon className='cb-passkey-list-item__icon' />;
      case 'iOS':
        return <AppleIcon className='cb-passkey-list-item__icon' />;
      default:
        return <KeyIcon className='cb-passkey-list-item__icon' />;
    }
  };

  const getTags = () => {
    const tags = [];

    if (isSynced) {
      tags.push({ text: 'Synced', icon: (className: string) => SyncIcon({ className }) });
    }

    if (isHybrid) {
      tags.push({ text: 'Hybrid', icon: (className: string) => ShieldTickIcon({ className }) });
    }

    if (isThisDevice) {
      tags.push({ text: 'Seen on this device', icon: (className: string) => EyeIcon({ className }) });
    }

    return tags;
  };

  return (
    <div className='cb-passkey-list-item'>
      {getIcon()}

      <div className='cb-passkey-list-item__content'>
        <div className='cb-passkey-list-item__header'>
          <div className='cb-passkey-list-item__tags'>
            {getTags().map(({ text, icon }) => (
              <Tag key={text}>
                {icon('cb-passkey-list-item__tag-icon')}
                <p>{text}</p>
              </Tag>
            ))}
          </div>
          <h2 className='cb-passkey-list-item__title cb-bold'>{name}</h2>
        </div>

        <p className='cb-passkey-list-item__details'>
          Created: {format(createdAt, 'dd/MM/yyyy HH:mm:ss')} with {browser} on {os}
        </p>

        <p className='cb-passkey-list-item__details'>Last used: {format(lastUsed, 'dd/MM/yyyy HH:mm:ss')}</p>
      </div>
      <div className='cb-passkey-list-item__delete-icon'>
        <LinkButton onClick={onDeleteClick}>
          <CrossIcon />
        </LinkButton>
      </div>
    </div>
  );
};
