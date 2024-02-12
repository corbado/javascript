import { Providers } from '../providers';
import SignupForm from '../ui/signup-form';

export default function LoginPage() {
  return (
    <main className='flex items-center justify-center md:h-screen'>
      <Providers>
        <SignupForm />
      </Providers>
    </main>
  );
}
