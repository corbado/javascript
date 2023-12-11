import type { FlowNames } from '@corbado/shared-ui';
import { createContext } from 'react';

export interface UserDataContextProps {
  email: string | undefined;
  userName: string | undefined;
  setEmail: (value: string) => void;
  setUserName: (value: string) => void;
  sendEmail: (currentFlow: FlowNames) => void;
}

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <UserDataProvider/>');
};

export const initialContext = {
  email: undefined,
  userName: undefined,
  setEmail: missingImplementation,
  setUserName: missingImplementation,
  sendEmail: missingImplementation,
};

export const UserDataContext = createContext<UserDataContextProps>(initialContext);
