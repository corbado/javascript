import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { FormInput, Header, SubHeader, Form } from '../../components';

const SignUpStart: FunctionComponent = () => {
  return (
    <div className='cb-container'>
      <Header>Create your account</Header>
      <SubHeader>
        You already have an account? <span className='cb-link'>Log in</span>
      </SubHeader>
      <Form onSubmit={() => {}}>
        <FormInput
          name='name'
          label='Name'
        />
        <FormInput
          name='username'
          label='Email Address'
        />
      </Form>
    </div>
  );
};

export default SignUpStart;
