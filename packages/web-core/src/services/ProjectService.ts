import type { IProjectConfig } from "../types";
import type { ApiService } from "./ApiService";

export class ProjectService {
  private _projConfig: IProjectConfig | null = null;
  constructor(private readonly _apiService: ApiService) {}

  public get projConfig() {
    return this._projConfig;
  }

  public async getProjectConfig() {
    const resp = await this._apiService.projectsApi.projectConfig();

    const config = resp.data.data;

    this._projConfig = config;
    return this._projConfig;
  }
}
