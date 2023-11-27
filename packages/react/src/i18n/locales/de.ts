const de = {
  common: {
    passkeyPrompt: {
      header: 'Schneller anmelden mit',
      button_showPasskeyBenefits: 'Passkeys',
      button_start: 'Aktivieren',
      button_skip: 'Vielleicht später',
    },
  },
  signup: {
    start: {
      header: 'Erstellen Sie Ihr Konto',
      subheader: 'Sie haben bereits ein Konto?',
      button_login: 'Anmelden',
      button_submit: 'Mit E-Mail fortfahren',
      textField_name: 'Name',
      textField_email: 'E-Mail-Adresse',
      validationError_name: 'Bitte geben Sie einen Namen ein',
      validationError_email: 'Bitte geben Sie eine gültige E-Mail ein',
    },
    passkey: {
      header: 'Lassen Sie uns einrichten mit',
      body: 'Wir werden ein Konto für',
      button_showPasskeyBenefits: 'Passkeys',
      button_start: 'Konto erstellen',
      button_emailOtp: 'Einmalcode per E-Mail senden',
      button_back: 'Zurück',
    },
    passkeyBenefits: {
      header: 'Passkeys',
      body_introduction:
        'Mit Passkeys müssen Sie sich keine komplexen Passwörter mehr merken. Melden Sie sich sicher an, indem Sie',
      body_loginMethods: 'Face ID, Touch ID oder Sperrcode verwenden.',
      button_start: 'Passkey erstellen',
      button_skip: 'Vielleicht später',
    },
    passkeySuccess: {
      header: 'Willkommen!',
      subheader: 'Passkey erstellt',
      body_text1: 'Sie können Ihre Identität nun mit Ihrem',
      body_text2: 'Passkey oder per E-Mail Einmalcode',
      body_text3: 'bei der Anmeldung bestätigen.',
      button: 'Fortsetzen',
    },
    passkeyError: {
      header: 'Lassen Sie uns einrichten',
      body_errorMessage1: 'Das Erstellen Ihres Kontos war nicht möglich mit',
      body_errorMessage2: 'Versuchen Sie es erneut oder melden Sie sich mit E-Mail Einmalcode an.',
      button_showPasskeyBenefits: 'Passkeys',
      button_retry: 'Erneut versuchen',
      button_emailOtp: 'Einmalcode per E-Mail senden',
      button_back: 'Zurück',
      button_cancel: 'Abbrechen',
    },
    emailOtp: {
      header: 'Geben Sie den Code ein, um das Konto zu erstellen',
      body_text1: 'Wir haben gerade einen Einmalcode gesendet an ',
      body_text2: 'Der Code läuft in Kürze ab, bitte geben Sie ihn bald ein.',
      validationError_otp: 'Der OTP ist falsch',
      button_verify: 'Fortsetzen',
      button_sendOtpAgain: 'Einmalcode erneut senden',
      button_back: 'Abbrechen',
    },
  },
  login: {
    start: {
      header: 'Willkommen zurück!',
      subheader: 'Sie haben noch kein Konto?',
      button_signup: 'Konto erstellen',
      button_submit: 'Mit E-Mail fortfahren',
      textField_email: 'E-Mail-Adresse',
      validationError_email: 'Bitte geben Sie eine gültige E-Mail ein',
    },
    passkeyError: {
      header: 'Anmeldung mit Passkeys',
      body: 'Anmeldung mit Passkeys nicht möglich. Versuchen Sie es erneut oder melden Sie sich mit E-Mail Einmalcode an.',
      button_retry: 'Erneut versuchen',
      button_emailOtp: 'Einmalcode per E-Mail senden',
      button_back: 'Zurück',
      button_cancel: 'Abbrechen',
    },
    emailOtp: {
      header: 'Geben Sie den Code ein, um sich anzumelden',
      body_text1: 'Wir haben gerade einen Einmalcode gesendet an ',
      body_text2: 'Der Code läuft in Kürze ab, bitte geben Sie ihn bald ein.',
      validationError_otp: 'Der OTP ist falsch',
      button_verify: 'Fortsetzen',
      button_sendOtpAgain: 'Einmalcode erneut senden',
      button_back: 'Abbrechen',
    },
  },
};

export default de;
