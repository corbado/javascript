const getStorageKey = (projectId: string) => `cbo_auth_process-${projectId}`;

export class AuthProcess {
  readonly id: string;
  readonly projectId: string;
  readonly frontendApiUrl: string;
  readonly expiresAt: number;

  constructor(id: string, projectId: string, expiresAt: number, frontendApiUrl: string) {
    this.id = id;
    this.projectId = projectId;
    this.expiresAt = expiresAt;
    this.frontendApiUrl = frontendApiUrl;
  }

  isValid(): boolean {
    return this.expiresAt > Date.now() / 1000;
  }

  static loadFromStorage(projectId: string): AuthProcess | undefined {
    const serialized = localStorage.getItem(getStorageKey(projectId));
    if (!serialized) {
      return undefined;
    }

    const { id, expiresAt, frontendApiUrl } = JSON.parse(serialized);
    const process = new AuthProcess(id, projectId, expiresAt, frontendApiUrl);
    if (!process.isValid()) {
      return undefined;
    }

    return process;
  }

  persistToStorage() {
    localStorage.setItem(
      getStorageKey(this.projectId),
      JSON.stringify({
        id: this.id,
        expiresAt: this.expiresAt,
        frontendApiUrl: this.frontendApiUrl,
      }),
    );
  }

  static clearStorage(projectId: string) {
    localStorage.removeItem(getStorageKey(projectId));
  }
}
