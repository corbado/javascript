import { CorbadoProvider } from '@corbado/react';
import RouteProvider from './routes';
import englishTranslations from './translations/en';

function App() {
  return (
    <CorbadoProvider
      projectId={import.meta.env.VITE_CORBADO_PROJECT_ID}
      customTranslations={{
        en: englishTranslations,
      }}
      darkMode='off'
      theme='eloquent-corbado-test'
    >
      <RouteProvider />
    </CorbadoProvider>
  );
}

export default App;
