export interface Paging {
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface CorbadoAppParams {
  projectId: string;
  apiTimeout?: number;
  frontendApiUrlSuffix?: string;
  isDevMode?: boolean;
  isPreviewMode?: boolean;
}
