const getStorageKey = (projectId: string) => `cbo_connect_flags-${projectId}`;

export type ConnectFlag = {
  name: string;
  value: string;
};

/**
 * ConnectFlags holds a set of feature flags that are used to control the behavior of the Connect login and append process.
 * The flags are stored in local storage and can be persisted across sessions.
 * For each Corbado project there is a separate set of flags => the project ID is used as part of the key to store the flags.
 */
export class ConnectFlags {
  readonly items: ConnectFlag[];

  constructor(items: ConnectFlag[]) {
    this.items = items;
  }

  static loadFromStorage(projectId: string): ConnectFlags {
    const serialized = localStorage.getItem(getStorageKey(projectId));
    if (!serialized) {
      return new ConnectFlags([]);
    }

    const { items } = JSON.parse(serialized);

    return new ConnectFlags(items);
  }

  persistToStorage(projectId: string) {
    localStorage.setItem(
      getStorageKey(projectId),
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

  static clearStorage(projectId: string) {
    localStorage.removeItem(getStorageKey(projectId));
  }
}
