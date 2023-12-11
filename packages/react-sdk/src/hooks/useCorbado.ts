import { useContext } from 'react';

import type { CorbadoContextInterface } from '../contexts/CorbadoContext';
import { CorbadoContext } from '../contexts/CorbadoContext';

export const useCorbado = (context = CorbadoContext): CorbadoContextInterface => useContext(context);
