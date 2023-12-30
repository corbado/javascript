import RouteProvider from './routes';
import { CorbadoProvider } from '@corbado/react-sdk';

const App = () => {
  return (
    <CorbadoProvider projectId={import.meta.env.VITE_CORBADO_PROJECT_ID}>
      <RouteProvider />
    </CorbadoProvider>
  );
};

export default App;
