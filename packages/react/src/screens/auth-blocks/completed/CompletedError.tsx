import type { FC } from 'react';
import React from 'react';

import ErrorPopup from '../../../components/ui/errors/ErrorPopup';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import useErrorHandling from '../../../hooks/useErrorHandling';
import type { CompletedBlock } from '../../../shared-ui';

export interface CompletedErrorProps {
  block: CompletedBlock;
}

export const CompletedError: FC<CompletedErrorProps> = ({ block }) => {
  const { isDevMode, customerSupportEmail } = useErrorHandling();

  return (
    <div className='cb-completed-error'>
      <LoadingSpinner />
      {block.error && (
        <ErrorPopup
          isDevMode={isDevMode}
          error={block.error}
          customerSupportEmail={customerSupportEmail}
        />
      )}
    </div>
  );
};
