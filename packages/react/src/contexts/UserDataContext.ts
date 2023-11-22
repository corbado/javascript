import { createContext } from 'react';

export interface UserDataContextInterface {
  email: string | undefined;
  userName: string | undefined;
  setEmail: (value: string) => void;
  setUserName: (value: string) => void;
}

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <UserDataProvider/>');
};

export const initialContext = {
  email: undefined,
  userName: undefined,
  setEmail: missingImplementation,
  setUserName: missingImplementation,
};

const UserDataContext = createContext<UserDataContextInterface>(initialContext);

export default UserDataContext;
