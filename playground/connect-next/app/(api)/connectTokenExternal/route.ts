import { NextRequest } from 'next/server';
import { getCorbadoConnectTokenExternal, verifyAmplifyTokenExternal } from '@/lib/utils';

type Payload = {
  idToken: string;
  connectTokenType: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Payload;

  const { idToken, connectTokenType } = body;

  try {
    const { displayName, identifier } = await verifyAmplifyTokenExternal(idToken);

    const connectToken = await getCorbadoConnectTokenExternal(connectTokenType, {
      displayName: displayName,
      identifier: identifier,
    });

    return new Response(JSON.stringify({ token: connectToken }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Error verifying token or getting connect token', e);

    return new Response(JSON.stringify({ error: 'Failed to verify token or get connect token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
