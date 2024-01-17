import { Err, Ok } from 'ts-results';

import { InvalidTokenInputError } from '../errors';

export const getEmailLinkToken = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const emailLinkId = searchParams.get('corbadoEmailLinkID');
  if (!emailLinkId) {
    return Err(new InvalidTokenInputError());
  }
  const token = searchParams.get('corbadoToken')?.split('#email-link-confirm')[0];
  if (!token) {
    return Err(new InvalidTokenInputError());
  }

  return Ok({ emailLinkId, token });
};
