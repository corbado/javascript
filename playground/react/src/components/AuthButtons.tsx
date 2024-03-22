// import { useState } from 'react';
// import { Value, formatPhoneNumberIntl } from 'react-phone-number-input';
// import PhoneInput from 'react-phone-number-input';
import { useNavigate, useParams } from 'react-router-dom';
// import { CountrySelectWithIcon } from './CountrySelect';
// import './temp.css';
// import PhoneInputField from './PhoneField2';

export const AuthButtons = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  // const [value, setValue] = useState<Value>();

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
      {/* <form
        onSubmit={e => {
          e.preventDefault();
          console.log(value, 'phone number form submitted');
        }}
      >
        <PhoneInput
          className='phone-input-field'
          smartCaret={true}
          value={value}
          onChange={setValue}
          countrySelectComponent={CountrySelectWithIcon}
          international
          countryCallingCodeEditable={false}
          defaultCountry='US'
        />

        <div style={{ width: '350px', margin: '1rem 0rem' }}>
          <PhoneInputField onChange={setValue} />
        </div>
      </form>
      {value && <p>Phone number value: {value}</p>}
      {value && <p>International phone number value: {formatPhoneNumberIntl(value)}</p>} */}
    </div>
  );
};
