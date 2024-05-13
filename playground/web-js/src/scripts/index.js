import Corbado from '@corbado/web-js';
import { CORBADO_PROJECT_ID } from './environment';

await Corbado.load({
  projectId: CORBADO_PROJECT_ID,
  darkMode: 'auto',
});

if (!Corbado.user) {
  const corbadoAppElement = document.getElementById('corbado-app');
  corbadoAppElement.style.display = 'none';
  const corbadoAuthElement = document.getElementById('login');
  corbadoAuthElement.onclick = () => {
    window.location.href = '/auth.html';
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
    window.location.href = '/auth.html#login-init';
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
