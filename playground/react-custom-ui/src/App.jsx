//import { ApiTest } from "./components/ApiTest"
//import { SignUpWithEmailOtpTest } from "./pages/SingUpWithEmailOtpTest";
import { PasskeySignupTest } from "./pages/PasskeySignupTest";
import { CorbadoProvider } from "@corbado/react-sdk";

export function App() {
  return (
    <CorbadoProvider
      projectId="pro-503401103218055321"
      passkeyAppend={true}
      retryPasskeyOnError={true}
      signupFlowName="PasskeySignupWithEmailOTPFallback"
    >
      {/* <SignUpWithEmailOtpTest /> */}
      <PasskeySignupTest />
    </CorbadoProvider>
  );
}
