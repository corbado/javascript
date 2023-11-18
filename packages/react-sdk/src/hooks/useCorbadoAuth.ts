import { useContext } from "react";

import { AppContext } from "../contexts/CorbadoAppContext";

export const useCorbadoAuth = () => {
  const authService = useContext(AppContext)?.authService;

  if (!authService) {
    throw new Error("useCorbadoAuth must be used within an CorbadoProvider");
  }

  function isAuthenticated() {
    return authService?.isAuthenticated;
  }

  function isEmailVerified() {
    return authService?.isEmailVerified;
  }

  function isPasskeySet() {
    return authService?.isPasskeySet;
  }

  function getUsername() {
    return authService?.username;
  }

  function getEmail() {
    return authService?.email;
  }

  function getPossibleAuthMethods() {
    return authService?.possibleAuthMethods;
  }

  function getAuthMethod() {
    return authService?.authMethod;
  }

  function initiateSignup(email: string, username = "") {
    return authService?.initiateSignup(email, username);
  }

  function initiateLogin(email: string) {
    return authService?.initiateLogin(email);
  }

  function sendEmailWithOTP() {
    return authService?.sendEmailWithOTP();
  }

  function verifyOTP(otp: string) {
    return authService?.verifyOTP(otp);
  }

  function emailOtpLogin() {
    return authService?.emailOtpLogin();
  }

  function passkeyRegister() {
    return authService?.passkeyRegister();
  }

  function passkeyAppend() {
    return authService?.passkeyAppend();
  }

  function passkeyLogin() {
    return authService?.passkeyLogin();
  }

  function passkeyMediation() {
    return authService?.passkeyMediation();
  }

  return {
    initiateSignup,
    initiateLogin,
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
    getPossibleAuthMethods,
    getAuthMethod,
  };
};
