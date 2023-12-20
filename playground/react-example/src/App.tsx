import './App.css';
import { CorbadoProvider } from '@corbado/react';
import RouteProvider from './routes';
import frenchTranslations from './translations/fr';
import englishTranslations from './translations/en';

function App() {
  return (
    <div
      className='App'
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}
    >
      <CorbadoProvider
        projectId={process.env.REACT_APP_CORBADO_PROJECT_ID!}
        customTranslations={{
          fr: frenchTranslations,
          en: englishTranslations,
        }}
      >
        <RouteProvider />
      </CorbadoProvider>
    </div>
  );
}

export default App;
