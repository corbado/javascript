'use server';

import { cookies } from 'next/headers';

export async function postPasskeyAppend(_: string, clientState: string) {
  // update client side state
  cookies().set({ name: 'cbo_client_state', value: clientState, httpOnly: true });
}
