import { NextRequest } from 'next/server';
import type { MockOidcBehavior } from '../../../../../src/tools/types';
import { OidcDb } from '../../../../../src/server/test-tools/oidc-db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const devSessionId = req.nextUrl.searchParams.get('devSessionId');
  if (!devSessionId) {
    return Response.json({ error: 'devSessionId required' }, { status: 400 });
  }
  return Response.json(OidcDb.listUsers(devSessionId));
}

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get('cbo_dev_session_id');
  const body = (await req.json()) as { email: string };
  if (!sessionId || !body.email) {
    return Response.json({ error: 'cbo_dev_session_id and email required' }, { status: 400 });
  }
  const user = OidcDb.setSingleUser(sessionId, body.email);
  return Response.json(user);
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as { id: string; behavior: MockOidcBehavior };
  if (!body.id || !body.behavior) {
    return Response.json({ error: 'id and behavior required' }, { status: 400 });
  }
  const updated = OidcDb.updateBehavior(body.id, body.behavior);
  if (!updated) {
    return Response.json({ error: 'mock oidc user not found' }, { status: 404 });
  }
  return Response.json(updated);
}

export async function DELETE(req: NextRequest) {
  const devSessionId = req.nextUrl.searchParams.get('devSessionId');
  if (!devSessionId) {
    return Response.json({ error: 'devSessionId required' }, { status: 400 });
  }
  OidcDb.clearUsers(devSessionId);
  return Response.json({ ok: true });
}
