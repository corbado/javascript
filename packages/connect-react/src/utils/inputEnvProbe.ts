type ScanRoot = Document | ShadowRoot;

type TagQueryEntry = {
  query: string;
  eventType: string;
};

const SIGNAL_TAG_QUERIES: TagQueryEntry[] = [
  { query: 'com-1password-button', eventType: 'pa-1' },
  { query: 'com-1password-menu', eventType: 'pa-2' },
  { query: 'com-1password-notification', eventType: 'pa-3' },
];

const SIGNAL_ATTR_SELECTOR = '[data-lastpass-root], [data-lp], [data-lpignore], [data-lpfieldtype]';
const SIGNAL_ATTR_EVENT_TYPE = 'pa-4';

const POPOVER_MANUAL_SELECTOR = '[popover="manual"]';

const PROFILE_A_MIN_STYLE_LENGTH = 400;
const PROFILE_A_MIN_INITIAL_IMPORTANT = 20;
const PROFILE_A_EVENT_TYPE = 'pa-5';
const PROFILE_B_EVENT_TYPE = 'pa-6';

const safeQueryAll = (root: ScanRoot, selector: string): Element[] => {
  try {
    return Array.from(root.querySelectorAll(selector));
  } catch {
    return [];
  }
};

const isPopoverProfileA = (el: Element): boolean => {
  if (el.getAttribute('popover') !== 'manual') {
    return false;
  }

  const style = el.getAttribute('style') ?? '';
  if (style.length < PROFILE_A_MIN_STYLE_LENGTH) {
    return false;
  }

  if (!/z-index:\s*2147483647\b/i.test(style)) {
    return false;
  }

  if (!/position:\s*fixed\b/i.test(style)) {
    return false;
  }

  if (!/display:\s*block\b/i.test(style)) {
    return false;
  }

  const initialImportantHits = style.match(/initial\s*!important/gi);
  if ((initialImportantHits?.length ?? 0) < PROFILE_A_MIN_INITIAL_IMPORTANT) {
    return false;
  }

  return true;
};

const isPopoverProfileB = (el: Element): boolean => {
  if (isPopoverProfileA(el)) {
    return false;
  }

  if (el.getAttribute('popover') !== 'manual') {
    return false;
  }

  const style = el.getAttribute('style') ?? '';

  if (!/z-index:\s*2147483647\b/i.test(style)) {
    return false;
  }

  if (!/position:\s*fixed\b/i.test(style)) {
    return false;
  }

  if (!/backdrop-filter:\s*[^;]*blur\(\s*20px\s*\)/i.test(style)) {
    return false;
  }

  if (!/background-color:\s*rgba\(\s*35\s*,\s*35\s*,\s*35\s*,/i.test(style)) {
    return false;
  }

  return true;
};

const forEachScanRoot = (cb: (root: ScanRoot) => void): void => {
  cb(document);

  for (const host of Array.from(document.querySelectorAll('*'))) {
    const shadowRoot = (host as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot;
    if (shadowRoot) {
      cb(shadowRoot);
    }
  }
};

export const scanInputEnvSignals = (): Set<string> => {
  const matched = new Set<string>();

  if (typeof document === 'undefined') {
    return matched;
  }

  forEachScanRoot(root => {
    for (const entry of SIGNAL_TAG_QUERIES) {
      if (matched.has(entry.eventType)) {
        continue;
      }

      if (safeQueryAll(root, entry.query).length > 0) {
        matched.add(entry.eventType);
      }
    }

    if (!matched.has(SIGNAL_ATTR_EVENT_TYPE) && safeQueryAll(root, SIGNAL_ATTR_SELECTOR).length > 0) {
      matched.add(SIGNAL_ATTR_EVENT_TYPE);
    }

    if (!matched.has(PROFILE_A_EVENT_TYPE) || !matched.has(PROFILE_B_EVENT_TYPE)) {
      for (const el of safeQueryAll(root, POPOVER_MANUAL_SELECTOR)) {
        if (!matched.has(PROFILE_A_EVENT_TYPE) && isPopoverProfileA(el)) {
          matched.add(PROFILE_A_EVENT_TYPE);
          continue;
        }

        if (!matched.has(PROFILE_B_EVENT_TYPE) && isPopoverProfileB(el)) {
          matched.add(PROFILE_B_EVENT_TYPE);
        }
      }
    }
  });

  return matched;
};
