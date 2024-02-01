import React, { ComponentType, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CorbadoProvider } from '@corbado/react';
import frenchTranslations from '../translations/fr';
import englishTranslations from '../translations/en';

function withCorbadoProvider<T extends JSX.IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  const WithCorbado: React.FC<T> = props => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    if (!projectId && !process.env.REACT_APP_CORBADO_PROJECT_ID_EmailOtp) {
      throw new Error(
        'You must provide a projectId in the url or a REACT_APP_CORBADO_PROJECT_ID_EmailOtp env variable',
      );
    }

    useEffect(() => {
      if (!projectId || !/pro-*/.test(projectId)) {
        navigate(
          `${location.pathname === '/' ? '' : location.pathname}/${process.env.REACT_APP_CORBADO_PROJECT_ID_EmailOtp}`,
        );
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
          darkMode={'off'}
          isDevMode={true}
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
