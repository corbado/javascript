import { NextRequest } from 'next/server';
import { createUserWithPrecondition, listSessionUsers, removeUser } from '../../../../src/server/test-tools/users-service';
import type { PreconditionType } from '../../../../src/tools/types';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const devSessionId = req.nextUrl.searchParams.get('devSessionId');
  if (!devSessionId) {
    return Response.json({ error: 'devSessionId required' }, { status: 400 });
  }

  const users = await listSessionUsers(devSessionId);
  return Response.json({ users });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { precondition: PreconditionType };
  const sessionId = req.headers.get('cbo_dev_session_id');

  if (!sessionId) {
    return Response.json({ error: 'cbo_dev_session_id header required' }, { status: 400 });
  }

  if (!body.precondition) {
    return Response.json({ error: 'precondition required' }, { status: 400 });
  }

  const userID = await createUserWithPrecondition(sessionId, body.precondition);
  return Response.json({ userID });
}

export async function DELETE(req: NextRequest) {
  const devSessionId = req.nextUrl.searchParams.get('devSessionId');
  const userID = req.nextUrl.searchParams.get('userID');
  if (!devSessionId || !userID) {
    return Response.json({ error: 'devSessionId and userID required' }, { status: 400 });
  }

  await removeUser(devSessionId, userID);
  return Response.json({ ok: true });
}
