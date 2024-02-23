import { test as setup } from '@playwright/test';

import { SignupFlowConfig, setBackendConfigs } from '../../utils/helperFunctions/setBackendConfigs';

setup('set default configs', async () => {
  await setBackendConfigs({ signupFlow: SignupFlowConfig.EmailOTPSignup });
});
