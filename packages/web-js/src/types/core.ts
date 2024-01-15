import type { CorbadoAppParams, CorbadoUIConfig } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';

export interface CorbadoConfig extends CorbadoUIConfig, CorbadoAppParams {
  onError?: (error: NonRecoverableError) => void;
}
