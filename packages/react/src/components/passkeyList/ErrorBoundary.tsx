import type { NonRecoverableError } from '@corbado/web-core';
import React from 'react';

export type PasskeyListErrorBoundaryProps = React.PropsWithChildren<{
  globalError: NonRecoverableError | undefined;
}>;

export class PasskeyListErrorBoundary extends React.Component<PasskeyListErrorBoundaryProps> {
  constructor(props: PasskeyListErrorBoundaryProps) {
    super(props);
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    return !this.props.globalError ? (
      this.props.children
    ) : (
      <div className='error-page'>
        <div>Something went wrong. Please try again in a few moments.</div>
      </div>
    );
  }
}
