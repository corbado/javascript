import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { PasskeyScreensWrapper, PasskeyScreensWrapperProps } from '../../components';

const PasskeyError: FunctionComponent = () => {
  const header = "Let's get you set up";

  const body = (
    <span>
      Creating your account was not possible with <span className='cb-link-primary'>passkeys</span>. Try again or sign
      up with email one time code.
    </span>
  );

  const primaryButton = 'Try again';
  const secondaryButton = 'Send email one time code';
  const tertiaryButton = 'Back';

  const props: PasskeyScreensWrapperProps = {
    header,
    body,
    primaryButton,
    secondaryButton,
    tertiaryButton,
    onClick: () => {},
  };

  return (
    <div className='cb-container'>
      <PasskeyScreensWrapper {...props} />
    </div>
  );
};

export default PasskeyError;
