import { useNavigate } from 'react-router-dom';
import { CorbadoAuthUI } from '@corbado/react';
import frenchTranslations from '../translations/fr';
import englishTranslations from '../translations/en';

const AuthPage = () => {
  const navigate = useNavigate();

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
    />
  );
};

export default AuthPage;
