import {CorbadoProvider} from "@corbado/react-sdk";
import React from "react";
import {CorbadoAppTest} from "./pages/CorbadoApp";

export function App() {
  return (
    <CorbadoProvider
      projectId="pro-503401103218055321"
      passkeyAppend={true}
      retryPasskeyOnError={true}
      signupFlowName="PasskeySignupWithEmailOTPFallback"
      shouldRedirect={false}
    >
      <CorbadoAppTest/>
    </CorbadoProvider>
  );
}
