import Corbado from '@corbado/web-js';

const insertAuthComponent = (demoComponent: HTMLElement, corbadoApp: typeof Corbado) => {
  const authElement =
    document.getElementById('corbado-auth') ?? demoComponent!.appendChild(document.createElement('div'));
  authElement.setAttribute('id', 'corbado-auth');
  corbadoApp.mountAuthUI(authElement, {
    onLoggedIn: () => {
      location.reload();
    },
  });
};

const insertPasskeyList = (demoComponent: HTMLElement, corbadoApp: typeof Corbado) => {
  let passkeyList = document.getElementById('passkey-list');

  if (passkeyList) {
    corbadoApp.mountPasskeyListUI(passkeyList);
    return;
  }

  passkeyList = demoComponent!.appendChild(document.createElement('div'));
  passkeyList.setAttribute('id', 'passkey-list');
  passkeyList.setAttribute('class', 'flex flex-col flex-grow');
  corbadoApp.mountPasskeyListUI(passkeyList!);

  const logoutButton = demoComponent!.appendChild(document.createElement('button'));
  logoutButton.setAttribute('class', 'bg-lightBrown hover:bg-darkBrown text-white font-bold py-2 px-4 rounded-full');
  logoutButton.innerHTML = 'Logout';
  logoutButton!.onclick = () => {
    corbadoApp.logout();
    location.reload();
  };
};

export const insertDemoComponent = (corbadoApp: typeof Corbado) => {
  const demoComponent = document.getElementById('demo');

  return !corbadoApp.isAuthenticated
    ? insertAuthComponent(demoComponent!, corbadoApp)
    : insertPasskeyList(demoComponent!, corbadoApp);
};
