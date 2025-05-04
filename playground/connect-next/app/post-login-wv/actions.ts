'use server';

import { cookies } from 'next/headers';

export async function postPasskeyAppend(_: string, clientState: string) {
  const cookieStore = await cookies();
  cookieStore.set({ name: 'cbo_client_state', value: clientState, httpOnly: true });
}
