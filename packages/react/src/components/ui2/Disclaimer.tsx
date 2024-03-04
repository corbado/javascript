import React from 'react';

import { Link } from './buttons/Link';

const Disclaimer = () => {
  return (
    <footer className='cb-disclaimer-2'>
      <p>
        By continuing you agree to our <Link href='https://corbado.com'>User Agreement</Link>,{' '}
        <Link href='https://corbado.com'>Wallet Service Terms</Link>, and{' '}
        <Link href='https://corbado.com'>Privacy Policy</Link>.
      </p>
    </footer>
  );
};

export default Disclaimer;
