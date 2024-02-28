export interface Paging {
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface CorbadoAppParams {
  projectId: string;
  apiTimeout?: number;
  frontendApiUrl?: string;
  isDevMode?: boolean;
  setShortSessionCookie?: boolean;
  isPreviewMode?: boolean;
}
