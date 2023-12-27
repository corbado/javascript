import { CorbadoProvider } from '@corbado/react';
import RouteProvider from './routes';
import englishTranslations from './translations/en';

function App() {
  return (
    <CorbadoProvider
      projectId='pro-503401103218055321'
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
