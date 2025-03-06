import { cookies } from 'next/headers';
import Home from '@/app/home/client';

export default function Page() {
  const maybeSecretCode = cookies().get('secretCode');

  return <Home maybeSecretCode={maybeSecretCode?.value} />;
}
