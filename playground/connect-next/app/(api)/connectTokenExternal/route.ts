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

    const simulateError = process.env.SIMULATE_ERROR;
    if (simulateError && displayName.endsWith('@corbado.com')) {
      console.warn('Simulating error for testing purposes');

      switch (simulateError) {
        case 'error_response':
          return new Response(JSON.stringify({ error: 'Simulated error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        case 'invalid_token':
          return new Response(JSON.stringify({ token: 'invalid_token' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        case 'empty_token':
          return new Response(JSON.stringify({ token: '' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
      }
    }

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
