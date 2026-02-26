'use client';

import { CorbadoProvider } from '@corbado/react';
import type { PropsWithChildren } from 'react';
import { useContext, useEffect } from 'react';
import SettingsContext, { SettingsProvider } from '../contexts/SettingsContext';
import englishTranslations from '../translations/en';
import frenchTranslations from '../translations/fr';

function CorbadoProviderWrapper({ children }: PropsWithChildren) {
  const { darkMode, projectId } = useContext(SettingsContext);

  useEffect(() => {
    const key = 'cbo_dev_session_id';
    let sid = localStorage.getItem(key);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(key, sid);
    }
    // Keep this cookie in sync so mock OIDC authorize can resolve session state.
    document.cookie = `mock_oidc_dev_session=${sid}; path=/; max-age=300`;
  }, []);

  return (
    <div key={`${projectId}-${darkMode}`}>
      <CorbadoProvider
        projectId={
          projectId ||
          process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID_ManualTesting ||
          process.env.VITE_CORBADO_PROJECT_ID_ManualTesting ||
          'pro-1'
        }
        // customTranslations={{
        //   fr: frenchTranslations,
        //   en: englishTranslations,
        // }}
        darkMode={darkMode ? 'on' : 'off'}
        isDevMode={true}
        frontendApiUrlSuffix={
          process.env.NEXT_PUBLIC_CORBADO_FRONTEND_API_URL_SUFFIX || process.env.VITE_CORBADO_FRONTEND_API_URL_SUFFIX
        }
        telemetry={{ debug: true }}
        observeEnabled={true}
      >
        {children as any}
      </CorbadoProvider>
    </div>
  );
}

export function PlaygroundProviders({ children }: PropsWithChildren) {
  return (
    <SettingsProvider>
      <CorbadoProviderWrapper>{children}</CorbadoProviderWrapper>
    </SettingsProvider>
  );
}
