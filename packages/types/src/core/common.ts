export interface Paging {
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface CorbadoAppParams {
  projectId: string;
  apiTimeout?: number;
  // deprecated (no longer needed, Corbado backend sets this value automatically)
  frontendApiUrl?: string;
  frontendApiUrlSuffix?: string;
  isDevMode?: boolean;
  setShortSessionCookie?: boolean;
  isPreviewMode?: boolean;
}
