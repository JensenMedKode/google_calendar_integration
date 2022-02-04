/* istanbul ignore file */

import type EnvironmentSettings from "../types/EnvSettings";
import { logger } from "./logger";

const key = "EnvironmentSettings";

const isomorphicEnvSettings = (): EnvironmentSettings => {
  let envSettings: EnvironmentSettings;

  logger.debug("isomorphicEnvSettings - isBrowser", process.browser);

  if (process.browser) {
    const esStr = window.localStorage.getItem(key);
    envSettings = JSON.parse(esStr);
  } else {
    envSettings = serverEnv();
  }
  return envSettings;
};

export const setEnvSettings = (envSettings: EnvironmentSettings): void => {
  if (process.browser && window) window.localStorage.setItem(key, JSON.stringify(envSettings));
};

export const serverEnv = (): EnvironmentSettings => ({
  buildId: process.env.BUILD_ID,
  backendUrl: process.env.BACKEND_URL
});

export default isomorphicEnvSettings;
