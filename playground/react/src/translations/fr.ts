const fr = {
  authenticationFlows: {
    signup: {
      start: {
        header: 'Créez votre compte',
        subheader: 'Vous avez déjà un compte? ',
        button_login: 'Se connecter',
        button_submit: "Continuer avec l'email",
        textField_name: 'Nom',
        textField_email: 'Adresse e-mail',
        validationError_name: 'Veuillez entrer un nom',
        validationError_email: 'Veuillez entrer un e-mail valide',
        validationError_emailExists: "L'adresse e-mail est déjà utilisée.",
      },
      passkey: {
        header: 'Configurons-vous avec ',
        body: 'Nous allons créer un compte pour ',
        button_showPasskeyBenefits: "Clés d'accès",
        button_start: 'Créer votre compte',
        button_emailOtp: 'Envoyer un code à usage unique par e-mail',
        button_back: 'Retour',
      },
      passkeyBenefits: {
        header: "Clés d'accès",
        body_introduction:
          "Avec les clés d'accès, vous n'avez plus besoin de vous souvenir de mots de passe complexes. Connectez-vous en toute sécurité en utilisant ",
        body_loginMethods: "Face ID, Touch ID ou un code de verrouillage d'écran.",
        button_start: "Créer une clé d'accès",
        button_skip: 'Peut-être plus tard',
      },
      passkeySuccess: {
        header: 'Bienvenue!',
        subheader: "Clé d'accès créée",
        body_text1: 'Vous pouvez maintenant confirmer votre identité en utilisant votre ',
        body_text2: "clé d'accès ou via un code à usage unique par e-mail",
        body_text3: ' lors de la connexion.',
        button: 'Continuer',
      },
      passkeyError: {
        header: 'Configurons-vous',
        body_errorMessage1: "La création de votre compte n'a pas été possible avec ",
        body_errorMessage2: '. Réessayez ou inscrivez-vous avec un code à usage unique par e-mail.',
        button_showPasskeyBenefits: "clés d'accès",
        button_retry: 'Réessayer',
        button_emailOtp: 'Envoyer un code à usage unique par e-mail',
        button_back: 'Retour',
        button_cancel: 'Annuler',
      },
      passkeyPrompt: {
        header: 'Connectez-vous encore plus rapidement avec ',
        button_showPasskeyBenefits: "Clés d'accès",
        button_start: 'Activer',
        button_skip: 'Peut-être plus tard',
      },
      emailOtp: {
        header: 'Entrez le code pour créer le compte',
        body_text1: "Nous venons d'envoyer un code à usage unique à ",
        body_text2: '. Le code expire bientôt, veuillez le saisir rapidement.',
        validationError_otp: 'Le OTP est incorrect',
        button_verify: 'Continuer',
        button_sendOtpAgain: 'Envoyer de nouveau un code à usage unique',
        button_back: 'Annuler',
      },
    },
    login: {
      start: {
        header: 'Bon retour!',
        subheader: "Vous n'avez pas encore de compte? ",
        button_signup: 'Créer un compte',
        button_submit: "Continuer avec l'email",
        textField_email: 'Adresse e-mail',
        validationError_email: 'Veuillez entrer un e-mail valide',
      },
      passkeyError: {
        header: "Se connecter avec les clés d'accès",
        body: "La connexion avec les clés d'accès n'est pas possible. Réessayez ou connectez-vous avec un code à usage unique par e-mail.",
        button_retry: 'Réessayer',
        button_emailOtp: 'Envoyer un code à usage unique par e-mail',
        button_back: 'Retour',
        button_cancel: 'Annuler',
      },
      emailOtp: {
        header: 'Entrez le code pour vous connecter',
        body_text1: "Nous venons d'envoyer un code à usage unique à ",
        body_text2: '. Le code expire bientôt, veuillez le saisir rapidement.',
        validationError_otp: 'Le OTP est incorrect',
        button_verify: 'Continuer',
        button_sendOtpAgain: 'Envoyer de nouveau un code à usage unique',
        button_back: 'Annuler',
      },
      passkeyPrompt: {
        header: 'Connectez-vous encore plus rapidement avec ',
        button_showPasskeyBenefits: "Clés d'accès",
        button_start: 'Activer',
        button_skip: 'Peut-être plus tard',
      },
      passkeyBenefits: {
        header: "Clés d'accès",
        body_introduction:
          "Avec les clés d'accès, vous n'avez plus besoin de vous souvenir de mots de passe complexes. Connectez-vous en toute sécurité en utilisant ",
        body_loginMethods: "Face ID, Touch ID ou un code de verrouillage d'écran.",
        button_start: "Créer une clé d'accès",
        button_skip: 'Peut-être plus tard',
      },
    },
  },
  errors: {
    validationError_invalidEmail: 'Veuillez entrer un e-mail valide',
    validationError_invalidName: 'Veuillez entrer un nom',
    validationError_passkeyChallengeCancelled: "Défi de clé d'accès annulé",
    serverError_userAlreadyExists: "L'adresse e-mail est déjà utilisée",
    serverError_unknownUser: "L'utilisateur n'existe pas",
    serverError_noPasskeyAvailable: "Aucune clé d'accès disponible",
    serverError_invalidPasskey: "La clé d'accès fournie n'est plus valide",
    serverError_invalidOtp: "Le OTP fourni n'est pas valide",
    serverError_timeoutOtp: "Le OTP fourni n'est plus valide",
    serverError_unreachableEmail: 'Adresse e-mail invalide / injoignable',
    unknownError: 'Un problème est survenu. Veuillez réessayer plus tard',
  },
  passkeysList: {
    warning_notLoggedIn: 'Veuillez vous connecter pour voir vos clés de passe.',
    message_noPasskeys: "Vous n'avez pas encore de clés de passe.",
    button_createPasskey: 'Créer une clé de passe',
    badge_synced: 'Synchronisé',
    field_credentialId: "ID d'identification : ",
    field_created: 'Créé : {{date}} avec {{browser}} sur {{os}}',
    field_lastUsed: 'Dernière utilisation : ',
    field_status: 'Statut : ',
    deleteDialog_header: 'Supprimer la clé de passe',
    deleteDialog_body: 'Êtes-vous sûr de vouloir supprimer cette clé de passe ?',
    deleteDialog_cancelButton: 'Annuler',
    deleteDialog_deleteButton: 'Oui, supprimer',
  },
};
export default fr;