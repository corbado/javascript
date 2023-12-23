import type { FC } from 'react';
import React from 'react';

import { Spinner } from '../components';

const Loading: FC = () => {
  return (
    <div className='cb-loading'>
      <Spinner />
    </div>
  );
};

export default Loading;
