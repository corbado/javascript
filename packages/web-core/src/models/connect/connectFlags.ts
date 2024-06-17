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
    const newItems = Object.entries(items).map(([name, value]) => ({ name, value }));
    this.items.push(...newItems);
  }

  static clearStorage() {
    localStorage.removeItem(storageKey);
  }
}
