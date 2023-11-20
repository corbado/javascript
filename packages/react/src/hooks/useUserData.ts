import { useContext } from 'react';

import type { UserDataContextInterface } from './UserDataContext';
import UserDataContext from './UserDataContext';

const useUserData = (context = UserDataContext): UserDataContextInterface =>
  useContext(context) ;

export default useUserData;
