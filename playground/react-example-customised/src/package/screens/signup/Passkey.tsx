import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { PasskeyScreensWrapper } from '../../components';

const Passkey: FunctionComponent = () => {
  const header = (
    <span>
      Let's get you set up with <span className='cb-link-primary'>Passkeys</span>
    </span>
  );

  const subHeader = (
    <span>
      We'll create an account for <span className='cb-secondary-text'>abcd@testing.com</span>
    </span>
  );

  const primaryButton = 'Create your account';
  const secondaryButton = 'Send email one time code';
  const tertiaryButton = 'Back';

  const props = {
    header,
    subHeader,
    primaryButton,
    secondaryButton,
    tertiaryButton,
    showHorizontalRule: true,
    onClick: () => {},
  };

  return (
    <div className='cb-container'>
      <PasskeyScreensWrapper {...props} />
    </div>
  );
};

export default Passkey;
