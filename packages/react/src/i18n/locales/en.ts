const en = {
  common: {
    passkeyPrompt: {
      header: 'Log in even faster with',
      button_showPasskeyBenefits: 'Passkeys',
      button_start: 'Activate',
      button_skip: 'Maybe later',
    },
  },
  signup: {
    start: {
      header: 'Create your account',
      subheader: 'You already have an account?',
      button_login: 'Log in',
      button_submit: 'Continue with email',
      textField_name: 'Name',
      textField_email: 'Email address',
      validationError_name: 'Please enter a name',
      validationError_email: 'Please enter a valid email',
    },
    passkey: {
      header: "Let's get you set up with",
      body: "We'll create an account for",
      button_showPasskeyBenefits: 'Passkeys',
      button_start: 'Create your account',
      button_emailOtp: 'Send email one time code',
      button_back: 'Back',
    },
    passkeyBenefits: {
      header: 'Passkeys',
      body_introduction:
        "With passkeys, you don't need to remember complex passwords anymore. Log in securely by using",
      body_loginMethods: 'Face ID, Touch ID or screen lock code',
      button_start: 'Create passkey',
      button_skip: 'Maybe later',
    },
    passkeySuccess: {
      header: 'Welcome!',
      subheader: 'Passkey created',
      body_text1: 'You can now confirm your identity using your',
      body_text2: 'passkey or via email one time code',
      body_text3: 'when you log in',
      button: 'Continue',
    },
    passkeyError: {
      header: "Let's get you set up",
      body_errorMessage1: 'Creating your account was not possible with',
      body_errorMessage2: 'Try again or sign up with email one time code',
      button_showPasskeyBenefits: 'passkeys',
      button_retry: 'Try again',
      button_emailOtp: 'Send email one time code',
      button_back: 'Back',
      button_cancel: 'Cancel',
    },
    emailOtp: {
      header: 'Enter code to create account',
      body_text1: 'We just sent a one time code to ',
      body_text2: 'The code expires shortly, so please enter it soon.',
      validationError_otp: 'OTP is incorrect',
      button_verify: 'Continue',
      button_sendOtpAgain: 'Send one time code again',
      button_back: 'Cancel',
    },
  },
  login: {
    start: {
      header: 'Welcome back!',
      subheader: "Don't have and account yet?",
      button_signup: 'Create account',
      button_submit: 'Continue with email',
      textField_email: 'Email address',
      validationError_email: 'Please enter a valid email',
    },
    passkeyError: {
      header: 'Log in with Passkeys',
      body: 'Login with passkeys not possible. Try again or log in with email one time code.',
      button_retry: 'Try again',
      button_emailOtp: 'Send email one time code',
      button_back: 'Back',
      button_cancel: 'Cancel',
    },
    emailOtp: {
      header: 'Enter code to log in',
      body_text1: 'We just sent a one time code to ',
      body_text2: 'The code expires shortly, so please enter it soon.',
      validationError_otp: 'OTP is incorrect',
      button_verify: 'Continue',
      button_sendOtpAgain: 'Send one time code again',
      button_back: 'Cancel',
    },
  },
};

export default en;
