export interface Paging {
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface CorbadoAppParams {
  projectId: string;
  frontendApi?: string;
  apiTimeout?: number;
  isDevMode?: boolean;
  isPreviewMode?: boolean;
}
