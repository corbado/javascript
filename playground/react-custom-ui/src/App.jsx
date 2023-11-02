import { ApiTest } from "./components/apiTest";
import { CorbadoProvider } from "@corbado/react-sdk";

export function App() {
  return <CorbadoProvider projectId="pro-503401103218055321">
    <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 100 }}>
      <ApiTest />
    </div>
  </CorbadoProvider>
}
