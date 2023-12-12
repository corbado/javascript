import './App.css';
import { CorbadoProvider } from '@corbado/react';
import RouteProvider from './routes';

function App() {
  return (
    <div
      className='App'
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}
    >
      <CorbadoProvider projectId={process.env.REACT_APP_CORBADO_PROJECT_ID!}>
        <RouteProvider />
      </CorbadoProvider>
    </div>
  );
}

export default App;
