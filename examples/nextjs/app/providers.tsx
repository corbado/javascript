'use client';

import { CorbadoProvider } from '@corbado/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CorbadoProvider
      projectId={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!}
      darkMode='off'
      //it's important to set this since Corbado uses refresh tokens to keep the user logged in
      //by storing short session cookies, the user will be able to stay logged in even if the token is refreshed
      setShortSessionCookie={true}
    >
      {children}
    </CorbadoProvider>
  );
}
