import { useState } from 'react';
import { Value } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input';
import { useNavigate, useParams } from 'react-router-dom';
import { CountrySelectWithIcon } from './CountrySelect';

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
      <div>
        <PhoneInput
          className='cb-text-2 cb-phone-input-field-input'
          value={value}
          onChange={setValue}
          countrySelectComponent={CountrySelectWithIcon}
          international
          countryCallingCodeEditable={false}
          defaultCountry='US'
        />
      </div>
    </div>
  );
};
