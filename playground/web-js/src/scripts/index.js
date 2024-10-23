import Corbado from '@corbado/web-js';
import { CORBADO_PROJECT_ID, CORBADO_FRONTEND_API_URL_SUFFIX } from './environment';

await loadPage();

async function loadPage() {
  const pathParts = window.location.pathname.split('/');
  const projectId = pathParts.find(part => part.startsWith('pro-')) || CORBADO_PROJECT_ID;

  await Corbado.load({
    projectId: projectId,
    frontendApiUrlSuffix: CORBADO_FRONTEND_API_URL_SUFFIX,
    darkMode: 'auto',
    setShortSessionCookie: true,
  });

  window.onpopstate = loadPage;

  if (pathParts.includes('auth')) {
    history.replaceState(null, '', `/${projectId}/auth`);
    loadAuthDOM();

    const authElement = document.getElementById('corbado-auth');
    Corbado.mountAuthUI(authElement, {
      onLoggedIn: async () => {
        history.pushState(null, '', `/${projectId}`);
        await loadPage();
      },
      initialBlock: 'login-init',
    });
  } else {
    history.replaceState(null, '', `/${projectId}`);
    loadHomeDOM();

    if (!Corbado.user) {
      const corbadoAppElement = document.getElementById('corbado-app');
      corbadoAppElement.style.display = 'none';
      const corbadoAuthElement = document.getElementById('login');
      corbadoAuthElement.onclick = async () => {
        history.pushState(null, '', `/${projectId}/auth`);
        await loadPage();
      };
    } else {
      const fallbackUI = document.getElementById('fallback-ui');
      fallbackUI.style.display = 'none';

      const header = document.getElementById('header');
      header.innerHTML = `Hi ${Corbado.user?.orig}, you are logged in.`;

      const shortSession = document.getElementById('short-session');
      shortSession.style.maxWidth = '550px';
      Corbado.mountUserUI(shortSession);

      const logoutButton = document.getElementById('logout');
      logoutButton.addEventListener('click', async () => {
        await Corbado.logout();
        history.pushState(null, '', `/${projectId}/auth#login-init`);
        await loadPage();
      });

      const passkeyList = document.getElementById('passkey-list');
      passkeyList.style.maxWidth = '550px';
      Corbado.mountPasskeyListUI(passkeyList);

      /******************* Section for customised passkey management component ************************/
      //Uncomment the below code to use the customised passkey management component
      // const passkeysResp = await Corbado.getPasskeys();

      // if (passkeysResp.err) {
      //   passkeyList.innerHTML = `
      //     <h2>Passkeys</h2>
      //     <p>There was an error fetching your passkeys. Please try again later.</p>
      //   `;
      // } else {
      //   const passkeys = passkeysResp.val;
      //   passkeyList.innerHTML = `
      //     <h2>Passkeys</h2>
      //     <p>Here are your passkeys:</p>
      //     <ul>
      //       ${passkeys.passkeys.map((passkey) => {
      //         const passkeyDetails = JSON.stringify(passkey, null, 2);
      //         const passkeyId = passkey.id;
      //         return `<li>${passkeyDetails}</li> <button id="revoke-passkey-${passkeyId}"}">Revoke Passkey</button> `
      //       }).join('')}
      //     </ul>
      //     <button id="create-passkey">Create Passkey</button>
      //   `;

      //   passkeys.passkeys.forEach((passkey) => {
      //     const passkeyId = passkey.id;
      //     const revokeButton = document.getElementById(`revoke-passkey-${passkeyId}`);
      //     revokeButton.addEventListener('click', async () => {
      //       const revokeResp = await Corbado.deletePasskey(passkeyId);
      //       if (revokeResp.err) {
      //         alert('There was an error revoking the passkey. Please try again later.');
      //       } else {
      //         alert('Passkey revoked successfully.');
      //         window.location.reload();
      //       }
      //     });
      //   });

      //   const createButton = document.getElementById('create-passkey');
      //   createButton.addEventListener('click', async () => {
      //     const createResp = await Corbado.appendPasskey();
      //     if (createResp.err) {
      //       alert('There was an error creating the passkey. Please try again later.');
      //     } else {
      //       alert('Passkey created successfully.');
      //       window.location.reload();
      //     }
      //   });
      // }
    }
  }
}

function loadAuthDOM() {
  document.body.innerHTML = `
    <div id="corbado-auth"></div>
  `;
}

function loadHomeDOM() {
  document.body.innerHTML = `
    <div id="corbado-app">
      <h1 id="header"></h1>
      <div>
        <h3>This is your short session</h3>
        <p id="short-session"></p>
      </div>
      <button
        id="logout"
        style="margin: 2rem 0.2rem"
      >
        Logout
      </button>
      <div>
        <h3>Passkey Lists</h3>
        <div id="passkey-list"></div>
      </div>
    </div>
    <div id="fallback-ui">
      <p>This is the fallback UI. You should not see this unless you are not logged in.</p>
      <button
        id="login"
        style="margin: 2rem 0.2rem"
      >
        Login
      </button>
    </div>
  `;
}
