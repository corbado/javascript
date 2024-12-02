import type { CorbadoConnectDemoConfig } from '@corbado/types';
import type { Passkey } from '@corbado/web-core';
import type { FC } from 'react';
import React from 'react';
import AppendInitLoading from './append/append-init/AppendInitLoading';
import AppendSuccessScreen from './append/AppendSuccessScreen';
import LoginErrorHard from './login/base/LoginErrorHard';
import LoginErrorSoft from './login/base/LoginErrorSoft';
import LoginHybrid from './login/base/LoginHybrid';
import LoginInitLoaded from './login/base/LoginInitLoaded';
import LoginInitLoading from './login/base/LoginInitLoading';
import LoginOneTap from './login/base/LoginOneTap';
import AlreadyExistingModal from './passkeyList/AlreadyExistingModal';
import DeleteModal from './passkeyList/DeleteModal';
import PasskeyAppendNotSupportedModal from './passkeyList/PasskeyAppendNotSupportedModal';
import PasskeyList, { PasskeyListState } from './passkeyList/PasskeyList';
import AppendInitLoaded2 from './append/append-init/AppendInitLoaded2';

const getListOfPasskeys = () => {
  const out: Passkey[] = [
    {
      id: '1',
      credentialID: '123',
      attestationType: 'attestationType',
      transport: [],
      backupEligible: true,
      backupState: true,
      authenticatorAAGUID: 'authenticatorAAGUID',
      sourceOS: 'Windows 10',
      sourceBrowser: 'Chrome',
      lastUsed: '2024-10-03 14:45:57',
      created: '2024-10-03 14:45:57',
      status: '' as any,
      aaguidDetails: {
        iconDark: 'https://cdn.cloud.corbado.io/aaguidIcons/01020304-0506-0708-0102-030405060708/dark.png',
        iconLight: 'https://cdn.cloud.corbado.io/aaguidIcons/01020304-0506-0708-0102-030405060708/light.png',
        name: 'Passkey',
      },
    },
    {
      aaguidDetails: {
        iconDark: 'https://cdn.cloud.corbado.io/aaguidIcons/2fc0579f-8113-47ea-b116-bb5a8db9202a/dark.png',
        iconLight: 'https://cdn.cloud.corbado.io/aaguidIcons/2fc0579f-8113-47ea-b116-bb5a8db9202a/light.png',
        name: 'YubiKey 5 Series with NFC',
      },
      attestationType: 'packed',
      authenticatorAAGUID: '2fc0579f-8113-47ea-b116-bb5a8db9202a',
      backupEligible: false,
      backupState: false,
      created: '2024-10-03 14:45:57',
      credentialID: 'KISojPMjtXUArj+vYNxlDKcbZe8pu6oODu8kIPp0H9DxbUYiHkXp5kRduwE2bD9i',
      id: 'cre-10462634909848370484',
      lastUsed: '2024-10-03 14:45:57',
      sourceBrowser: 'Chrome',
      sourceOS: 'macOS',
      status: 'active',
      transport: ['nfc', 'usb'],
    },
    {
      aaguidDetails: {
        iconDark: 'https://cdn.cloud.corbado.io/aaguidIcons/fbfc3007-154e-4ecc-8c0b-6e020557d7bd/dark.svg',
        iconLight: 'https://cdn.cloud.corbado.io/aaguidIcons/fbfc3007-154e-4ecc-8c0b-6e020557d7bd/light.svg',
        name: 'iCloud Keychain',
      },
      attestationType: 'none',
      authenticatorAAGUID: 'fbfc3007-154e-4ecc-8c0b-6e020557d7bd',
      backupEligible: true,
      backupState: true,
      created: '2024-08-30 19:28:48',
      credentialID: 'GseKHMtnpVgWqUf0K/H+wUR1fQw=',
      id: 'cre-13671099221995212892',
      lastUsed: '2024-10-24 03:26:36',
      sourceBrowser: 'Chrome',
      sourceOS: 'macOS',
      status: 'active',
      transport: ['hybrid', 'internal'],
    },
  ];

  return out;
};

type Element = {
  headline: string;
  description?: string;
  reactElement: React.ReactElement;
};

