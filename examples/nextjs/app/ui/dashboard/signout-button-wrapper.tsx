import { Providers } from '@/app/providers';
import SignoutButton from './signout-button';

export default function SignoutButtonWrapper() {
  return (
    <Providers>
      <SignoutButton />
    </Providers>
  );
}
