import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  let issuer = `${req.nextUrl.origin}/api/mock-oidc`;
  if (process.env.CORBADO_OIDC_MOCK_EXPLICIT_ISSUER) {
    issuer = process.env.CORBADO_OIDC_MOCK_EXPLICIT_ISSUER;
  }

  return Response.json({
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
    userinfo_endpoint: `${issuer}/userinfo`,
    jwks_uri: `${issuer}/jwks`,
    response_types_supported: ['code'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid', 'email', 'profile'],
    token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic', 'none'],
    claims_supported: ['sub', 'email', 'email_verified', 'name', 'iss', 'aud', 'exp', 'iat'],
    grant_types_supported: ['authorization_code'],
  });
}
