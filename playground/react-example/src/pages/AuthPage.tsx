import { useNavigate } from 'react-router-dom';
import CorbadoAuthUI from '@corbado/react';
import frenchTranslations from '../translations/fr';
import englishTranslations from '../translations/en';
import { CorbadoThemes } from '@corbado/react/dist/utils/themes';

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
      theme='corbado-custom-theme-test'
    />
  );
};

export default AuthPage;
