import { useContext } from 'react';

import type { UserDataContextProps } from '../contexts/UserDataContext';
import { UserDataContext } from '../contexts/UserDataContext';

const useUserData = (context = UserDataContext): UserDataContextProps => {
  const userData = useContext(context);

  if (!userData) {
    throw new Error('Please make sure that your components are wrapped inside <UserDataProvider />');
  }

  return userData;
};

export default useUserData;