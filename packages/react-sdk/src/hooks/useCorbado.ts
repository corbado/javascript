import { useContext } from 'react';

import type { CorbadoContextInterface } from '../contexts/CorbadoContext';
import CorbadoContext from '../contexts/CorbadoContext';

const useCorbado = (context = CorbadoContext): CorbadoContextInterface =>
  useContext(context) ;

export default useCorbado;
