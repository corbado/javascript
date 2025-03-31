import LoginComponent from '@/app/login/LoginComponent';
import { cookies } from 'next/headers';

export type Props = {
  clientState: string | undefined;
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const clientState = cookieStore.get('cbo_client_state');
  console.log('clientState', clientState);

  return <LoginComponent clientState={clientState?.value} />;
}
