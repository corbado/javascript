import { useAppContext } from "@corbado/react-sdk";
import React from "react";
import { Auth } from "@corbado/react";

export function ApiTest() {
  const { projectConfig } = useAppContext();
  return <div>{JSON.stringify(projectConfig)}</div>;
}
