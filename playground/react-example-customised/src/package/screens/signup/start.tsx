import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { FormInput, Header, SubHeader, Form } from '../../components';

const SignUpStart: FunctionComponent = () => {
  return (
    <div className='cb-container'>
      <Header>Create your account</Header>
      <SubHeader>
        You already have an account? <span className='cb-link-secondary'>Log in</span>
      </SubHeader>
      <Form
        onSubmit={() => {}}
        submitButtonText='Continue with email'
      >
        <FormInput
          name='name'
          label='Name'
          value='asdasd'
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
