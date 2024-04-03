const en = {
  signup: {
    'signup-init': {
      'signup-init': {
        header: 'Create your account',
        subheader: 'to access ',
        text_login: 'You already have an account? ',
        button_login: 'Log in',
        button_submit: 'Continue',
        textField_fullName: 'Name',
        textField_username: 'Username',
        textField_email: 'Email address',
        textField_phone: 'Phone number',
        text_divider: 'or',
        social_signup: {
          google: 'Continue with Google',
          microsoft: 'Continue with Microsoft',
          github: 'Continue with GitHub',
        },
      },
    },
  },
  login: {
    'login-init': {
      'login-init': {
        header: 'Log in',
        subheader: 'to access ',
        text_signup: 'No account? ',
        button_signup: 'Sign up',
        button_submit: 'Continue',
        textField: {
          email: 'Email address',
          username: 'Username',
          emailOrUsername: 'Email address or username',
          phone: 'Phone number',
        },
        button_switchToAlternate: {
          email: 'Use email',
          username: 'Use username',
          emailOrUsername: 'Use email or username',
          phone: 'Use phone',
        },
        text_divider: 'or',
        social_signup: {
          google: 'Continue with Google',
          microsoft: 'Continue with Microsoft',
          github: 'Continue with GitHub',
        },
      },
    },
  },
  passkeysList: {
    warning_notLoggedIn: 'Please log in to see your passkeys.',
    message_noPasskeys: "You don't have any passkeys yet.",
    button_createPasskey: 'Create a Passkey',
    badge_synced: 'Synced',
    field_credentialId: 'Credential ID: ',
    field_created: 'Created: {{date}} with {{browser}} on {{os}}',
    field_lastUsed: 'Last used: ',
    field_status: 'Status: ',
    dialog_delete: {
      header: 'Delete Passkey',
      body: 'Are you sure you want to delete this passkey?',
      button_cancel: 'Cancel',
      button_confirm: 'Yes, delete',
    },
    dialog_passkeyAlreadyExists: {
      header: 'Passkey already exists',
      body: 'A passkey for this device already exists. If you are facing issues with your passkey, please delete it and create a new one.',
      button_confirm: 'Ok',
    },
    dialog_passkeysNotSupported: {
      header: 'Passkeys are not supported',
      body: 'Unfortunately, passkeys are not supported on your device.',
      button_confirm: 'Ok',
    },
  },
};

export default en;
