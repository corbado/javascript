//import { ApiTest } from "./components/ApiTest"
import { SignUpWithEmailOtpTest } from "./pages/SingUpWithEmailOtpTest";
import { CorbadoProvider } from "@corbado/react-sdk";

export function App() {
  return (
    <CorbadoProvider
      projectId="pro-503401103218055321"
      passkeyAppend={true}
      retryPasskeyOnError={true}
    >
      <SignUpWithEmailOtpTest />
    </CorbadoProvider>
  );
}
