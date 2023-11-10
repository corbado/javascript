import type { AxiosInstance } from "axios";
import axios from "axios";

import { AssetsApi, ProjectsApi, SessionsApi, UsersApi } from "../api";
import { Configuration } from "../api";
import { getLongSession } from "../utils/helpers/longSession";

export class ApiService {
  private _usersApi: UsersApi = new UsersApi();
  private _assetsApi: AssetsApi = new AssetsApi();
  private _projectsApi: ProjectsApi = new ProjectsApi();
  private _sessionsApi: SessionsApi = new SessionsApi();
  private _projectId: string;
  private _timeout: number;

  constructor(
    projectId: string,
    timeout: number = 30 * 1000,
    token: string = getLongSession()
  ) {
    this._projectId = projectId;
    this._timeout = timeout;
    this.setInstanceWithToken(token);
  }

  public setInstanceWithToken(token: string) {
    const basePath = `https://${this._projectId}.frontendapi.corbado.io`;
    const config = new Configuration({
      apiKey: this._projectId,
      basePath,
      accessToken: token,
    });

    const axiosInstance: AxiosInstance = axios.create({
      timeout: this._timeout,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        common: {
          "X-Corbado-WC-Version":
            token !== "" ? `Bearer ${token}` : process.env.npm_package_version,
        },
      },
    });

    this._usersApi = new UsersApi(config, basePath, axiosInstance);
    this._assetsApi = new AssetsApi(config, basePath, axiosInstance);
    this._projectsApi = new ProjectsApi(config, basePath, axiosInstance);
    this._sessionsApi = new SessionsApi(config, basePath, axiosInstance);
  }

  public get usersApi(): UsersApi {
    return this._usersApi;
  }

  public get assetsApi(): AssetsApi {
    return this._assetsApi;
  }

  public get projectsApi(): ProjectsApi {
    return this._projectsApi;
  }

  public get sessionsApi(): SessionsApi {
    return this._sessionsApi;
  }
}
