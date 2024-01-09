import type { Corbado } from './core/Corbado';

declare global {
  interface Window {
    Corbado: Corbado;
  }
}
