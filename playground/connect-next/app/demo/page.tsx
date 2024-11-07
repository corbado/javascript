'use client';

import { CorbadoConnectDemo } from '@corbado/connect-react';
import './custom.css';

export default function DemoPage() {
  return (
    <div className='w-full flex justify-center'>
      <div className='max-w-[600px] my-4 mx-4'>
        <CorbadoConnectDemo
          dummy={''}
          projectId={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!}
          frontendApiUrlSuffix={process.env.NEXT_PUBLIC_CORBADO_FRONTEND_API_URL_SUFFIX}
        />
      </div>
    </div>
  );
}
