import { CorbadoProvider } from '@corbado/react';
import { sendEvent, TelemetryEventType } from '@corbado/shared-util';
import RouteProvider from './routes';
import { useContext, useEffect, useRef } from 'react';
import { CustomizationsContext } from './contexts/CustomizationsContext';

function App() {
  const { customTheme, darkMode, customTranslation } = useContext(CustomizationsContext);

  const hasSentTelemetry = useRef(false);

  useEffect(() => {
    if (hasSentTelemetry.current) return;

    void sendEvent({
      type: TelemetryEventType.EXAMPLE_APPLICATION_OPENED,
      payload: {
        exampleName: 'corbado/javascript/examples/react',
      },
      sdkVersion: '3.1.0',
      sdkName: 'React SDK',
      identifier: import.meta.env.VITE_CORBADO_PROJECT_ID,
    });

    hasSentTelemetry.current = true;
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
