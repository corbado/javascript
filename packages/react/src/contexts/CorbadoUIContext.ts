import type { CorbadoUIConfig } from '@corbado/types';
import { createContext } from 'react';

export interface CorbadoUIContextProps {
  config: CorbadoUIConfig;
}

export const initialContext = {
  config: {},
};

export const CorbadoUIContext = createContext<CorbadoUIContextProps>(initialContext);
