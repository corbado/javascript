import './App.css';
import { CorbadoProvider } from '@corbado/react-sdk';
import RouteProvider from './routes';

function App() {
  return (
    <div
      className='App'
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}
    >
      <CorbadoProvider projectId='pro-1743528526530787479'>
        <RouteProvider />
      </CorbadoProvider>
    </div>
  );
}

export default App;
