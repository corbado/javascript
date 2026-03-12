import { getPublicJwk } from '../../../../src/server/test-tools/mock-oidc-keys';

export async function GET() {
  const jwk = await getPublicJwk();
  return Response.json({
    keys: [jwk],
  });
}
