import axios from "axios";

import { AssetsApi, ProjectsApi, SessionsApi, UsersApi } from "../api";
import { Configuration } from "../api";
import { getLongSession } from "../utils/helpers/longSession";

export const ApiService = (() => {
  const sessionToken = getLongSession();
  let apiServiceInstance: {
    usersApi: UsersApi;
    assetsApi: AssetsApi;
    projectsApi: ProjectsApi;
    sessionsApi: SessionsApi;
  } | null = null;

  return (
    projectId: string,
    timeout: number = 30 * 1000,
    token: string = sessionToken
  ) => {
    if (apiServiceInstance) {
      return apiServiceInstance;
    }

    const basePath = `https://${projectId}.frontendapi.corbado.io`;
    const config = new Configuration({
      apiKey: projectId,
      basePath,
      accessToken: token,
    });

    const axiosInstance = axios.create({
      timeout: timeout,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        common: {
          "X-Corbado-WC-Version":
            token !== "" ? `Bearer ${token}` : process.env.npm_package_version,
        },
      },
    });
    const usersApi = new UsersApi(config, basePath, axiosInstance);
    const assetsApi = new AssetsApi(config, basePath, axiosInstance);
    const projectsApi = new ProjectsApi(config, basePath, axiosInstance);
    const sessionsApi = new SessionsApi(config, basePath, axiosInstance);

    return (apiServiceInstance = {
      usersApi,
      assetsApi,
      projectsApi,
      sessionsApi,
    });
  };
})();
