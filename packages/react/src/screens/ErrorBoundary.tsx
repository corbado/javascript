import type { NonRecoverableError, RecoverableError } from '@corbado/web-core';
import React from 'react';

import NonRecoverableErrorComponent from './errors/NonRecoverableError';
import NonRecoverableErrorForCustomer from './errors/NonRecoverableErrorForCustomer';

export type ErrorBoundaryProps = React.PropsWithChildren<{
  globalError: NonRecoverableError | undefined;
  isDevMode: boolean;
  customerSupportEmail: string;
}>;
export type ErrorBoundaryState = {
  error: RecoverableError | undefined;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if ((this.props.globalError || this.state.error) && !this.props.isDevMode) {
      return <NonRecoverableErrorForCustomer customerSupportEmail={this.props.customerSupportEmail} />;
    }

    if (this.props.globalError) {
      return (
        <div className='error-page'>
          <NonRecoverableErrorComponent error={this.props.globalError} />
        </div>
      );
    }

    return this.props.children;
  }
}
