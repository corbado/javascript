const fr = {
  common: {
    passkeyPrompt: {
      header: 'Connectez-vous encore plus rapidement avec',
      button_showPasskeyBenefits: 'Passkeys',
      button_start: 'Activer',
      button_skip: 'Peut-être plus tard',
    },
  },
  signup: {
    start: {
      header: 'Créez votre compte',
      subheader: 'Vous avez déjà un compte ?',
      button_login: 'Se connecter',
      button_submit: 'Continuer avec l’email',
      textField_name: 'Nom',
      textField_email: 'Adresse e-mail',
    },
    passkey: {
      header: 'Préparons votre compte avec',
      body: 'Nous allons créer un compte pour',
      button_showPasskeyBenefits: 'Passkeys',
      button_start: 'Créer votre compte',
      button_emailOtp: 'Envoyer un code par email',
      button_back: 'Retour',
    },
    passkeyBenefits: {
      header: 'Passkeys',
      body_introduction:
        'Avec les passkeys, plus besoin de se souvenir de mots de passe complexes. Connectez-vous en toute sécurité en utilisant',
      body_loginMethods: 'Face ID, Touch ID ou un code de verrouillage d’écran.',
      button_start: 'Créer un passkey',
      button_skip: 'Peut-être plus tard',
    },
    passkeySuccess: {
      header: 'Bienvenue !',
      subheader: 'Passkey créé',
      body_text1: 'Vous pouvez maintenant confirmer votre identité en utilisant votre',
      body_text2: 'passkey ou par code email à usage unique',
      body_text3: 'lorsque vous vous connectez.',
      button: 'Continuer',
    },
    passkeyError: {
      header: 'Configurons votre compte',
      body_errorMessage1: 'Il n’a pas été possible de créer votre compte avec',
      body_errorMessage2: 'Réessayez ou inscrivez-vous avec un code email à usage unique.',
      button_showPasskeyBenefits: 'passkeys',
      button_retry: 'Réessayer',
      button_emailOtp: 'Envoyer un code par email',
      button_back: 'Retour',
      button_cancel: 'Annuler',
    },
    emailOtp: {
      header: 'Entrez le code pour créer le compte',
      body_text1: 'Nous venons de vous envoyer un code à usage unique à ',
      body_text2: 'Le code expire bientôt, veuillez le saisir rapidement.',
      validationError_otp: 'Le code OTP est incorrect',
      button_verify: 'Continuer',
      button_sendOtpAgain: 'Envoyer le code à nouveau',
      button_back: 'Annuler',
    },
  },
  login: {
    start: {
      header: 'Bon retour !',
      subheader: 'Vous n’avez pas encore de compte ?',
      button_signup: 'Créer un compte',
      button_submit: 'Continuer avec l’email',
      textField_email: 'Adresse e-mail',
      validationError_email: 'Veuillez saisir un email valide',
    },
    passkeyError: {
      header: 'Se connecter avec Passkeys',
      body: 'La connexion avec passkeys n’est pas possible. Réessayez ou connectez-vous avec un code email à usage unique.',
      button_retry: 'Réessayer',
      button_emailOtp: 'Envoyer un code par email',
      button_back: 'Retour',
      button_cancel: 'Annuler',
    },
    emailOtp: {
      header: 'Entrez le code pour vous connecter',
      body_text1: 'Nous venons de vous envoyer un code à usage unique à ',
      body_text2: 'Le code expire bientôt, veuillez le saisir rapidement.',
      validationError_otp: 'Le code OTP est incorrect',
      button_verify: 'Continuer',
      button_sendOtpAgain: 'Envoyer le code à nouveau',
      button_back: 'Annuler',
    },
  },
};

export default fr;
