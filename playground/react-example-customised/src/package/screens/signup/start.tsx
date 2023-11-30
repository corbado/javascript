import { FunctionComponent } from 'react';
import '../../styles/index.css';
import { Text, Button, LabelledInput } from '../../components';

const SignUpStart: FunctionComponent = () => {
  return (
    <>
      <Text variant='header'>Create your account</Text>
      <Text variant='sub-header'>
        You already have an account?
        <span className='link text-secondary-font-color'>Log in</span>{' '}
      </Text>
      <div className='form-wrapper'>
        <form onSubmit={() => {}}>
          <div className='mb-2'>
            <LabelledInput
              name='name'
              label='Name'
            />
            <LabelledInput
              name='username'
              label='Email Address'
            />
          </div>
          <Button variant='primary'>Continue with email</Button>
        </form>
      </div>
    </>
  );
};

export default SignUpStart;
