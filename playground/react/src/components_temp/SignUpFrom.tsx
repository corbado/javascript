import React from 'react';
import InputField from './InputField';
import './style.css';
import ErrorPopup from './ErrorPopup';

const SignUpForm: React.FC = () => {
  return (
    <section className='cb-container'>
      <ErrorPopup />
      <form>
        <header className='cb-header'>
          <h1>Create your account</h1>
        </header>
        <p className='cb-subheader'>to continue to AppName</p>
        <InputField
          label='Name'
          id='name'
          errorMessage='Please enter a valid name'
          errorImgSrc='path/to/your/error-icon.svg'
          errorImgAlt='Error icon'
        />
        <InputField
          label='Username'
          id='username'
          errorMessage='Username can only contain letters, numbers and “-” or “_”.'
          errorImgSrc='path/to/your/error-icon.svg'
          errorImgAlt='Error icon'
        />
        <InputField
          label='Email address'
          id='email'
          type='email'
          errorMessage='That email address is taken. Please try another one.'
          errorImgSrc='path/to/your/error-icon.svg'
          errorImgAlt='Error icon'
        />
        <InputField
          label='Phone number'
          id='phone'
          errorMessage='Phone number must be a valid phone number.'
          errorImgSrc='path/to/your/error-icon.svg'
          errorImgAlt='Error icon'
        />
        <button
          type='submit'
          className='cb-button'
        >
          Sign Up
        </button>
        <footer className='cb-footer'>
          <p className='cb-footer-text'>
            By continuing you agree to our
            <a
              href='#'
              className='cb-link'
            >
              User Agreement
            </a>
            ,
            <a
              href='#'
              className='cb-link'
            >
              Wallet Service Terms
            </a>
            , and
            <a
              href='#'
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
