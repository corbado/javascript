import React from 'react';
import { cookies } from 'next/headers';
import WrappedLogin from './WrappedLogin';

export default async function Page() {
  const cookieStore = await cookies();
  const clientState = cookieStore.get('cbo_client_state');
  console.log('clientState', clientState);

  return <WrappedLogin clientState={clientState?.value} />;
}
