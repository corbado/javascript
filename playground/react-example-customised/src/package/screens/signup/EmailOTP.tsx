import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { EmailOtpScreenWrapper } from '../../components';

const EmailOtp: FunctionComponent = () => {
  const header = 'Enter code to create account';
  const body = (
    <>
      We just sent a one time code to <span className='cb-link-secondary'>abcd@testing.com</span>. The code expires
      shortly, so please enter it soon.
    </>
  );
  const validationError = 'Please enter a valid code';
  const verificationButtonText = 'Continue';
  const backButtonText = 'Cancel';
  const onVerificationButtonClick = async () => {};
  const onBackButtonClick = () => {};

  return (
    <div className='cb-container'>
      <EmailOtpScreenWrapper
        header={header}
        body={body}
        validationError={validationError}
        verificationButtonText={verificationButtonText}
        backButtonText={backButtonText}
        onVerificationButtonClick={onVerificationButtonClick}
        onBackButtonClick={onBackButtonClick}
      />
    </div>
  );
};

export default EmailOtp;
