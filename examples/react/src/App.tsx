import { CorbadoProvider } from '@corbado/react';
import { sendEvent, TelemetryEventType } from '@corbado/shared-util';
import RouteProvider from './routes';
import { useContext, useEffect } from 'react';
import { CustomizationsContext } from './contexts/CustomizationsContext';

function App() {
  const { customTheme, darkMode, customTranslation } = useContext(CustomizationsContext);

  useEffect(() => {
    void sendEvent({
      type: TelemetryEventType.EXAMPLE_APPLICATION_OPENED,
      payload: {
        exampleName: 'corbado/javascript/examples/react',
      },
      sdkVersion: '3.1.0',
      sdkName: 'React SDK',
      identifier: import.meta.env.VITE_CORBADO_PROJECT_ID,
    });
  }, []);

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
