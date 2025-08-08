'use server';

import { cookies } from 'next/headers';

export const setTOTPSecretCode = async (secretCode: string) => {
  const cookieStore = await cookies();
  cookieStore.set('secretCode', secretCode);
};
