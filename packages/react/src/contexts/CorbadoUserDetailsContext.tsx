import { createContext } from 'react';
import { Identifier, SocialAccount } from '@corbado/types';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider/>');
};

interface ProcessedUser {
  name: string;
  username: string;
  emails: Identifier[];
  phoneNumbers: Identifier[];
  socialAccounts: SocialAccount[];
}

export interface CorbadoUserDetailsContextProps {
  loading: boolean;
  processUser: ProcessedUser | undefined;
  name: string | undefined;
  setName: (name: string) => void;
  username: Identifier | undefined;
  setUsername: (username: Identifier | undefined) => void;
  emails: Identifier[] | undefined;
  setEmails: (email: Identifier[] | undefined) => void;
  phones: Identifier[] | undefined;
  userNameEnabled: boolean;
  emailEnabled: boolean;
  phoneEnabled: boolean;
  fullNameRequired: boolean;
  setPhones: (phone: Identifier[] | undefined) => void;
  getCurrentUser: (abortController?: AbortController) => Promise<void>;
  getConfig: (abortController?: AbortController) => Promise<void>;
}

export const initialContext: CorbadoUserDetailsContextProps = {
  loading: false,
  processUser: undefined,
  name: undefined,
  setName: missingImplementation,
  username: undefined,
  setUsername: missingImplementation,
  emails: undefined,
  setEmails: missingImplementation,
  phones: undefined,
  userNameEnabled: false,
  emailEnabled: false,
  phoneEnabled: false,
  fullNameRequired: false,
  setPhones: missingImplementation,
  getCurrentUser: missingImplementation,
  getConfig: missingImplementation,
};

export const CorbadoUserDetailsContext = createContext<CorbadoUserDetailsContextProps>(initialContext);
