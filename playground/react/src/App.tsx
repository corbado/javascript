import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import RouteProvider from './routes';

function App() {
  return (
    <ThemeProvider>
      <RouteProvider />
    </ThemeProvider>
  );
}

export default App;
