import type { NonRecoverableError, RecoverableError } from '@corbado/web-core';
import React from 'react';

import NonRecoverableErrorComponent from './errors/NonRecoverableError';
import RecoverableErrorComponent from './errors/RecoverableError';

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
      return (
        <div className='error-page prod-error-container'>
          <div className='prod-error-title'>Something went wrong</div>
          <div className='prod-error-details'>
            <div className='prod-error-apology'>We’re sorry that our service is currently not available.</div>
            <div>
              Please try again in a few moments and if the issue persists, please contact{' '}
              {this.props.customerSupportEmail}.
            </div>
          </div>
          <button
            className='prod-error-button'
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      );
    }

    if (this.props.globalError) {
      return (
        <div className='error-page'>
          <NonRecoverableErrorComponent error={this.props.globalError} />
        </div>
      );
    }

    if (this.state.error) {
      if (this.props.globalError) {
        return (
          <div className='error-page'>
            <RecoverableErrorComponent error={this.state.error} />
          </div>
        );
      }
    }

    return this.props.children;
  }
}
