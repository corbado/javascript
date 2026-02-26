import { NextRequest } from 'next/server';
import { deleteCredential, listUsersByIDs } from '../../../../../src/server/test-tools/bapi';
import { finishPasskeyForUser, startPasskeyForUser } from '../../../../../src/server/test-tools/users-service';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { userID: string };
  if (!body.userID) {
    return Response.json({ error: 'userID required' }, { status: 400 });
  }

  const users = await listUsersByIDs([body.userID]);
  const email = users[0]?.emailIdentifiers?.[0]?.value;
  if (!email) {
    return Response.json({ error: 'user email not found' }, { status: 400 });
  }

  const start = await startPasskeyForUser(body.userID, email);
  return Response.json(start);
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as {
    userID: string;
    processID: string;
    trackingID: string;
    attestationResponse: string;
  };
  if (!body.userID || !body.processID || !body.trackingID || !body.attestationResponse) {
    return Response.json(
      { error: 'userID, processID, trackingID and attestationResponse required' },
      { status: 400 },
    );
  }

  await finishPasskeyForUser(body.userID, body.processID, body.trackingID, body.attestationResponse);
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as { userID: string; credentialID: string };
  if (!body.userID || !body.credentialID) {
    return Response.json({ error: 'userID and credentialID required' }, { status: 400 });
  }

  await deleteCredential(body.userID, body.credentialID);
  return Response.json({ ok: true });
}
