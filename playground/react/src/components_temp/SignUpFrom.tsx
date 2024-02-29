import React from 'react';
import InputField from './InputField';
import './style.css';
import ErrorPopup from './ErrorPopup';

const SignUpForm: React.FC = () => {
  const [showError, setShowError] = React.useState(false);

  return (
    <section className='cb-container'>
      {showError && <ErrorPopup />}
      <form>
        <header className='cb-header'>
          <p>Create your account</p>
        </header>
        <p className='cb-subheader'>to continue to loooooooooooongAppName</p>
        <InputField
          label='Name'
          id='name'
          errorMessage='Please enter a valid name'
          showError={showError}
        />
        <InputField
          label='Username'
          id='username'
          errorMessage='Username can only contain letters, numbers and “-” or “_”.'
          showError={showError}
        />
        <InputField
          label='Email address'
          id='email'
          type='email'
          errorMessage='That email address is taken. Please try another one.'
          showError={showError}
        />
        <InputField
          label='Phone number'
          id='phone'
          errorMessage='Phone number must be a valid phone number.'
          showError={showError}
        />
        <button
          type='button'
          className='cb-button'
          onClick={() => setShowError(!showError)}
        >
          Continue
        </button>
        <p className='cb-auth-change-section'>
          You already have an account? <span className='cb-link'>Log in</span>
        </p>
        <footer className='cb-disclaimer'>
          <p>
            By continuing you agree to our{' '}
            <a
              href='https://corbado.com'
              className='cb-link'
            >
              User Agreement
            </a>
            ,{' '}
            <a
              href='https://corbado.com'
              className='cb-link'
            >
              Wallet Service Terms
            </a>
            , and{' '}
            <a
              href='https://corbado.com'
              className='cb-link'
            >
              Privacy Policy
            </a>
            .
          </p>
        </footer>
      </form>
    </section>
  );
};

export default SignUpForm;
