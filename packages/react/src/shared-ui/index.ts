import './styles/index.css';

import i18nDe from './i18n/de.json';
import i18nEn from './i18n/en.json';

export const i18n = {
  en: i18nEn,
  de: i18nDe,
};
export * from './utils';
export * from './flowHandler';
export type { BehaviorSubject } from 'rxjs';
