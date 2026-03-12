import type { CorbadoTracker } from '@corbado/observe';
import { createContext } from 'react';

export interface ObserveContextProps {
  tracker: CorbadoTracker | undefined;
}

export const ObserveContext = createContext<ObserveContextProps>({ tracker: undefined });
