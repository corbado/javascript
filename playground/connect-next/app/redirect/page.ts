import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Page = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) => {
  const cookieStore = await cookies();
  const params = await searchParams;

  if (!params) {
    return null;
  }

  const token = params['token'];
  const redirectUrl = params['redirectUrl'];

  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
  });

  redirect(redirectUrl);
};

export default Page;
