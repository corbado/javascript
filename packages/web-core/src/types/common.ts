import type {
  AssetsApi,
  ProjectConfigRspAllOfData,
  ProjectsApi,
  SessionsApi,
  UsersApi,
} from "../api";

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

export type StepFunctionParams = number | string | boolean;
export type StepFunction = (
  projectCOnfig: ProjectConfigRspAllOfData,
  ...args: StepFunctionParams[]
) => string;
export type Flow = Record<string, StepFunction>;
export type Flows = Record<string, Flow>;
