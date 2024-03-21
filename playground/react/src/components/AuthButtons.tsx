import { useNavigate, useParams } from 'react-router-dom';
import 'react-phone-number-input/style.css';
import { Value, formatPhoneNumberIntl } from 'react-phone-number-input/input';
import { useState } from 'react';
import CountrySelect from './CountryDropdown';

export const AuthButtons = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [value, setValue] = useState<Value>();

  return (
    <div className='auth-buttons'>
      <h2>You are not logged in. You can use the below auth pages to authenticate the user</h2>
      <button
        className='primary-auth-button'
        onClick={() => navigate(`/${projectId}/auth`)}
      >
        Auth Page (with complete auth component)
      </button>
      <button
        className='primary-auth-button'
        onClick={() => navigate(`/${projectId}/signup`)}
      >
        SignUp Page
      </button>
      <button
        className='primary-auth-button'
        onClick={() => navigate(`/${projectId}/login`)}
      >
        Login Page
      </button>
      <CountrySelect onChange={setValue}></CountrySelect>
      {value && (
        <div>
          Phone number is: {value} <p>International Format is: {formatPhoneNumberIntl(value)}</p>
        </div>
      )}
    </div>
  );
};
