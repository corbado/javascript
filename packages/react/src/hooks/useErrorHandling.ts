import { useContext } from 'react';

import type { ErrorHandlingContextProps } from '../contexts/ErrorHandlingContext';
import ErrorHandlingContext from '../contexts/ErrorHandlingContext';

export const useErrorHandling = (context = ErrorHandlingContext): ErrorHandlingContextProps => useContext(context);

export default useErrorHandling;