const CorbadoConnectDemo: FC<CorbadoConnectDemoConfig> = _ => {
  const [showDescriptions, setShowDescriptions] = React.useState(false);

  const handleChange = () => {
    setShowDescriptions(!showDescriptions);
  };

  const passkeyListElements: Element[] = [
    {
      headline: 'Initial loading state',
      description: 'This screen is shown to the user when the passkey list component is initializing.',
      reactElement: (
        <PasskeyList
          passkeys={[]}
          onDeleteClick={passkey => console.log('Delete click', passkey)}
          state={PasskeyListState.Loading}
          onAppendClick={() => console.log('Append click')}
          appendLoading={false}
          hardErrorMessage={null}
        />
      ),
    },
    {
      headline: 'Loading failed state',
      description: 'This screen is shown to the user when the passkey list component failed to initialize.',
      reactElement: (
        <PasskeyList
          passkeys={[]}
          onDeleteClick={passkey => console.log('Delete click', passkey)}
          state={PasskeyListState.LoadingFailed}
          onAppendClick={() => console.log('Append click')}
          appendLoading={false}
          hardErrorMessage={null}
        />
      ),
    },
    {
      headline: 'Loaded state (user has no passkeys)',
      description:
        'This screen is shown to the user when the passkey list component is initialized and the user has no passkeys.',
      reactElement: (
        <PasskeyList
          passkeys={[]}
          onDeleteClick={passkey => console.log('Delete click', passkey)}
          state={PasskeyListState.Loaded}
          onAppendClick={() => console.log('Append click')}
          appendLoading={false}
          hardErrorMessage={null}
        />
      ),
    },
    {
      headline: 'Loaded state (user has passkeys)',
      description:
        'This screen is shown to the user when the passkey list component is initialized and the user has at least one passkey.',
      reactElement: (
        <PasskeyList
          passkeys={getListOfPasskeys()}
          onDeleteClick={passkey => console.log('Delete click', passkey)}
          state={PasskeyListState.Loaded}
          onAppendClick={() => console.log('Append click')}
          appendLoading={false}
          hardErrorMessage={null}
        />
      ),
    },
    {
      headline: 'Loaded state with error',
      description:
        'This screen is shown to the user when there was an error after the user tried to append or delete a passkey.',
      reactElement: (
        <PasskeyList
          passkeys={getListOfPasskeys()}
          onDeleteClick={passkey => console.log('Delete click', passkey)}
          state={PasskeyListState.Loaded}
          onAppendClick={() => console.log('Append click')}
          appendLoading={false}
          hardErrorMessage='Passkey operation was cancelled or timed out. Please try again.'
        />
      ),
    },
  ];

  const passkeyListModals: Element[] = [
    {
      headline: 'Passkey delete modal',
      description:
        'This modal is shown to the user when they want to delete a passkey. Only when a user confirms the deletion in this modal, the passkey will be deleted.',
      reactElement: (
        <DeleteModal
          passkey={getListOfPasskeys()[0]}
          onDeleteClick={async _ => Promise.resolve()}
          hide={() => console.log('hide')}
        />
      ),
    },
    {
      headline: 'Passkey already exists modal',
      description:
        'This modal is shown to the user when they try to append a passkey but there is already an existing passkey available on that device.',
      reactElement: <AlreadyExistingModal hide={() => console.log('hide')} />,
    },
    {
      headline: 'Passkey append not supported modal',
      description:
        'This modal is shown to the user when they try to append a passkey but the operation is not supported by their device (e.g. because it is too old).',
      reactElement: <PasskeyAppendNotSupportedModal hide={() => console.log('hide')} />,
    },
  ];

  const append: Element[] = [
    {
      headline: 'Append loading',
      description: 'This screen is shown to the user when the append component is initializing.',
      reactElement: <AppendInitLoading />,
    },
    {
      headline: 'Append screen initial',
      description: 'This screen is shown to the user when the append process is not yet started.',
      reactElement: (
        <AppendInitLoaded2
          errorMessage={undefined}
          appendLoading={false}
          handleShowBenefits={() => console.log('Show benefits')}
          handleSubmit={() => console.log('Submit')}
          handleSkip={() => console.log('Skip')}
        />
      ),
    },
    {
      headline: 'Append screen with error',
      description:
        'This screen is shown to the user when an error occurs during the append process. The user can retry the append.',
      reactElement: (
        <AppendInitLoaded2
          errorMessage={'Passkey operation was cancelled or timed out. Please try again.'}
          appendLoading={false}
          handleShowBenefits={() => console.log('Show benefits')}
          handleSubmit={() => console.log('Submit')}
          handleSkip={() => console.log('Skip')}
        />
      ),
    },
    {
      headline: 'Append successful',
      description: 'This screen is shown to the user when the append process was successful.',
      reactElement: <AppendSuccessScreen />,
    },
  ];

  const login: Element[] = [
    {
      headline: 'Login screen loading',
      description: 'This screen is shown to the user when the login component is initializing.',
      reactElement: <LoginInitLoading />,
    },
    {
      headline: 'Login screen initial',
      description:
        'This screen is shown to the user when the user is not logged in and the login process is not yet started.',
      reactElement: (
        <LoginInitLoaded
          isLoading={false}
          error={undefined}
          onSignupClick={() => console.log('Signup click')}
          autoComplete={'email'}
          handleSubmit={() => console.log('Submit')}
          handleIdentifierUpdate={() => console.log('')}
        />
      ),
    },
    {
      headline: 'Login screen error (user does not exist)',
      description: 'This screen is shown to the user when the user does not exist in the system.',
      reactElement: (
        <LoginInitLoaded
          isLoading={false}
          error={'There is no account registered with this email.'}
          onSignupClick={() => console.log('Signup click')}
          autoComplete={'email'}
          handleSubmit={() => console.log('Submit')}
          handleIdentifierUpdate={() => console.log('')}
        />
      ),
    },
    {
      headline: 'Login soft error',
      description:
        'This screen is shown to the user when a passkey operation has been cancelled during login or when another client-side error occurs. The user sees this error only once. Subsequent errors will be shown as hard errors.',
      reactElement: (
        <LoginErrorSoft
          loading={false}
          handleSubmit={() => console.log('Submit')}
          handleExplicitFallback={() => console.log('Fallback')}
        />
      ),
    },
    {
      headline: 'Login hard error',
      description:
        'This screen is shown to the user when a passkey operation has been cancelled during login. Usually the user is first shown the soft error screen.',
      reactElement: (
        <LoginErrorHard
          loading={false}
          handleSubmit={() => console.log('Submit')}
          handleExplicitFallback={() => console.log('Fallback')}
        />
      ),
    },
    {
      headline: 'Login screen hybrid',
      description:
        'This screen is shown to a user during the login process if there is a high chance that the upcoming passkey operation will be CDA.',
      reactElement: (
        <LoginHybrid
          loading={false}
          handleSubmit={() => console.log('Submit')}
          handleFallback={() => console.log('Fallback')}
        />
      ),
    },
    {
      headline: 'Login screen with OneTap button',
      description:
        'This screen is shown to the user when a passkey is available on the current device. The user thus does not have to type in their email address.',
      reactElement: (
        <LoginOneTap
          loading={false}
          currentIdentifier='igor.gjorgjioski@vicroads.com.au'
          handleSubmit={() => console.log('Submit')}
          handleSwitch={() => console.log()}
        />
      ),
    },
  ];

  return (
    <>
      <div className='demo-controls'>
        <label className='demo-controls-item'>
          <input
            type='checkbox'
            checked={showDescriptions}
            onChange={handleChange}
          />
          Show descriptions for components (optional)
        </label>
      </div>
      {passkeyListElements.map((element, index) => (
        <div
          className='cb-demo-screen-container'
          key={index}
        >
          <div className={`cb-demo-screen ${showDescriptions && 'cb-demo-screen-box'}`}>
            <div className='cb-connect-container cb-connect-passkey-list'>{element.reactElement}</div>
          </div>
          {showDescriptions && (
            <Description
              headline={element.headline}
              description={element.description}
            />
          )}
        </div>
      ))}
      {passkeyListModals.map((element, index) => (
        <div
          className='cb-connect light'
          key={index}
        >
          <div className='cb-connect-custom-style'>
            <div className='cb-modal-outer-content'>{element.reactElement}</div>
          </div>
          {showDescriptions && (
            <Description
              headline={element.headline}
              description={element.description}
            />
          )}
        </div>
      ))}
      {append.map((element, index) => (
        <div
          className='cb-demo-screen-container'
          key={index}
        >
          <div className={`cb-demo-screen ${showDescriptions && 'cb-demo-screen-box'}`}>
            <div className='cb-connect-container cb-connect-append'>{element.reactElement}</div>
          </div>
          {showDescriptions && (
            <Description
              headline={element.headline}
              description={element.description}
            />
          )}
        </div>
      ))}
      {login.map((element, index) => (
        <div
          className='cb-demo-screen-container'
          key={index}
        >
          <div className={`cb-demo-screen ${showDescriptions && 'cb-demo-screen-box'}`}>
            <div className='cb-connect-container cb-connect-login'>{element.reactElement}</div>
          </div>
          {showDescriptions && (
            <Description
              headline={element.headline}
              description={element.description}
            />
          )}
        </div>
      ))}
    </>
  );
};

const Description = ({ headline, description }: { headline: string; description?: string }) => (
  <div className='description'>
    <div className='description-headline'>{headline}</div>
    <div className='description-content'>{description}</div>
  </div>
);

export default CorbadoConnectDemo;
