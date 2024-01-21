import { createContext } from 'react';

export interface ErrorHandlingContextProps {
  customerSupportEmail: string;
  isDevMode: boolean;
}

export const initialContext: ErrorHandlingContextProps = {
  customerSupportEmail: '',
  isDevMode: false,
};

const ErrorHandlingContext = createContext<ErrorHandlingContextProps>(initialContext);

export default ErrorHandlingContext;
