import './App.css';
import { CorbadoProvider } from '@corbado/react';
import RouteProvider from './routes';
import frenchTranslations from './translations/fr';
import englishTranslations from './translations/en';
import { useContext } from 'react';
import { ProjectIdContext } from './contexts/ProjectIdContext';

function App() {
  const { projectId } = useContext(ProjectIdContext);

  return (
    <div key={projectId}>
      <CorbadoProvider
        projectId={projectId}
        customTranslations={{
          fr: frenchTranslations,
          en: englishTranslations,
        }}
        darkMode={'off'}
        isDevMode={true}
      >
        <RouteProvider />
      </CorbadoProvider>
    </div>
  );
}

export default App;
