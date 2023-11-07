import type { AssetsApi, ProjectsApi, SessionsApi, UsersApi } from "../api";

export type CookiesDefinition = {
  name: string;
  value: string;
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None";
};

export interface IApiService {
  usersApi: UsersApi;
  assetsApi: AssetsApi;
  projectsApi: ProjectsApi;
  sessionsApi: SessionsApi;
}

export interface IProjectConfig {
  allowUserRegistration: boolean;
  passkeyAppendInterval: string;
  fallbackLanguage: string;
  autoDetectLanguage: boolean;
  userFullNameRequired: boolean;
  webComponentDebug: boolean;
  environment: string;
}
