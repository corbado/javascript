import { useContext } from "react";

import { AppContext } from "../contexts/CorbadoAppContext";

export const useCorbadoAuth = () => {
  const authService = useContext(AppContext)?.authService;

  function checkAuthServiceHealth() {
    if (!authService) {
      throw new Error("useCorbadoAuth must be used within an CorbadoProvider");
    }
  }

  function sendEmailWithOTP(email: string, username = "") {
    checkAuthServiceHealth();

    return authService?.sendEmailWithOTP(email, username);
  }

  function verifyOTP(otp: string) {
    checkAuthServiceHealth();

    return authService?.verifyOTP(otp);
  }

  checkAuthServiceHealth();
  return {
    sendEmailWithOTP,
    verifyOTP,
  };
};
