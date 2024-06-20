const storageKey = 'cbo_connect_flags';

export type ConnectFlag = {
  name: string;
  value: string;
};

export class ConnectFlags {
  readonly items: ConnectFlag[];

  constructor(items: ConnectFlag[]) {
    this.items = items;
  }

  static loadFromStorage(): ConnectFlags {
    const serialized = localStorage.getItem(storageKey);
    if (!serialized) {
      return new ConnectFlags([]);
    }

    const { items } = JSON.parse(serialized);
    console.log('connectFlags:', items);

    return new ConnectFlags(items);
  }

  persistToStorage() {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        items: this.items,
      }),
    );
  }

  getItemsObject() {
    return this.items.reduce(
      (acc, item) => {
        acc[item.name] = item.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  addItemsObject(items: Record<string, string>) {
    for (const [name, value] of Object.entries(items)) {
      const existing = this.items.find(item => item.name === name);
      if (existing) {
        existing.value = value;
      } else {
        this.items.push({ name, value });
      }
    }
  }

  static clearStorage() {
    localStorage.removeItem(storageKey);
  }
}
