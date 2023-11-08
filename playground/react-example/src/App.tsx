import { CorbadoAuth } from '@corbado/react';
import './App.css';

function App() {
  return (
    <div className="App" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh'}}>
      <CorbadoAuth page='register' projectId='pro-503401103218055321' />
    </div>
  );
}

export default App;
