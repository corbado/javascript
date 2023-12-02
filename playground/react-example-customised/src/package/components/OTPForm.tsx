import { Gmail, Yahoo, Outlook } from './Icons';
import { IconLink } from './IconLink';
import { OTPInput } from './OTPInput';
import { Button } from './Button';
import { useState } from 'react';

function OTPForm() {
  const [error, setError] = useState('');
  return (
    <div className='cb-form-otp'>
      <div className='cb-email-links'>
        <IconLink
          Icon={Gmail}
          label='Google'
        />
        <IconLink
          Icon={Yahoo}
          label='Yahoo'
        />
        <IconLink
          Icon={Outlook}
          label='Outlook'
        />
      </div>
      <OTPInput emittedOTP={() => {}} />
      {error && <p className='error-text mt-3 ml-0'>{error}</p>}

      <Button
        type='button'
        onClick={() => {}}
        className='mt-4'
        variant='primary'
        // isLoading={loading}
        // disabled={loading}
      >
        Continue
      </Button>
      <Button
        type='button'
        onClick={() => {}}
        variant='tertiary'
        // disabled={loading}
      >
        Back
      </Button>
    </div>
  );
}

export default OTPForm;
