import Corbado from '@corbado/web-js';
import englishTranslations from '../translations/en';

Corbado.load({
  projectId: import.meta.env.VITE_CORBADO_PROJECT_ID,
  darkMode: 'off',
  customTranslations: {
    en: englishTranslations,
  },
  theme: 'eloquent-corbado-test',
});

const createButton = (text: string, clickHandler: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) => {
  const buttonElement = document.getElementById('auth-button')!;
  buttonElement.innerHTML = text;
  buttonElement.onclick = clickHandler;
  return buttonElement;
};

const addLoginButton = () => {
  return createButton('Login', () => {
    window.location.href = '/auth.html';
  });
};

const addLogoutButton = () => {
  return createButton('Logout', () => {
    Corbado.logout();
    window.location.href = '/auth.html';
  });
};

if (!Corbado.user) {
  const corbadoAppElement = document.getElementById('corbado-app');
  corbadoAppElement!.style.display = 'none';
  addLoginButton();
} else {
  const header = document.getElementById('welcome-message')!;
  header.innerHTML = `Hi ${Corbado.user?.orig}, you are logged in.`;

  addLogoutButton();

  const passkeyList = document.getElementById('passkey-list');
  Corbado.mountPasskeyListUI(passkeyList!);
}
