import type { RecoverableError } from '@corbado/web-core';
import type { Result } from 'ts-results';

function defaultErrorHandler(error: RecoverableError) {
  throw error;
}

export const makeApiCallWithErrorHandler = async <V, E extends RecoverableError>(
  apiCall: () => Promise<Result<V, E>>,
  errorHandler: (error: E) => void = defaultErrorHandler,
): Promise<V> => {
  const resp = await apiCall();
  let result: V;

  if (resp.err) {
    errorHandler(resp.val);
    return Promise.reject(resp.val);
  } else {
    // result is set in else for type inference
    result = resp.val;
  }

  return result;
};
