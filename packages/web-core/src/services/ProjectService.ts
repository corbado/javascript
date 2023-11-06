import type { ProjectConfigRspAllOfData } from "../api";
import type { ApiService } from "./ApiService";

export class ProjectService {
  private _projConfig: ProjectConfigRspAllOfData | null = null;
  constructor(private readonly _apiService: ApiService) {}

  public get projConfig() {
    return this._projConfig;
  }

  public async getProjectConfig() {
    const resp = await this._apiService.projectsApi.projectConfig();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = (resp as any).data as ProjectConfigRspAllOfData;

    this._projConfig = config;
    return config;
  }
}
