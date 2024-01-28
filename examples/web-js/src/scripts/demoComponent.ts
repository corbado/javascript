import Corbado from '@corbado/web-js';

export const insertDemoComponent = (corbadoApp: typeof Corbado) => {
  const demoComponent = document.getElementById('demo');

  if (corbadoApp.isAuthenticated) {
    demoComponent!.innerHTML = `
    <div id="passkey-list" class='flex flex-col flex-grow'></div>
    <button
        id="logout-button"
        class='bg-lightBrown hover:bg-darkBrown text-white font-bold py-2 px-4 rounded-full'
    >
        Logout
    </button>
        `;

    const passkeyList = document.getElementById('passkey-list');
    corbadoApp.mountPasskeyListUI(passkeyList!);

    const logoutButton = document.getElementById('logout-button');
    logoutButton!.onclick = () => {
      corbadoApp.logout();
      location.reload();
    };
  } else {
    demoComponent!.innerHTML = `
            <div id="corbado-auth"></div>
        `;

    const authElement = document.getElementById('corbado-auth');
    corbadoApp.mountAuthUI(authElement!, {
      onLoggedIn: () => {
        location.reload();
      },
    });
  }
};
