import type { FC, PropsWithChildren } from 'react';
import { Text } from '../ui';
import React from 'react';

interface Props extends PropsWithChildren {
  header: string;
}

const UserDetailsCard: FC<Props> = ({ header, children }) => {
  return (
    <div className='cb-user-details-card'>
      <Text className='cb-user-details-header'>{header}</Text>
      <div className='cb-user-details-body'>{children}</div>
    </div>
  );
};

export default UserDetailsCard;
