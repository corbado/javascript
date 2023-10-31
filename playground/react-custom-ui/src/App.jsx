import { ApiTest } from "./components/apiTest";
import { CorbadoProvider } from "@corbado/react-sdk";

export function App() {
  return <CorbadoProvider projectId="pro-503401103218055321"><ApiTest /></CorbadoProvider>
}
