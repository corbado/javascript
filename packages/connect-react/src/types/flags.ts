const keyConditionalUI = 'conditional-ui-allowed';

export class Flags {
  readonly items: Record<string, string>;

  constructor(items: Record<string, string>) {
    this.items = items;
  }

  addFlags(items: Record<string, string>) {
    for (const [name, value] of Object.entries(items)) {
      this.items[name] = value;
    }
  }

  hasSupportForConditionalUI(): boolean {
    return this.items[keyConditionalUI] === 'true';
  }
}
