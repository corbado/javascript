import { useContext } from "react";

import { AppContext } from "../contexts/CorbadoAppContext";

export const useCorbadoAuth = () => {
  const authService = useContext(AppContext)?.authService;

  function checkAuthServiceHealth() {
    if (!authService) {
      throw new Error("useCorbadoAuth must be used within an CorbadoProvider");
    }
  }

  function isAuthenticated() {
    checkAuthServiceHealth();

    return authService?.isAuthenticated;
  }

  function isEmailVerified() {
    checkAuthServiceHealth();

    return authService?.isEmailVerified;
  }

  function isPasskeySet() {
    checkAuthServiceHealth();

    return authService?.isPasskeySet;
  }

  function getUsername() {
    checkAuthServiceHealth();

    return authService?.username;
  }

  function getEmail() {
    checkAuthServiceHealth();

    return authService?.email;
  }

  function initiateAuth(email: string, username = "") {
    checkAuthServiceHealth();

    return authService?.initiateAuth(email, username);
  }

  function sendEmailWithOTP(email: string, username = "") {
    checkAuthServiceHealth();

    return authService?.sendEmailWithOTP(email, username);
  }

  function verifyOTP(otp: string) {
    checkAuthServiceHealth();

    return authService?.verifyOTP(otp);
  }

  function emailOtpLogin() {
    checkAuthServiceHealth();

    return authService?.emailOtpLogin();
  }

  function passkeyRegister() {
    checkAuthServiceHealth();

    return authService?.passkeyRegister();
  }

  function passkeyAppend() {
    checkAuthServiceHealth();

    return authService?.passkeyAppend();
  }

  function passkeyLogin() {
    checkAuthServiceHealth();

    return authService?.passkeyLogin();
  }

  function passkeyMediation() {
    checkAuthServiceHealth();

    return authService?.passkeyMediation();
  }

  checkAuthServiceHealth();
  return {
    initiateAuth,
    sendEmailWithOTP,
    verifyOTP,
    emailOtpLogin,
    passkeyRegister,
    passkeyAppend,
    passkeyLogin,
    passkeyMediation,
    isPasskeySet,
    isAuthenticated,
    isEmailVerified,
    getUsername,
    getEmail,
  };
};
