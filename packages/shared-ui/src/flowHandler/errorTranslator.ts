import type { RequestError } from '@corbado/web-core/dist/api/v2';
import type { i18n } from 'i18next';

export class ErrorTranslator {
  #i18next: i18n;

  constructor(i18next: i18n) {
    this.#i18next = i18next;
  }

  translate(error: RequestError | undefined): string | undefined {
    if (!error) {
      return undefined;
    }

    return this.#i18next.t(error.code);
  }
}
