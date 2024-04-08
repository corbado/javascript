import type { CorbadoConfig as CorbadoCoreConfig } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';

export interface CorbadoConfig extends CorbadoCoreConfig {
  onError?: (error: NonRecoverableError) => void;
}
