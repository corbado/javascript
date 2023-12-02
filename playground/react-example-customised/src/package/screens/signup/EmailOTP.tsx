import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { Header, Body } from '../../components';
import OTPForm from '../../components/OTPForm';

const EmailOtp: FunctionComponent = () => {
  return (
    <div className='cb-container'>
      <Header>Enter code to create account</Header>
      <Body className='cb-body-spacing'>
        We just sent a one time code to <span className='cb-link-secondary'>abcd@testing.com</span>. The code expires
        shortly, so please enter it soon.
      </Body>
      <OTPForm />
    </div>
  );
};

export default EmailOtp;
