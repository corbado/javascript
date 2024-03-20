import type { NonRecoverableError, RecoverableError } from '@corbado/web-core';
import React from 'react';

export type PasskeyListErrorBoundaryProps = React.PropsWithChildren<{
  globalError: NonRecoverableError | undefined;
}>;
export type PasskeyListErrorBoundaryState = {
  error: RecoverableError | undefined;
};

export class PasskeyListErrorBoundary extends React.Component<
  PasskeyListErrorBoundaryProps,
  PasskeyListErrorBoundaryState
> {
  constructor(props: PasskeyListErrorBoundaryProps) {
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
    if (this.props.globalError) {
      return (
        <div className='cb-error-page'>
          <div>Something went wrong. Please try again in a few moments.</div>
        </div>
      );
    }
    return this.props.children;
  }
}
