import { expect } from '@playwright/test';

export enum SignupFlowConfig {
  PasskeyWithEmailOTPFallback = 'PasskeyWithEmailOTPFallback',
  EmailOTPSignup = 'EmailOTPSignup',
}

interface BackendConfigs {
  doubleOptIn?: boolean;
  signupFlow?: SignupFlowConfig;
  allowUserRegistration?: boolean;
  userFullNameRequired?: boolean;
}

export async function setBackendConfigs(customConfigs?: BackendConfigs) {
  const defaultConfigs = {
    doubleOptIn: true,
    signupFlow: SignupFlowConfig.PasskeyWithEmailOTPFallback,
    allowUserRegistration: true,
    userFullNameRequired: true,
  };
  const configs = customConfigs ? Object.assign({}, defaultConfigs, customConfigs) : defaultConfigs;

  const response = await fetch('https://backendapi.corbado.io/v1/projectConfig', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${process.env.PROJECT_ID}:${process.env.API_SECRET}`),
    },
    body: JSON.stringify(configs),
  });

  expect(response.ok).toBeTruthy();
}
