const en = {
  common: {
    passkeyPrompt: {
      header: 'Log in even faster with <1>Passkeys</1>',
      button_start: 'Activate',
      button_skip: 'Maybe later',
    },
  },
  signup: {
    start: {
      header: 'Create your account',
      subheader: 'You already have an account? <1>Log in</1>',
      button: 'Continue with email',
      textField_name: 'Name',
      textField_email: 'Email address',
      validationError_name: 'Please enter a name',
      validationError_email: 'Please enter a valid email',
    },
    passkeyStart: {
      header: "Let's get you set up with <1>Passkeys</1>",
      body: "We'll create an account for <1>{{email_address}}</1>.",
      button_start: 'Create your account',
      button_emailOtp: 'Send email one time code',
      button_back: 'Back',
    },
    passkeyBenefits: {
      header: 'Passkeys',
      body: "With passkeys, you don't need to remember complex passwords anymore. Log in securely to using <1>Face ID, Touch ID or screen lock code</1>.",
      button_start: 'Create passkey',
      button_skip: 'Maybe later',
    },
    passkeySuccess: {
      header: 'Welcome!',
      subheader: 'Passkey created',
      body: 'You can now confirm your identity using your <1>passkey or via email one time code</1> when you log in.',
      button: 'Continue',
    },
    passkeyError: {
      header: "Let's get you set up",
      body: 'Creating your account with <1>passkeys</1> not possible. Try again or sign up with email one time code.',
      button_retry: 'Try again',
      button_emailOtp: 'Send email one time code',
      button_back: 'Back',
    },
    emailOtp: {
      header: 'Enter code to create account',
      body: 'We just sent a one time code to <1>email address</1>. The code expires shortly, so please enter it soon.',
      validationError_otp: 'OTP is incorrect',
      button_verify: 'Continue',
      button_sendOtpAgain: 'Send one time code again',
      button_back: 'Cancel',
    },
  },
  login: {
    start: {
      header: 'Welcome back!',
      subheader: "Don't have and account yet? <1>Create account</1>",
      button: 'Continue with email',
      textField_email: 'Email address',
      validationError_email: 'Please enter a valid email',
    },
    passkeyError: {
      header: 'Log in with Passkeys',
      body: 'Login with passkeys not possible. Try again or log in with email one time code.',
      button_retry: 'Try again',
      button_emailOtp: 'Send email one time code',
      button_back: 'Back',
    },
    emailOtp: {
      header: 'Enter code to log in',
      body: 'We just sent a one time code to <1>email address</1>. The code expires shortly, so please enter it soon.',
      validationError_otp: 'OTP is incorrect',
      button_verify: 'Continue',
      button_sendOtpAgain: 'Send one time code again',
      button_back: 'Cancel',
    },
  },
};

export default en;
