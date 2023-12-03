import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { PasskeyScreensWrapper, PasskeyScreensWrapperProps } from '../../components';

const PasskeyBenefits: FunctionComponent = () => {
  const header = 'Passkeys';

  const body = (
    <>
      With passkeys, you don't need to remember complex passwords anymore. Log in securely by using{' '}
      <strong>Face ID, Touch ID or screen lock code</strong>.
    </>
  );

  const primaryButton = 'Create passkey';
  const secondaryButton = 'Maybe later';

  const props: PasskeyScreensWrapperProps = {
    header,
    body,
    primaryButton,
    secondaryButton,
    onClick: () => {},
  };

  return (
    <div className='cb-container'>
      <PasskeyScreensWrapper {...props} />
    </div>
  );
};

export default PasskeyBenefits;
