import React, { ComponentType, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CorbadoProvider } from '@corbado/react';
import frenchTranslations from '../translations/fr';
import englishTranslations from '../translations/en';
import ThemeContext from '../contexts/ThemeContext';

function withCorbadoProvider<T extends JSX.IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  const WithCorbado: React.FC<T> = props => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = useContext(ThemeContext);

    if (!projectId && !process.env.REACT_APP_CORBADO_PROJECT_ID_EmailOtp) {
      throw new Error(
        'You must provide a projectId in the url or a REACT_APP_CORBADO_PROJECT_ID_EmailOtp env variable',
      );
    }

    useEffect(() => {
      if (!projectId || !/pro-*/.test(projectId)) {
        navigate(`/${process.env.REACT_APP_CORBADO_PROJECT_ID_EmailOtp}${location.pathname}`);
      }
    });

    return (
      <div key={projectId}>
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
