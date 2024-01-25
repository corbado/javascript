import { CorbadoProvider } from '@corbado/react';
import RouteProvider from './routes';
import { useContext } from 'react';
import { CustomizationsContext } from './contexts/CustomizationsContext';

function App() {
  const { customTheme, darkMode, customTranslation } = useContext(CustomizationsContext);

  return (
    <CorbadoProvider
      projectId={import.meta.env.VITE_CORBADO_PROJECT_ID}
      customTranslations={customTranslation}
      darkMode={darkMode}
      theme={customTheme}
    >
      <RouteProvider />
    </CorbadoProvider>
  );
}

export default App;
