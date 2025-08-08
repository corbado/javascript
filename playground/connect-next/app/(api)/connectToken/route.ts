import { NextRequest } from 'next/server';
import { getCorbadoConnectToken, verifyAmplifyToken } from '@/lib/utils';

type Payload = {
  idToken: string;
  connectTokenType: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Payload;

  const { idToken, connectTokenType } = body;

  const { displayName, identifier } = await verifyAmplifyToken(idToken);

  const connectToken = await getCorbadoConnectToken(connectTokenType, {
    displayName: displayName,
    identifier: identifier,
  });

  return new Response(JSON.stringify({ token: connectToken }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
