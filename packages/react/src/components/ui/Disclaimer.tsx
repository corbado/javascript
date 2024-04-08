import React from 'react';

import { Link } from './buttons/Link';
import { Text } from './typography/Text';

const Disclaimer = () => {
  return (
    <footer className='cb-disclaimer'>
      <Text fontFamilyVariant='secondary'>
        By continuing you agree to our <Link href='https://corbado.com'>User Agreement</Link>,{' '}
        <Link href='https://corbado.com'>Wallet Service Terms</Link>, and{' '}
        <Link href='https://corbado.com'>Privacy Policy</Link>.
      </Text>
    </footer>
  );
};

export default Disclaimer;
