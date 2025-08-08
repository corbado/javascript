'use server';

import { cookies } from 'next/headers';

export async function postPasskeyLogin(clientState: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'cbo_client_state',
    value: clientState,
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  });
}
