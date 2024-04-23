import React, { ComponentType, useContext } from 'react';
import { CorbadoProvider } from '@corbado/react';
import frenchTranslations from '../translations/fr';
import englishTranslations from '../translations/en';
import SettingsContext from '../contexts/SettingsContext';

function withCorbadoProvider<T extends JSX.IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  const WithCorbado: React.FC<T> = props => {
    const { darkMode, projectId } = useContext(SettingsContext);

    return (
      <div key={`${projectId}-${darkMode}`}>
        <CorbadoProvider
          projectId={projectId ?? process.env.REACT_APP_CORBADO_PROJECT_ID_EmailOtp ?? ''}
          customTranslations={{
            fr: frenchTranslations,
            en: englishTranslations,
          }}
          darkMode={darkMode ? 'on' : 'off'}
          isDevMode={true}
          frontendApiUrlSuffix={process.env.REACT_APP_CORBADO_FRONTEND_API_URL_SUFFIX}
          setShortSessionCookie={true}
        >
          <WrappedComponent {...(props as T)} />
        </CorbadoProvider>
      </div>
    );
  };

  WithCorbado.displayName = `WithCorbado(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithCorbado;
}

export default withCorbadoProvider;
