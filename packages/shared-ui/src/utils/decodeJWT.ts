function base64UrlDecode(input: string) {
  // Replace non-url compatible chars with base64 standard chars
  input = input.replace(/-/g, '+').replace(/_/g, '/');

  // Pad out with standard base64 required padding characters
  const pad = input.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }
    input += new Array(5 - pad).join('=');
  }

  return atob(input);
}

export function decodeJwt(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('InvalidTokenError: JWT must have 3 parts');
  }

  // Decode Header and Payload
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  return { header, payload };
}
