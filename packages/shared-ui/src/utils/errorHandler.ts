import type { RecoverableError } from '@corbado/web-core';
import type { Result } from 'ts-results';

function defaultErrorHandler(error: RecoverableError) {
  throw error;
}

function defaultSuccessHandler() {
  // do nothing
}

export const makeApiCallWithErrorHandler = async <V, E extends RecoverableError>(
  apiCall: () => Promise<Result<V, E | undefined>>,
  onSuccess: (value: V) => void = defaultSuccessHandler,
  onError: (error: E) => void = defaultErrorHandler,
): Promise<V> => {
  const resp = await apiCall();
  let result: V;

  if (resp.err) {
    if (resp.val) {
      onError(resp.val);
    }

    result = null as V;
  } else {
    onSuccess(resp.val);
    // result is set in else for type inference
    result = resp.val;
  }

  return result;
};
