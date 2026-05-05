const keyConditionalUI = 'conditional-ui-allowed';
const keyAutoAppend = 'automatic-append';
const keyEventLow = 'event-low';

export class Flags {
  readonly items: Record<string, string>;

  constructor(items: Record<string, string>) {
    this.items = items;
  }

  addFlags(items: Record<string, string>) {
    for (const [name, value] of Object.entries(items)) {
      this.items[name] = value;

      if (
        name === keyConditionalUI &&
        value === 'false' &&
        this.items[keyEventLow] &&
        this.items[keyEventLow] === 'true'
      ) {
        this.items[keyEventLow] = 'false';
      }
    }
  }

  hasSupportForConditionalUI(): boolean {
    return this.items[keyConditionalUI] === 'true';
  }

  hasSupportForAutomaticAppend(): boolean {
    return this.items[keyAutoAppend] === 'true';
  }

  hasSupportForEventLow(): boolean {
    return this.items[keyEventLow] === 'true';
  }
}
