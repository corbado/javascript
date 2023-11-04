import { useContext } from "react";

import { AuthContext } from "../contexts/authContext";

export const useCorbadoAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useCorbadoAuthContext must be used within an AuthProvider"
    );
  }
  return context;
};
