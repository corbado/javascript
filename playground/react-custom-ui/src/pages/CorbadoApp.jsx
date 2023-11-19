import {useCorbadoSession} from "@corbado/react-sdk";
import {AuthenticationFlows} from "./AuthenticationFlows";
import {UserDetails} from "./UserDetails";
import React from "react";

export function CorbadoAppTest() {
  const {signedIn} = useCorbadoSession();

  return signedIn ? <UserDetails/> : <AuthenticationFlows/>;
}
