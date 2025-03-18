import LoginComponent from '@/app/login/LoginComponent';
import { cookies } from 'next/headers';

export type Props = {
  clientState: string | undefined;
};

export default function LoginPage() {
  const clientState = cookies().get('cbo_client_state');
  console.log('clientState', clientState);

  return <LoginComponent clientState={clientState?.value} />;
}
