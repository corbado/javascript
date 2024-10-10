// base64decode decodes the given BASE64-encoded string. It handles both standard and URL-safe BASE64 encoding.
// It works with Unicode/UTF-8 as well (see https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
export function base64decode(base64: string) {
  // The replaces make it work with URL-base64 encoded strings because atob()
  // expects standard-base64 encoded strings
  const binString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));

  return new TextDecoder().decode(Uint8Array.from(binString, (m: string) => m.charCodeAt(0)));
}

// base64encode encodes the given string to BASE64. It works with Unicode/UTF-8 as
// well (see https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
export function base64encode(bytes: string) {
  const binString = Array.from(new TextEncoder().encode(bytes), byte => String.fromCodePoint(byte)).join('');

  return btoa(binString);
}
