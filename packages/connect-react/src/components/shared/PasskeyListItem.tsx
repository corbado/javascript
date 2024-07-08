import React, { FC } from 'react';

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

export const PasskeyListItem: FC<Props> = ({  }) => {
  return (
    <div className='cb-passkey-info-list-item'>
    </div>
  );
};
