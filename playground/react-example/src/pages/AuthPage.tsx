import { useNavigate } from 'react-router-dom';
import { CorbadoAuthUI } from '@corbado/react';
import frenchTranslations from '../translations/fr';
import englishTranslations from '../translations/en';

const AuthPage = () => {
  const navigate = useNavigate();
  const isDevMode = process.env.NODE_ENV === 'development';

  const onLoggedIn = () => {
    navigate('/');
  };

  return (
    <CorbadoAuthUI
      onLoggedIn={onLoggedIn}
      customTranslations={{
        fr: frenchTranslations,
        en: englishTranslations,
      }}
      isDevMode={isDevMode}
      customerSupportEmail='dev@test.com'
    />
  );
};

export default AuthPage;
