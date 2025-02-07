'use client';

import { CorbadoProvider } from '@corbado/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CorbadoProvider
      projectId={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!}
      darkMode='off'
    >
      {children}
    </CorbadoProvider>
  );
}
