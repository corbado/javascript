import { useCorbadoSession } from "@corbado/react-sdk";
import { AuthenticationFlows } from "./AuthenticationFlows";
import { UserDetails } from "./UserDetails";
import React from "react";

export function CorbadoAppTest() {
  const { signedIn, signOut } = useCorbadoSession();

  return (
    <div>
      <header className="App-header">
        <h1>Header - Corbado React SDK Playground</h1>
      </header>
      <main>
        {signedIn ? (
          <>
            <UserDetails />
            <button style={{ marginTop: "5px" }} onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <AuthenticationFlows />
        )}
      </main>
      <footer style={{ margin: "10px" }}>
        <h3>Footer</h3>
        <em>Notice how header and footer are independent of auth state</em>
      </footer>
    </div>
  );
}
