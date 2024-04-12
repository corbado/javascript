import './App.css';
import { SettingsProvider } from './contexts/SettingsContext';
import RouteProvider from './routes';

function App() {
  return (
    <SettingsProvider>
      <RouteProvider />
    </SettingsProvider>
  );
}

export default App;
