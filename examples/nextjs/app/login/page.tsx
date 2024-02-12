import { Providers } from '../providers';
import LoginForm from '../ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <Providers>
        <LoginForm />
      </Providers>
    </main>
  );
}
