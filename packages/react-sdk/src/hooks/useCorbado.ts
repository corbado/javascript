import { useContext } from 'react';

import type { CorbadoContextProps } from '../contexts/CorbadoContext';
import { CorbadoContext } from '../contexts/CorbadoContext';

export const useCorbado = (context = CorbadoContext): CorbadoContextProps => useContext(context);
