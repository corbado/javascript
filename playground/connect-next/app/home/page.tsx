import { cookies } from 'next/headers';
import Home from '@/app/home/client';

export default async function Page() {
  const cookieStore = await cookies();
  const maybeSecretCode = cookieStore.get('secretCode');

  return <Home maybeSecretCode={maybeSecretCode?.value} />;
}
