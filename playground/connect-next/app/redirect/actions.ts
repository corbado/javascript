'use server';

import { cookies } from 'next/headers';

export const setIdToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'idToken',
    value: token,
    httpOnly: true,
  });
};
