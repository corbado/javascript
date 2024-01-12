import type { FlowStyles, LoginFlowOptions, ProjectConfig, SignupFlowOptions } from '@corbado/types';

import type { ProjectConfigRspAllOfData } from '../../api';

export function isFlowStyle(value: string): value is FlowStyles {
  return value === 'PasskeyWithEmailOTPFallback' || value === 'EmailOtpSignup';
}

export function mapToProjectConfig(apiResponse: ProjectConfigRspAllOfData): ProjectConfig {
  if (!isFlowStyle(apiResponse.loginFlow) || !isFlowStyle(apiResponse.signupFlow)) {
    throw new Error('Invalid FlowStyle received from API');
  }

  return {
    ...apiResponse,
    loginFlow: apiResponse.loginFlow,
    loginFlowOptions: apiResponse.loginFlowOptions as LoginFlowOptions,
    signupFlow: apiResponse.signupFlow,
    signupFlowOptions: apiResponse.signupFlowOptions as SignupFlowOptions,
  };
}
