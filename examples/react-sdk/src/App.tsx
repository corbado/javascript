import RouteProvider from './routes';
import { CorbadoProvider } from '@corbado/react-sdk';

const App = () => {
  return (
    <CorbadoProvider projectId="pro-503401103218055321">
      <RouteProvider />
    </CorbadoProvider>
  );
};

export default App;
