const fr = {
  signup: {
    header: 'Créez votre compte',
    'sub-header': 'Vous avez déjà un compte ? <1>Connectez-vous</1>',
    continue_email: 'Continuer avec l’e-mail',
  },
  passkey_signup: {
    header: 'Configurons votre compte avec <1>Passkeys</1>',
    'sub-header': 'Nous allons créer un compte pour <1>{{email_address}}</1>.',
    primary_btn: 'Créer votre compte',
    secondary_btn: 'Envoyer le code à usage unique par e-mail',
    tertiary_btn: 'Retour',
  },
  create_passkey: {
    header: 'Passkeys',
    body: 'Avec les passkeys, vous n’avez plus besoin de retenir des mots de passe complexes. Connectez-vous de manière sécurisée en utilisant <1>Face ID, Touch ID ou un code de verrouillage d’écran</1>.',
    primary_btn: 'Créer une passkey',
    secondary_btn: 'Peut-être plus tard',
  },
  create_passkey_error: {
    header: 'Configurons votre compte',
    body: 'Il n’est pas possible de créer votre compte avec <1>passkeys</1>. Réessayez ou connectez-vous avec le code à usage unique par e-mail.',
    primary_btn: 'Réessayer',
    secondary_btn: 'Envoyer le code à usage unique par e-mail',
    tertiary_btn: 'Retour',
  },
  create_passkey_success: {
    header: 'Bienvenue !',
    secondary_header: 'Passkey créée',
    body: 'Vous pouvez maintenant confirmer votre identité en utilisant votre <1>passkey ou via un code à usage unique par e-mail</1> lors de votre connexion.',
  },
  activate_passkey: {
    header: 'Connectez-vous encore plus vite avec <1>Passkeys</1>',
    primary_btn: 'Activer',
    secondary_btn: 'Peut-être plus tard',
  },
  email_link: {
    header: 'Entrez le code pour créer le compte',
    body: 'Nous venons d’envoyer un code à usage unique à <1>adresse e-mail</1>. Le code expire bientôt, veuillez donc l’entrer rapidement.',
    otp_required: 'OTP valide requis',
  },
  generic: {
    name: 'Nom',
    email: 'Adresse e-mail',
    continue: 'Continuer',
    cancel: 'Annuler',
  },
  validation_errors: {
    name: 'Veuillez entrer un nom',
    email: 'Veuillez entrer une adresse e-mail valide',
  },
};

export default fr;
