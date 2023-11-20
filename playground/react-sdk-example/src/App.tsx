import RouteProvider from './routes';
import { CorbadoProvider } from '@corbado/react-sdk';

const App = () => {
  return (
    <CorbadoProvider projectId='pro-1743528526530787479'>
      <RouteProvider />
    </CorbadoProvider>
  );
};

export default App;
