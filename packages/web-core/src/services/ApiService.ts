import type { AxiosInstance } from "axios";
import axios from "axios";

import { AssetsApi, ProjectsApi, SessionsApi, UsersApi } from "../api";
import { Configuration } from "../api";
import { getLongSession } from "../utils/helpers/longSession";

export class ApiService {
  #usersApi: UsersApi = new UsersApi();
  #assetsApi: AssetsApi = new AssetsApi();
  #projectsApi: ProjectsApi = new ProjectsApi();
  #sessionsApi: SessionsApi = new SessionsApi();
  #projectId: string;
  #timeout: number;

  constructor(
    projectId: string,
    timeout: number = 30 * 1000,
    token: string = getLongSession()
  ) {
    this.#projectId = projectId;
    this.#timeout = timeout;
    this.setInstanceWithToken(token);
  }

  get usersApi(): UsersApi {
    return this.#usersApi;
  }

  get assetsApi(): AssetsApi {
    return this.#assetsApi;
  }

  get projectsApi(): ProjectsApi {
    return this.#projectsApi;
  }

  get sessionsApi(): SessionsApi {
    return this.#sessionsApi;
  }

  setInstanceWithToken(token: string) {
    const basePath = `https://${this.#projectId}.frontendapi.corbado.io`;
    const config = new Configuration({
      apiKey: this.#projectId,
      basePath,
      accessToken: token,
    });

    const axiosInstance: AxiosInstance = axios.create({
      timeout: this.#timeout,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        common: {
          "X-Corbado-WC-Version":
            token !== "" ? `Bearer ${token}` : process.env.npm_package_version,
        },
      },
    });

    this.#usersApi = new UsersApi(config, basePath, axiosInstance);
    this.#assetsApi = new AssetsApi(config, basePath, axiosInstance);
    this.#projectsApi = new ProjectsApi(config, basePath, axiosInstance);
    this.#sessionsApi = new SessionsApi(config, basePath, axiosInstance);
  }
}
