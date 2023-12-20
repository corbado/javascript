import { useContext } from 'react';

import type { CorbadoContextProps } from '../contexts';
import { CorbadoContext } from '../contexts';

export const useCorbado = (context = CorbadoContext): CorbadoContextProps => useContext(context);
