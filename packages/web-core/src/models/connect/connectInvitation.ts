const getStorageKey = () => `cbo_connect_invitation`;

export class ConnectInvitation {
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  static loadFromStorage(): ConnectInvitation | undefined {
    const serialized = localStorage.getItem(getStorageKey());
    if (!serialized) {
      return undefined;
    }

    const { token } = JSON.parse(serialized);

    return new ConnectInvitation(token);
  }

  persistToStorage() {
    localStorage.setItem(
      getStorageKey(),
      JSON.stringify({
        token: this.token,
      }),
    );
  }

  static clearStorage() {
    localStorage.removeItem(getStorageKey());
  }
}
