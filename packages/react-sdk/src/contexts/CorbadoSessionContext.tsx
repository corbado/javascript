import type { SessionUser } from '@corbado/types';
import { createContext } from 'react';

export interface CorbadoSessionContextProps {
  shortSession: string | undefined;
  loading: boolean;
  isAuthenticated: boolean;
  user: SessionUser | undefined;
}

export const initialContext: CorbadoSessionContextProps = {
  shortSession: undefined,
  loading: true,
  isAuthenticated: false,
  user: undefined,
};

export const CorbadoSessionContext = createContext<CorbadoSessionContextProps>(initialContext);
