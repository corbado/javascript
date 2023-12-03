import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { PasskeyScreensWrapper, PasskeyScreensWrapperProps } from '../../components';

const PasskeySuccess: FunctionComponent = () => {
  const header = 'Welcome!';
  const body = (
    <>
      You can now confirm your identity using your <strong>passkey or via email one time code</strong> when you log in.
    </>
  );
  const secondaryHeader = 'Passkey created';

  const primaryButton = 'Continue';

  const props: PasskeyScreensWrapperProps = {
    header,
    secondaryHeader,
    body,
    primaryButton,
    onClick: () => {},
  };

  return (
    <div className='cb-container'>
      <PasskeyScreensWrapper {...props} />
    </div>
  );
};

export default PasskeySuccess;
